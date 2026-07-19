"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarCheck2,
  FileCheck2,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { ServiceRequestProgress } from "@/components/services/shared/ServiceRequestProgress";
import {
  createServiceRequest,
  ServiceRequestRecord,
} from "@/services/serviceRequests";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { ServiceRequestSuccess } from "@/components/services/shared/ServiceRequestSuccess";

const trustBadges = [
  {
    label: "Expert CA Support",
    text: "CA-led guidance for registration, filing and document review.",
    icon: UserRound,
    badgeIcon: FileCheck2,
    accent: "bg-[#e8f4ff] text-[#005ca8]",
  },
  {
    label: "100% Compliant",
    text: "Structured process aligned with GST rules and government checks.",
    icon: ShieldCheck,
    badgeIcon: BadgeCheck,
    accent: "bg-[#e8f8ef] text-[#13a653]",
  },
  {
    label: "Timely Filing",
    text: "Deadline-focused tracking with clear updates at every stage.",
    icon: CalendarCheck2,
    badgeIcon: ShieldCheck,
    accent: "bg-[#fff6e8] text-[#d97706]",
  },
];

const businessTypes = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "LLP",
  "Others",
];

const gstRequirements = [
  "New GST Registration",
  "GST Filing",
  "GST Amendment",
  "GST Consultation",
];

const states = [
  "Delhi",
  "Haryana",
  "Uttar Pradesh",
  "Maharashtra",
  "Karnataka",
  "Other",
];

const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

export function GstHero() {
  const [form, setForm] = useState({
    businessName: "",
    mobile: "",
    businessType: "",
    gstRequirement: "",
    state: "",
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
    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!mobileRegex.test(form.mobile.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.businessType || !form.gstRequirement || !form.state) {
      setError("Please select business type, GST requirement and state.");
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
        "website_gst_registration",
      );
      const result = await createServiceRequest({
        serviceType: "gst_registration",
        businessName: form.businessName.trim(),
        mobile: form.mobile.trim(),
        businessType: form.businessType,
        gstRequirement: form.gstRequirement,
        state: form.state,
        ...consentPayload,
      });
      setRequest(result);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("service-request-created", { detail: result }),
        );
      }
    } catch (err) {
      setError((err as Error).message || "Unable to submit GST request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 pb-0 pt-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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

        <div className="flex flex-col z-10 lg:pl-10">
          <h1 className="max-w-xl text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#005ca8] sm:text-[34px] md:text-[38px] lg:text-[46px] xl:text-[52px]">
            GST Registration & <span className="block">GST Filing</span>
          </h1>
          <p className="mt-4 text-[15px] font-medium text-[#111827] sm:text-base md:text-[17px] lg:text-[19px]">
            Complete GST registration, filing and compliance with guided expert
            support.
          </p>
          <div className="relative mx-auto w-full mt-6 h-full">
            <Image
              width={100}
              unoptimized
              height={100}
              alt="GST services"
              src="/assets/services/gst-hero.png"
              className="object-contain w-4/5 mx-auto"
            />
          </div>
        </div>

        <div
          id="gst-service-form"
          className="relative mx-auto w-full max-w-140 scroll-mt-48"
        >
          <div className="absolute -right-4 -top-4 h-full w-85 rounded-xl bg-[#005ca8] sm:w-95 md:w-105 lg:w-115" />
          <div className="relative rounded-xl bg-white p-5 shadow-[0_18px_45px_rgba(16,24,40,0.12)] sm:p-6 md:p-7">
            <h2 className="text-base font-extrabold text-[#2a2f36] sm:text-lg md:text-[20px] lg:text-[22px]">
              Get Started with GST Services
            </h2>
            <p className="mt-1.5 text-[13px] font-semibold leading-6 text-[#8b95a3] sm:text-sm md:text-[15px]">
              Fill in your business details and our expert will get in touch
              with you.
            </p>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
              <label className="grid gap-1 sm:gap-1.5">
                <span className="text-[13px] font-extrabold text-[#2a2f36] sm:text-sm">
                  Business Name
                </span>
                <input
                  value={form.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  placeholder="Enter registered or trade name"
                  className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-[13px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] sm:h-11 sm:text-sm"
                />
              </label>
              <label className="grid gap-1 sm:gap-1.5">
                <span className="text-[13px] font-extrabold text-[#2a2f36] sm:text-sm">
                  Mobile Number
                </span>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(event) =>
                    updateField("mobile", event.target.value)
                  }
                  placeholder="Enter 10-digit mobile number"
                  className="h-10 rounded-lg border border-[#d9dfe8] px-3 text-[13px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] sm:h-11 sm:text-sm"
                />
              </label>
              {[
                [
                  "businessType",
                  "Business Type",
                  "Select Business Type",
                  businessTypes,
                ],
                [
                  "gstRequirement",
                  "GST Requirement",
                  "Select GST Requirement",
                  gstRequirements,
                ],
                ["state", "State", "Select State", states],
              ].map(([key, label, placeholder, options]) => (
                <label key={String(key)} className="grid gap-1 sm:gap-1.5">
                  <span className="text-[13px] font-extrabold text-[#2a2f36] sm:text-sm">
                    {String(label)}
                  </span>
                  <select
                    value={form[key as keyof typeof form]}
                    onChange={(event) =>
                      updateField(key as keyof typeof form, event.target.value)
                    }
                    className="h-10 rounded-lg border border-[#d9dfe8] bg-white px-3 text-[13px] font-semibold text-[#475467] outline-none focus:border-[#005ca8] sm:h-11 sm:text-sm"
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
                className="mx-auto mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#13a653] text-sm font-extrabold text-white transition hover:bg-[#0f8f45] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-semibold text-[#a0a7b2] sm:text-[13px] md:text-sm">
                <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Your information is safe with us
              </p>
            </div>
          </div>
        </div>
      </div>

      {request ? (
        <div className="mx-auto mt-8 grid max-w-9xl gap-5">
          <ServiceRequestSuccess
            request={request}
            title="Thank you! Your GST request has been submitted."
            message="We have created your GST service request. Our compliance team will verify the details and guide you on the required documents."
          />
          <ServiceRequestProgress request={request} />
        </div>
      ) : null}

      <div className="mx-auto mt-8 max-w-9xl pb-8">
        <div className="grid gap-4 border-t border-[#e6eef8] pt-6 md:grid-cols-3">
          {trustBadges.map(
            ({ label, text, icon: Icon, badgeIcon: BadgeIcon, accent }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-[#dce8f5] bg-white p-4 shadow-[0_12px_30px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 hover:border-[#bcd8f2] hover:shadow-[0_18px_38px_rgba(16,24,40,0.08)]"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e8f4ff] opacity-70 transition group-hover:scale-110" />
                <div className="relative flex items-start gap-4">
                  <span
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${accent}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.4} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-extrabold text-[#1f2937] md:text-[17px]">
                        {label}
                      </h3>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f8ff] text-[#005ca8]">
                        <BadgeIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] font-semibold leading-6 text-[#667085]">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
