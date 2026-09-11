"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { ServiceRequestProgress } from "@/components/services/shared/ServiceRequestProgress";
import { ServiceRequestSuccess } from "@/components/services/shared/ServiceRequestSuccess";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import {
  createServiceRequest,
  type ServiceRequestRecord,
} from "@/services/serviceRequests";

const services = [
  {
    title: "Private Limited Company",
    text: "Incorporate your company with expert assisted documentation.",
    image: "/assets/services/company/private-limited-icon.png",
  },
  {
    title: "LLP Registration",
    text: "Set up an LLP with guided partner and compliance support.",
    image: "/assets/services/company/llp-registration-icon.png",
  },
  {
    title: "One Person Company",
    text: "Start your OPC with clear filing and document checkpoints.",
    image: "/assets/services/company/one-person-company-icon.png",
  },
  {
    title: "Trademark Registration",
    text: "Protect your brand name, logo, and business identity.",
    image: "/assets/services/company/trademark-registration-icon.png",
  },
];

const businessTypes = [
  "Private Limited",
  "LLP",
  "One Person Company",
  "Partnership",
  "Proprietorship",
  "Other",
];

const serviceOptions = [
  "Private Limited Company",
  "LLP Registration",
  "One Person Company",
  "Trademark Registration",
  "ROC Filing",
  "Legal Consultation",
];

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function CompanyHero() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    businessType: "",
    serviceRequired: "",
    briefRequirements: "",
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
    if (!form.businessType || !form.serviceRequired) {
      setError("Please select business type and service required.");
      return;
    }
    if (!whatsappConsent) {
      setError("Please accept WhatsApp communication consent.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const serviceType =
        form.serviceRequired === "ROC Filing"
          ? "roc_filing"
          : "company_registration";
      const consentPayload = buildWebsiteConsentPayload(
        `website_${serviceType}`,
      );
      const result = await createServiceRequest({
        serviceType,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        businessType: form.businessType,
        businessName: form.businessType,
        ...consentPayload,
        details: {
          ...consentPayload,
          serviceRequired: form.serviceRequired,
          briefRequirements: form.briefRequirements.trim(),
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
        businessType: "",
        serviceRequired: "",
        briefRequirements: "",
      });
      setWhatsappConsent(false);
    } catch (err) {
      setError((err as Error).message || "Unable to submit company request.");
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

      <div className="mobile-safe-container relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
        <div>
          <h1 className="max-w-full wrap-break-word text-wrap text-[36px] font-bold leading-tight tracking-[-0.02em] text-[#1a5fa8] md:max-w-4xl md:text-[50px]">
            <span className="block sm:inline">Company Formation</span>{" "}
            <span className="block sm:inline">&amp; Trademark</span>{" "}
            <span className="block sm:inline">Registration</span>
          </h1>
          <p className="mt-4 max-w-full text-[16px] font-medium leading-7 text-[#1f2937] md:mt-5 md:max-w-2xl md:text-[19px]">
            Start your business journey with guided registration, documentation,
            and filing support.
          </p>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5">
            {services.map(({ title, text, image }) => (
              <div
                key={title}
                className="flex min-h-22 max-w-full items-center gap-3 overflow-hidden rounded-xl border border-[#e3e8ef] bg-white p-3 text-left shadow-[0_4px_18px_rgba(16,24,40,0.05)] sm:block sm:min-h-0 sm:p-5 sm:text-center md:p-7"
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d8ecff] sm:mx-auto sm:h-18 sm:w-18 md:h-24 md:w-24">
                  <Image
                    src={image}
                    alt={title}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-7 w-7 object-contain sm:h-10 sm:w-10 md:h-14 md:w-14"
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold leading-4 text-[#111827] sm:mt-5 sm:text-[16px] sm:leading-6 md:mt-6 md:text-[20px] md:leading-7">
                    {title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-5 text-[#667085] sm:mt-3 sm:text-[13px]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md self-start">
          <div className="absolute -right-2 -top-2 h-full w-full rounded-2xl bg-[#4c1d95] sm:-right-7 sm:-top-7" />
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_18px_45px_rgba(16,24,40,0.14)] sm:p-6 md:p-8">
            <h2 className="text-[22px] font-bold text-[#1f2937]">
              Tell Us Your Requirements
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-5 text-[#667085]">
              We will create a query ID and assign an expert for your request.
            </p>
            <form
              className="mt-5 grid gap-4 sm:mt-6 sm:gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              <label className="grid gap-2">
                <span className="text-[14px] font-bold text-[#1f2937]">
                  Full Name
                </span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter full name"
                  className="h-12 rounded-lg border border-[#d9dfe8] px-4 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#4c1d95]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[14px] font-bold text-[#1f2937]">
                    Mobile Number
                  </span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(event) =>
                      updateField("mobile", event.target.value)
                    }
                    placeholder="9876543210"
                    className="h-12 rounded-lg border border-[#d9dfe8] px-4 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#4c1d95]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[14px] font-bold text-[#1f2937]">
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="name@example.com"
                    className="h-12 rounded-lg border border-[#d9dfe8] px-4 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#4c1d95]"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[14px] font-bold text-[#1f2937]">
                    Business Type
                  </span>
                  <select
                    value={form.businessType}
                    onChange={(event) =>
                      updateField("businessType", event.target.value)
                    }
                    className="h-12 rounded-lg border border-[#d9dfe8] bg-white px-4 text-[13px] font-medium text-[#475467] outline-none focus:border-[#4c1d95]"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-[14px] font-bold text-[#1f2937]">
                    Service Required
                  </span>
                  <select
                    value={form.serviceRequired}
                    onChange={(event) =>
                      updateField("serviceRequired", event.target.value)
                    }
                    className="h-12 rounded-lg border border-[#d9dfe8] bg-white px-4 text-[13px] font-medium text-[#475467] outline-none focus:border-[#4c1d95]"
                  >
                    <option value="">Select service</option>
                    {serviceOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-[14px] font-bold text-[#1f2937]">
                  Brief Requirements
                </span>
                <textarea
                  value={form.briefRequirements}
                  onChange={(event) =>
                    updateField("briefRequirements", event.target.value)
                  }
                  placeholder="Tell us what you want to register or file"
                  className="min-h-24 rounded-lg border border-[#d9dfe8] px-4 py-3 text-[13px] font-medium outline-none placeholder:text-[#a0a7b2] focus:border-[#4c1d95]"
                />
              </label>
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
                type="submit"
                disabled={submitting}
                className="mx-auto mt-2 inline-flex h-12 w-full max-w-full items-center justify-center gap-2 rounded-full bg-[#13a653] text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Submit Inquiry
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-[#a0a7b2]">
                <LockKeyhole className="h-3.5 w-3.5" />
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
            title="Thank you! Your company service request has been submitted."
            message="We have created your query ID. Our expert will review the requirement and contact you with the next steps."
          />
          <ServiceRequestProgress request={request} />
        </div>
      ) : null}

      <div className="mobile-safe-container mt-8 grid gap-3 sm:grid-cols-3">
        {["Expert review", "Query ID generated", "Trackable progress"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-[#dce9f7] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(16,24,40,0.04)]"
            >
              <CheckCircle2 className="h-5 w-5 text-[#13a653]" />
              <span className="text-[14px] font-extrabold text-[#111827]">
                {item}
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
