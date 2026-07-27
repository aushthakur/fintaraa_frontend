"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  CircleCheck,
  Clock3,
  FileCheck2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { indianStateOptions } from "@/data/indianStates";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import {
  createServiceRequest,
  type ServiceRequestRecord,
} from "@/services/serviceRequests";
import { ServiceRequestProgress } from "@/components/services/shared/ServiceRequestProgress";
import { ServiceRequestSuccess } from "@/components/services/shared/ServiceRequestSuccess";
import { ServiceRequestTracker } from "@/components/services/shared/ServiceRequestTracker";
import { ServiceInformationGuide } from "@/components/services/shared/ServiceInformationGuide";
import { serviceGuidesBySlug } from "@/components/services/shared/serviceGuideData";
import type { BusinessServiceConfig } from "./businessServiceData";

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ServiceForm = {
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  primary: string;
  secondary: string;
  state: string;
  notes: string;
};

const emptyForm: ServiceForm = {
  name: "",
  mobile: "",
  email: "",
  businessName: "",
  primary: "",
  secondary: "",
  state: "",
  notes: "",
};

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-[12px] font-extrabold text-[#25364a]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 min-w-0 rounded-xl border border-[#d7e1ea] bg-white px-3 text-[13px] font-semibold text-[#20364a] outline-none transition placeholder:font-medium placeholder:text-[#9aa9b7] focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-[12px] font-extrabold text-[#25364a]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 min-w-0 rounded-xl border border-[#d7e1ea] bg-white px-3 text-[13px] font-semibold text-[#52657a] outline-none transition focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function BusinessServiceHero({ config }: { config: BusinessServiceConfig }) {
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [request, setRequest] = useState<ServiceRequestRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  const updateField = (key: keyof ServiceForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nameRegex.test(form.name.trim())) {
      setError("Enter a valid full name.");
      return;
    }
    if (!mobileRegex.test(form.mobile.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!form.primary || !form.secondary || !form.state) {
      setError(
        `Please select ${config.primaryLabel.toLowerCase()}, ${config.secondaryLabel.toLowerCase()} and state.`,
      );
      return;
    }
    if (!whatsappConsent) {
      setError("Please accept WhatsApp communication consent.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const consentPayload = buildWebsiteConsentPayload(
        `website_${config.serviceType}`,
      );
      const result = await createServiceRequest({
        serviceType: config.serviceType,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        businessName: form.businessName.trim(),
        businessType: form.primary,
        state: form.state,
        ...consentPayload,
        details: {
          ...consentPayload,
          serviceName: config.title,
          [config.primaryLabel]: form.primary,
          [config.secondaryLabel]: form.secondary,
          notes: form.notes.trim(),
        },
      });
      setRequest(result);
      setForm(emptyForm);
      setWhatsappConsent(false);
      window.dispatchEvent(
        new CustomEvent("service-request-created", { detail: result }),
      );
    } catch (err) {
      setError((err as Error).message || "Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_78%)] px-4 pb-8 pt-8 md:px-6 md:pt-11 lg:px-8">
      <div className="pointer-events-none absolute -left-28 top-5 h-72 w-72 rounded-full bg-[#dceeff]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-[#e6f8ee]/70 blur-3xl" />

      <div className="mobile-safe-container relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-12">
        <div className="min-w-0 lg:pt-4">
          <h1 className="max-w-2xl text-[32px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#102c45] sm:text-[39px] md:text-[46px] lg:text-[52px]">
            {config.title}
          </h1>
          <p className="mt-4 max-w-xl text-[14px] font-medium leading-7 text-[#53697d] sm:text-[16px] md:text-[17px]">
            {config.description}
          </p>

          <div className="relative mt-4 sm:mt-5">
            <Image
              src={config.image}
              alt={config.imageAlt}
              width={720}
              height={720}
              priority
              unoptimized
              className="mx-auto h-auto w-full max-w-175 object-contain"
            />
          </div>
        </div>

        <div
          id={`${config.slug}-service-form`}
          className="relative mx-auto w-full max-w-150 scroll-mt-48"
        >
          <div className="absolute -right-2 -top-2 h-full w-full rounded-3xl bg-[#075cde] sm:-right-5 sm:-top-5" />
          <div className="relative rounded-3xl border border-[#dce6ee] bg-white p-5 shadow-[0_24px_60px_rgba(16,44,69,0.16)] sm:p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[19px] font-extrabold text-[#172f45] sm:text-[22px]">
                  {config.formTitle}
                </h2>
                <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#75899a] sm:text-[13px]">
                  {config.formDescription}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#075cde]">
                <FileCheck2 className="h-5 w-5" />
              </span>
            </div>

            <form onSubmit={submit} className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <Field
                label="Full Name"
                value={form.name}
                placeholder="Enter full name"
                onChange={(value) => updateField("name", value)}
              />
              <Field
                label="Mobile Number"
                type="tel"
                value={form.mobile}
                placeholder="Enter 10-digit number"
                onChange={(value) => updateField("mobile", value)}
              />
              <Field
                label="Email Address"
                type="email"
                value={form.email}
                placeholder="name@example.com"
                onChange={(value) => updateField("email", value)}
              />
              <Field
                label="Business / Project Name"
                value={form.businessName}
                placeholder="Optional"
                onChange={(value) => updateField("businessName", value)}
              />
              <SelectField
                label={config.primaryLabel}
                value={form.primary}
                placeholder={config.primaryPlaceholder}
                options={config.primaryOptions}
                onChange={(value) => updateField("primary", value)}
              />
              <SelectField
                label={config.secondaryLabel}
                value={form.secondary}
                placeholder={config.secondaryPlaceholder}
                options={config.secondaryOptions}
                onChange={(value) => updateField("secondary", value)}
              />
              <SelectField
                label="State"
                value={form.state}
                placeholder="Select state"
                options={indianStateOptions}
                onChange={(value) => updateField("state", value)}
              />
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[12px] font-extrabold text-[#25364a]">
                  Notes
                </span>
                <input
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Share a brief requirement"
                  className="h-11 min-w-0 rounded-xl border border-[#d7e1ea] bg-white px-3 text-[13px] font-semibold text-[#20364a] outline-none transition placeholder:font-medium placeholder:text-[#9aa9b7] focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10"
                />
              </label>

              <WhatsAppConsent
                checked={whatsappConsent}
                className="sm:col-span-2"
                onChange={(checked) => {
                  setWhatsappConsent(checked);
                  if (checked) setError("");
                }}
              />

              {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] font-bold leading-5 text-red-700 sm:col-span-2">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#13a653] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(19,166,83,0.22)] transition hover:bg-[#0f8f45] disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {config.submitLabel}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#8998a6] sm:col-span-2">
                <LockKeyhole className="h-3.5 w-3.5 text-[#13a653]" />
                Secure public inquiry—login is not required
              </p>
            </form>
          </div>
        </div>
      </div>

      {request ? (
        <div className="mobile-safe-container relative mt-9 grid gap-5">
          <ServiceRequestSuccess
            request={request}
            title={config.successTitle}
            message={config.successMessage}
          />
          <ServiceRequestProgress request={request} />
        </div>
      ) : null}

      <div className="mobile-safe-container relative mt-9 grid gap-3 border-t border-[#e1ebf3] pt-6 md:grid-cols-3">
        {config.trustPoints.map((item, index) => {
          const Icon = [UserRound, ShieldCheck, Clock3][index] || ShieldCheck;
          return (
            <article
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-[#dce8f2] bg-white p-4 shadow-[0_10px_28px_rgba(16,44,69,0.05)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#075cde]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[14px] font-extrabold text-[#19354d]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[12px] font-medium leading-5 text-[#718598]">
                  {item.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BusinessServiceDetails({
  config,
}: {
  config: BusinessServiceConfig;
}) {
  return (
    <section className="bg-white px-4 py-9 md:px-6 md:py-12 lg:px-8">
      <div className="mobile-safe-container rounded-3xl border border-[#dce7ef] bg-white p-5 shadow-[0_20px_55px_rgba(16,44,69,0.06)] sm:p-7 md:p-8">
        <div className="max-w-3xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#075cde]">
            Expert-assisted service
          </p>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-[-0.02em] text-[#102c45] sm:text-[31px]">
            What we can help you with
          </h2>
          <p className="mt-2 text-[13px] font-medium leading-6 text-[#718598] sm:text-[14px]">
            A clear workflow from requirement review to final submission or
            delivery.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {config.serviceCards.map((card, index) => (
            <article
              key={card.title}
              className={`rounded-2xl border p-5 sm:p-6 ${
                index === 0
                  ? "border-[#c9e1f3] bg-[#eef8ff]"
                  : "border-[#ccebd9] bg-[#f0fbf5]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#075cde] shadow-sm">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#17364f]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] font-medium leading-6 text-[#60778a]">
                    {card.text}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-2.5">
                {card.rows.map((row) => (
                  <p
                    key={row}
                    className="flex items-start gap-2.5 text-[13px] font-semibold leading-5 text-[#455d71]"
                  >
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#13a653]" />
                    {row}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#e4edf3] pt-6 md:grid-cols-4">
          {config.benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2.5 rounded-xl bg-[#f7faff] px-3 py-3 text-[12px] font-extrabold leading-5 text-[#31516b]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#075cde]" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BusinessServicePage({
  config,
}: {
  config: BusinessServiceConfig;
}) {
  const guide = serviceGuidesBySlug[config.slug];

  return (
    <main className="bg-white">
      <BusinessServiceHero config={config} />
      <BusinessServiceDetails config={config} />
      {guide ? (
        <ServiceInformationGuide
          config={guide}
          formAnchor={`${config.slug}-service-form`}
        />
      ) : null}
      <ServiceRequestTracker
        title={config.trackingTitle}
        idLabel={config.trackingIdLabel}
        serviceType={config.serviceType}
      />
      <AppDownloadBanner />
    </main>
  );
}
