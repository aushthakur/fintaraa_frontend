"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Star,
  X,
} from "lucide-react";
import {
  fetchActivePopupCampaigns,
  submitPopupResponse,
  type PopupCampaign,
  type PopupFormField,
} from "@/services/popupCampaigns";
import { captureWebsiteAttribution } from "@/services/attribution";

const SESSION_ID_KEY = "fintaraa_engagement_session";
const VISITOR_ID_KEY = "fintaraa_engagement_visitor";
const POPUP_SESSION_PREFIX = "fintaraa_popup_session:";
const POPUP_DAY_PREFIX = "fintaraa_popup_day:";

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const storageId = (storage: Storage, key: string) => {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = createId();
  storage.setItem(key, value);
  return value;
};

const localDay = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const canShowByFrequency = (campaign: PopupCampaign) => {
  try {
    if (campaign.frequency === "once_per_session") {
      return !window.sessionStorage.getItem(
        `${POPUP_SESSION_PREFIX}${campaign._id}`,
      );
    }
    if (campaign.frequency === "once_per_day") {
      return (
        window.localStorage.getItem(`${POPUP_DAY_PREFIX}${campaign._id}`) !==
        localDay()
      );
    }
    return true;
  } catch {
    return true;
  }
};

const markShown = (campaign: PopupCampaign) => {
  try {
    if (campaign.frequency === "once_per_session") {
      window.sessionStorage.setItem(
        `${POPUP_SESSION_PREFIX}${campaign._id}`,
        "shown",
      );
    }
    if (campaign.frequency === "once_per_day") {
      window.localStorage.setItem(
        `${POPUP_DAY_PREFIX}${campaign._id}`,
        localDay(),
      );
    }
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
};

const deviceType = (): "mobile" | "tablet" | "desktop" => {
  if (window.innerWidth <= 767) return "mobile";
  if (window.innerWidth <= 1024) return "tablet";
  return "desktop";
};

const initialValues = (campaign: PopupCampaign) =>
  Object.fromEntries(
    (campaign.formFields || []).map((field) => [
      field.name,
      field.type === "checkbox" ? false : "",
    ]),
  ) as Record<string, string | number | boolean>;

const isFormPopup = (campaign: PopupCampaign) =>
  campaign.popupType === "lead_capture" || campaign.popupType === "survey";

export function GlobalPopupManager() {
  const pathname = usePathname();
  const [active, setActive] = useState<PopupCampaign | null>(null);
  const [values, setValues] = useState<
    Record<string, string | number | boolean>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let triggerTimer: number | undefined;
    let retryTimer: number | undefined;
    let removeTriggerListener: () => void = () => undefined;

    queueMicrotask(() => {
      if (disposed) return;
      setActive(null);
      setSubmitted(false);
      setSuccessMessage("");
      setError("");
    });

    const openWhenAvailable = (campaign: PopupCampaign, retries = 0) => {
      if (disposed || !canShowByFrequency(campaign)) return;
      const otherDialog = document.querySelector(
        "[role='dialog'][aria-modal='true']",
      );
      if (otherDialog && retries < 30) {
        retryTimer = window.setTimeout(
          () => openWhenAvailable(campaign, retries + 1),
          1000,
        );
        return;
      }
      if (otherDialog) return;
      markShown(campaign);
      setValues(initialValues(campaign));
      setSubmitted(false);
      setSuccessMessage("");
      setError("");
      setActive(campaign);
    };

    void fetchActivePopupCampaigns(pathname).then((campaigns) => {
      if (disposed) return;
      const campaign = campaigns.find(canShowByFrequency);
      if (!campaign) return;

      if (campaign.triggerType === "time_delay") {
        triggerTimer = window.setTimeout(
          () => openWhenAvailable(campaign),
          Math.max(Number(campaign.delaySeconds) || 1, 1) * 1000,
        );
        return;
      }
      if (campaign.triggerType === "scroll_percentage") {
        const onScroll = () => {
          const pageHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
          );
          const progress = pageHeight
            ? ((window.scrollY + window.innerHeight) / pageHeight) * 100
            : 100;
          if (progress >= Number(campaign.scrollPercentage || 50)) {
            window.removeEventListener("scroll", onScroll);
            openWhenAvailable(campaign);
          }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        removeTriggerListener = () =>
          window.removeEventListener("scroll", onScroll);
        onScroll();
        return;
      }
      if (campaign.triggerType === "exit_intent") {
        const onMouseLeave = (event: MouseEvent) => {
          if (event.clientY > 5) return;
          document.removeEventListener("mouseleave", onMouseLeave);
          openWhenAvailable(campaign);
        };
        document.addEventListener("mouseleave", onMouseLeave);
        removeTriggerListener = () =>
          document.removeEventListener("mouseleave", onMouseLeave);
        return;
      }
      triggerTimer = window.setTimeout(
        () => openWhenAvailable(campaign),
        250,
      );
    });

    return () => {
      disposed = true;
      if (triggerTimer) window.clearTimeout(triggerTimer);
      if (retryTimer) window.clearTimeout(retryTimer);
      removeTriggerListener();
    };
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && active.dismissible) setActive(null);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("button, a, input, textarea, select")
        ?.focus();
    }, 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  if (!active) return null;

  const close = () => {
    if (active.dismissible) setActive(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const message = await submitPopupResponse(active._id, {
        values,
        sourcePage: pathname,
        pageUrl: window.location.href,
        sessionId: storageId(window.sessionStorage, SESSION_ID_KEY),
        visitorId: storageId(window.localStorage, VISITOR_ID_KEY),
        deviceType: deviceType(),
        attribution: captureWebsiteAttribution(),
      });
      setSubmitted(true);
      setSuccessMessage(
        message ||
          active.successMessage ||
          "Thank you. We have received your response.",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your response could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={active.heading || active.name}
        data-analytics-popup
        data-analytics-name={active.name}
        data-analytics-placement={`managed_popup:${active._id}`}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/60 bg-white"
      >
        {active.dismissible ? (
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close popup"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        {active.contentType === "image" && active.imageUrl ? (
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={active.mobileImageUrl || active.imageUrl}
            />
            <img
              src={active.imageUrl}
              alt={active.imageAlt || active.heading || active.name}
              className="max-h-[70vh] w-full rounded-t-3xl object-contain sm:max-h-[45vh] sm:object-cover"
            />
          </picture>
        ) : null}

        <div className="p-5 sm:p-7">
          {submitted ? (
            <div className="py-7 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-xl font-extrabold text-slate-950">
                Response received
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {active.heading ? (
                <h2 className="pr-8 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  {active.heading}
                </h2>
              ) : null}
              {active.description ? (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {active.description}
                </p>
              ) : null}
              {active.contentType === "html" && active.htmlContent ? (
                <div
                  className="prose prose-slate mt-4 max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: active.htmlContent }}
                />
              ) : null}

              {isFormPopup(active) ? (
                <form onSubmit={submit} className="mt-5 space-y-4">
                  {(active.formFields || []).map((field) => (
                    <PopupFieldInput
                      key={field._id || field.name}
                      field={field}
                      value={values[field.name]}
                      onChange={(value) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: value,
                        }))
                      }
                    />
                  ))}
                  {error ? (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                    >
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    data-analytics-category="popup"
                    data-analytics-name={`${active.name} form submit`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    {active.submitButtonText || "Submit"}
                  </button>
                </form>
              ) : active.ctaText && active.ctaUrl ? (
                <a
                  href={active.ctaUrl}
                  data-analytics-category="popup"
                  data-analytics-name={`${active.name} CTA`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-700"
                >
                  {active.ctaText}
                </a>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PopupFieldInput({
  field,
  value,
  onChange,
}: {
  field: PopupFormField;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
}) {
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500";
  const label = (
    <span className="mb-1.5 block text-xs font-bold text-slate-700">
      {field.label}
      {field.required ? <span className="ml-1 text-red-600">*</span> : null}
    </span>
  );

  if (field.type === "textarea") {
    return (
      <label className="block">
        {label}
        <textarea
          rows={4}
          required={field.required}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      </label>
    );
  }
  if (field.type === "select") {
    return (
      <label className="block">
        {label}
        <select
          required={field.required}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (field.type === "radio") {
    return (
      <fieldset>
        <legend>{label}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(field.options || []).map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
            >
              <input
                type="radio"
                name={field.name}
                required={field.required}
                checked={value === option}
                onChange={() => onChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <input
          type="checkbox"
          required={field.required}
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300"
        />
        <span>
          {field.label}
          {field.required ? <span className="ml-1 text-red-600">*</span> : null}
        </span>
      </label>
    );
  }
  if (field.type === "rating") {
    const rating = Number(value || 0);
    return (
      <fieldset>
        <legend>{label}</legend>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => onChange(option)}
              aria-label={`${option} out of 5`}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                option <= rating
                  ? "border-amber-300 bg-amber-50 text-amber-500"
                  : "border-slate-200 text-slate-300"
              }`}
            >
              <Star
                className="h-5 w-5"
                fill={option <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        <input
          tabIndex={-1}
          aria-hidden="true"
          required={field.required}
          value={rating || ""}
          onChange={() => undefined}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      </fieldset>
    );
  }

  return (
    <label className="block">
      {label}
      <input
        type={field.type}
        required={field.required}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(event) =>
          onChange(
            field.type === "number"
              ? event.target.value
                ? Number(event.target.value)
                : ""
              : event.target.value,
          )
        }
        className={inputClass}
      />
    </label>
  );
}
