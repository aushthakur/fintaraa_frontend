"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  type LucideIcon,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { buildApiUrl } from "@/services/apiUrl";

type FormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  message: "",
};

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cityRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;

const contactLinks = [
  {
    label: "Call",
    value: "+91 84482 82680",
    href: "tel:+918448282680",
    icon: Phone,
  },
  {
    label: "WhatsApp",
    value: "+91 84482 82680",
    href: "https://wa.me/918448282680",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Email",
    value: "customercare@fintaraa.com",
    href: "mailto:customercare@fintaraa.com",
    icon: Mail,
  },
];

export function ContactConsultationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isDirty = useMemo(
    () => Object.values(form).some((value) => value.trim().length > 0),
    [form],
  );

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const mobile = form.mobile.trim().replace(/[\s-]/g, "");

    if (!nameRegex.test(form.fullName.trim())) {
      nextErrors.fullName = "Enter your full name using letters only.";
    }
    if (!mobileRegex.test(mobile)) {
      nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!cityRegex.test(form.city.trim())) {
      nextErrors.city = "Enter a valid city name.";
    }
    if (form.message.trim().length > 1000) {
      nextErrors.message = "Message must be under 1000 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!validate()) return;
    const url = buildApiUrl("/contact-requests");
    if (!url) {
      setSubmitError("Contact API is not configured. Please try again later.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
          message: form.message.trim(),
          source: "website_contact_page",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          result?.message || "We could not submit your request right now.",
        );
      }

      setSubmitSuccess(true);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl bg-white">
      <div className="mb-4 flex flex-col gap-4 border-[#eef2f6] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#1d5fbf]">
            Callback Request
          </p>
          <h3 className="mt-1 text-[22px] font-extrabold text-[#111827]">
            Tell us how to reach you
          </h3>
          <p className="mt-1 text-[13px] leading-6 text-[#667085]">
            Our team usually responds within one business day.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Full Name"
          value={form.fullName}
          error={errors.fullName}
          icon={User}
          autoComplete="name"
          placeholder="e.g. Rishabh Gupta"
          onChange={(value) => updateField("fullName", value)}
        />
        <Field
          label="Mobile Number"
          value={form.mobile}
          error={errors.mobile}
          icon={Phone}
          autoComplete="tel"
          inputMode="tel"
          maxLength={14}
          placeholder="e.g. 9876543210"
          onChange={(value) => updateField("mobile", value)}
        />
        <Field
          label="Email Address"
          value={form.email}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          placeholder="e.g. name@example.com"
          onChange={(value) => updateField("email", value)}
        />
        <Field
          label="City"
          value={form.city}
          error={errors.city}
          icon={MapPin}
          autoComplete="address-level2"
          placeholder="e.g. New Delhi"
          onChange={(value) => updateField("city", value)}
        />
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[12px] font-bold text-[#344054]">
          Message{" "}
          <span className="font-semibold text-[#98a2b3]">(optional)</span>
        </span>
        <div
          className={`relative rounded-2xl border bg-white transition ${
            errors.message
              ? "border-[#f04438] shadow-[0_0_0_3px_rgba(240,68,56,0.08)]"
              : "border-[#d9e3ef] focus-within:border-[#1d5fbf] focus-within:shadow-[0_0_0_3px_rgba(29,95,191,0.08)]"
          }`}
        >
          <MessageSquare className="absolute left-4 top-3.5 h-4 w-4 text-[#7a8aa0]" />
          <textarea
            rows={4}
            value={form.message}
            maxLength={1000}
            placeholder="Tell us what you need help with, preferred callback time, or any context."
            onChange={(event) => updateField("message", event.target.value)}
            className="min-h-28 w-full resize-none rounded-2xl bg-transparent py-3 pl-11 pr-4 text-[14px] font-medium text-[#111827] outline-none placeholder:text-[#98a2b3]"
          />
        </div>
        {errors.message ? (
          <span className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#d92d20]">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.message}
          </span>
        ) : (
          <span className="mt-1.5 block text-[11px] font-medium text-[#98a2b3]">
            {form.message.length}/1000 characters
          </span>
        )}
      </label>

      {submitError ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-[13px] font-semibold text-[#b42318]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {submitError}
        </div>
      ) : null}

      {submitSuccess ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[13px] font-semibold text-[#027a48]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Request submitted. Our team will contact you shortly.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#16b654] px-7 text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(22,182,84,0.24)] transition hover:-translate-y-0.5 hover:bg-[#119b48] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Request Call Back
            <Send className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-4 text-center space-y-1 flex flex-col justify-center w-full">
        {contactLinks.map(({ label, value, href, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex mx-auto w-full items-center gap-2 rounded-2xl bg-[#fbfdff] px-3 text-[#344054] no-underline transition"
          >
            <span className="min-w-full flex mx-auto justify-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#667085]">
                {label}:{" "}
              </span>
              <span className="truncate text-[12px] font-extrabold">
                {value}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] font-medium text-[#98a2b3]">
        By submitting, you agree to be contacted by Fintaraa support.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  error,
  icon: Icon,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  icon: LucideIcon;
  placeholder: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  maxLength?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold text-[#344054]">
        {label}
      </span>
      <span
        className={`relative flex h-12 items-center rounded-2xl border bg-white transition ${
          error
            ? "border-[#f04438] shadow-[0_0_0_3px_rgba(240,68,56,0.08)]"
            : "border-[#d9e3ef] focus-within:border-[#1d5fbf] focus-within:shadow-[0_0_0_3px_rgba(29,95,191,0.08)]"
        }`}
      >
        <Icon className="ml-4 h-4 w-4 shrink-0 text-[#7a8aa0]" />
        <input
          value={value}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 rounded-2xl bg-transparent px-3 text-[14px] font-medium text-[#111827] outline-none placeholder:text-[#98a2b3]"
        />
      </span>
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#d92d20]">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      ) : null}
    </label>
  );
}
