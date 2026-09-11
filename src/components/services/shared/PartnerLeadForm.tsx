"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { ServiceRequestProgress } from "@/components/services/shared/ServiceRequestProgress";
import { ServiceRequestSuccess } from "@/components/services/shared/ServiceRequestSuccess";
import {
  createServiceRequest,
  type ServiceRequestRecord,
  type ServiceRequestType,
} from "@/services/serviceRequests";

type PartnerLeadFormProps = {
  serviceType: Extract<ServiceRequestType, "dsa_partner" | "franchise_partner">;
  source: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  primarySelectLabel: string;
  primarySelectPlaceholder: string;
  primaryOptions: string[];
  primaryFieldKey?: string;
  secondarySelectLabel: string;
  secondarySelectPlaceholder: string;
  secondaryOptions: string[];
  secondaryFieldKey?: string;
};

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function PartnerLeadForm({
  serviceType,
  source,
  submitLabel,
  successTitle,
  successMessage,
  primarySelectLabel,
  primarySelectPlaceholder,
  primaryOptions,
  primaryFieldKey,
  secondarySelectLabel,
  secondarySelectPlaceholder,
  secondaryOptions,
  secondaryFieldKey,
}: PartnerLeadFormProps) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    businessName: "",
    primary: "",
    secondary: "",
    notes: "",
  });
  const [request, setRequest] = useState<ServiceRequestRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submit = async () => {
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
    if (!form.city.trim()) {
      setError("Enter your city.");
      return;
    }
    if (!form.primary || !form.secondary) {
      setError(`Please select ${primarySelectLabel.toLowerCase()} and ${secondarySelectLabel.toLowerCase()}.`);
      return;
    }
    if (!whatsappConsent) {
      setError("Please accept WhatsApp communication consent.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const consentPayload = buildWebsiteConsentPayload(source);
      const result = await createServiceRequest({
        serviceType,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        businessName: form.businessName.trim(),
        state: form.city.trim(),
        ...consentPayload,
        details: {
          ...consentPayload,
          city: form.city.trim(),
          businessName: form.businessName.trim(),
          [primarySelectLabel]: form.primary,
          [secondarySelectLabel]: form.secondary,
          ...(primaryFieldKey ? { [primaryFieldKey]: form.primary } : {}),
          ...(secondaryFieldKey
            ? { [secondaryFieldKey]: form.secondary }
            : {}),
          notes: form.notes.trim(),
        },
      });
      setRequest(result);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("service-request-created", { detail: result }),
        );
      }
      setForm({
        name: "",
        mobile: "",
        email: "",
        city: "",
        businessName: "",
        primary: "",
        secondary: "",
        notes: "",
      });
      setWhatsappConsent(false);
    } catch (err) {
      setError((err as Error).message || "Unable to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Field
          label="Full Name"
          value={form.name}
          placeholder="Enter full name"
          onChange={(value) => updateField("name", value)}
        />
        <Field
          label="Mobile Number"
          value={form.mobile}
          placeholder="9876543210"
          type="tel"
          onChange={(value) => updateField("mobile", value)}
        />
        <Field
          label="Email Address"
          value={form.email}
          placeholder="name@example.com"
          type="email"
          onChange={(value) => updateField("email", value)}
        />
        <Field
          label="City"
          value={form.city}
          placeholder="Enter city"
          onChange={(value) => updateField("city", value)}
        />
        <Field
          label="Company / Business Name"
          value={form.businessName}
          placeholder="Optional"
          onChange={(value) => updateField("businessName", value)}
        />
        <SelectField
          label={primarySelectLabel}
          value={form.primary}
          placeholder={primarySelectPlaceholder}
          options={primaryOptions}
          onChange={(value) => updateField("primary", value)}
        />
        <SelectField
          label={secondarySelectLabel}
          value={form.secondary}
          placeholder={secondarySelectPlaceholder}
          options={secondaryOptions}
          onChange={(value) => updateField("secondary", value)}
        />
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-[12px] font-extrabold text-[#22272e]">
            Notes
          </span>
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Share your preferred location, business profile, or partnership expectations"
            className="min-h-24 rounded-xl border border-[#d7dfe9] bg-white px-3 py-3 text-[13px] font-semibold outline-none placeholder:text-[#98a2b3] focus:border-[#6d28d9]"
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
          <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700 sm:col-span-2">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1cb45c] px-8 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(28,180,92,0.2)] transition hover:bg-[#16954d] disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2 sm:mx-auto sm:w-auto sm:min-w-64"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#a0a8b6] sm:col-span-2">
          <LockKeyhole className="h-3.5 w-3.5" />
          Your information is safe with us
        </p>
      </form>

      {request ? (
        <div className="grid gap-4">
          <ServiceRequestSuccess
            request={request}
            title={successTitle}
            message={successMessage}
          />
          <ServiceRequestProgress request={request} />
        </div>
      ) : null}
    </div>
  );
}

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
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-extrabold text-[#22272e]">
        {label}
      </span>
      <input
        type={type}
        inputMode={type === "tel" ? "numeric" : type === "email" ? "email" : "text"}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-[#d7dfe9] bg-white px-3 text-[13px] font-semibold outline-none placeholder:text-[#98a2b3] focus:border-[#6d28d9]"
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
    <label className="grid gap-1.5">
      <span className="text-[12px] font-extrabold text-[#22272e]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-[#d7dfe9] bg-white px-3 text-[13px] font-semibold text-[#475467] outline-none focus:border-[#6d28d9]"
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
