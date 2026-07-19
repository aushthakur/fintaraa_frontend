"use client";

import Image from "next/image";
import { useState } from "react";
import { Clock, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { ServiceRequestProgress } from "@/components/services/shared/ServiceRequestProgress";
import {
  createServiceRequest,
  ServiceRequestRecord,
} from "@/services/serviceRequests";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { ServiceRequestSuccess } from "@/components/services/shared/ServiceRequestSuccess";

const employmentTypes = [
  "Salaried",
  "Self Employed",
  "Business Owner",
  "Professional",
  "Other",
];

const annualIncomeOptions = [
  "Below ₹5 lakh",
  "₹5 lakh - ₹10 lakh",
  "₹10 lakh - ₹25 lakh",
  "Above ₹25 lakh",
];

const features = [
  {
    title: "Expert Assistance",
    text: "File your ITR with experienced CA partners",
    icon: ShieldCheck,
  },
  {
    title: "100% Secure",
    text: "Your data is encrypted and completely safe",
    icon: LockKeyhole,
  },
  {
    title: "Accurate & Timely",
    text: "Accurate filing with on-time submission guarantee",
    icon: Clock,
  },
];

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

export function ItrHero() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    employmentType: "",
    annualIncome: "",
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
    if (!form.employmentType || !form.annualIncome) {
      setError("Please select employment type and annual income.");
      return;
    }
    if (!whatsappConsent) {
      setError("Please accept WhatsApp communication consent.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const consentPayload = buildWebsiteConsentPayload("website_itr_filing");
      const result = await createServiceRequest({
        serviceType: "itr_filing",
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        employmentType: form.employmentType,
        annualIncome: form.annualIncome,
        ...consentPayload,
      });
      setRequest(result);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("service-request-created", { detail: result }),
        );
      }
    } catch (err) {
      setError((err as Error).message || "Unable to submit ITR request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        <div
          className="absolute hidden bg-[#e0effe] md:block"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        <div
          className="absolute hidden bg-[#e0effe] md:block"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>

      <div className="mobile-safe-container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#1a6bc6] sm:text-[34px] md:text-[40px] lg:text-[48px] xl:text-[54px]">
            ITR Filing
          </h1>
          <p className="mt-3 max-w-sm text-[15px] font-medium leading-6 text-[#1f2937] sm:text-base md:max-w-xl md:text-[17px] lg:text-[19px]">
            File your Income Tax Return easily and stay 100% compliant
          </p>
          <div className="relative mt-6 min-h-50 sm:min-h-65 md:min-h-75 lg:min-h-85 xl:min-h-95">
            <Image
              src="/assets/services/itr-hero.png"
              alt="ITR filing"
              fill
              unoptimized
              className="object-contain object-center"
            />
          </div>
        </div>

        <div
          id="itr-filing-service-form"
          className="relative mx-auto w-full max-w-140 scroll-mt-48"
        >
          <div className="absolute -right-7 -top-7 h-full w-85 rounded-2xl bg-[#005ca8] sm:w-95 md:w-105 lg:w-115" />
          <div className="relative rounded-2xl bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.14)] sm:p-6 md:p-8">
            <h2 className="text-lg font-bold text-[#1f2937] sm:text-xl md:text-[22px] lg:text-[24px]">
              Get Started with ITR Filing
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-6 text-[#8b95a3] sm:text-sm md:text-[15px]">
              Fill in your details and our expert will get in touch with you.
            </p>
            <form className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
              <label className="grid gap-1.5 sm:gap-2">
                <span className="text-[13px] font-bold text-[#1f2937] sm:text-sm">
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter full name as per PAN"
                  className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] sm:h-11 sm:text-sm md:h-12"
                />
              </label>
              <label className="grid gap-1.5 sm:gap-2">
                <span className="text-[13px] font-bold text-[#1f2937] sm:text-sm">
                  Mobile Number
                </span>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(event) => updateField("mobile", event.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] sm:h-11 sm:text-sm md:h-12"
                />
              </label>
              {[
                ["employmentType", "Employment Type", "Select Employment Type", employmentTypes],
                ["annualIncome", "Annual Income", "Select Annual Income", annualIncomeOptions],
              ].map(([key, label, placeholder, options]) => (
                <label key={String(key)} className="grid gap-1.5 sm:gap-2">
                  <span className="text-[13px] font-bold text-[#1f2937] sm:text-sm">
                    {String(label)}
                  </span>
                  <select
                    value={form[key as keyof typeof form]}
                    onChange={(event) =>
                      updateField(key as keyof typeof form, event.target.value)
                    }
                    className="h-10 rounded-lg border border-[#d9dfe8] bg-white px-3 text-[13px] font-medium text-[#475467] outline-none focus:border-[#005ca8] sm:h-11 sm:text-sm md:h-12"
                  >
                    <option value="">{String(placeholder)}</option>
                    {(options as string[]).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}

              <WhatsAppConsent
                checked={whatsappConsent}
                onChange={(checked) => {
                  setWhatsappConsent(checked);
                  if (checked) setError("");
                }}
              />

              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-bold text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="mx-auto mt-2 inline-flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1cb45c] to-[#28cf6c] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 sm:h-12"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[13px] font-medium text-[#a0a7b2]">
                Your information is safe with us
              </p>
            </form>
          </div>
        </div>
      </div>

      {request ? (
        <div className="mobile-safe-container mt-8 grid gap-5">
          <ServiceRequestSuccess
            request={request}
            title="Thank you! Your ITR filing request has been submitted."
            message="We have created your ITR service request. Our tax expert will review your profile and contact you for the next steps."
          />
          <ServiceRequestProgress request={request} />
        </div>
      ) : null}

      <div className="mobile-safe-container mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
        {features.map(({ title, text, icon: Icon }) => (
          <div key={title} className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d8ecff] text-[#1a6bc6] sm:h-14 sm:w-14 md:h-16 md:w-16">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#1f2937] sm:text-base md:text-[17px] lg:text-[18px]">
                {title}
              </span>
              <span className="mt-1 block text-sm font-medium leading-5 text-[#98a2b3] md:text-[15px]">
                {text}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
