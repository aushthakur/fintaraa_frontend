"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  CircleHelp,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  IndianRupee,
  Info,
  ListChecks,
  SearchCheck,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

type GuideTab = {
  id: string;
  label: string;
  shortLabel: string;
  title: string;
  summary: string;
  icon: LucideIcon;
};

const tabs: GuideTab[] = [
  {
    id: "what-is-gst-registration",
    label: "What is GST Registration?",
    shortLabel: "Overview",
    title: "What is GST Registration?",
    summary:
      "GST registration is the formal enrolment of an eligible business under India’s Goods and Services Tax framework.",
    icon: BookOpenCheck,
  },
  {
    id: "who-should-register",
    label: "Who Should Register?",
    shortLabel: "Eligibility",
    title: "Who should apply for GST Registration?",
    summary:
      "Turnover is an important test, but business activity and compulsory-registration rules can also determine liability.",
    icon: UserCheck,
  },
  {
    id: "gst-threshold",
    label: "GST Turnover Limits",
    shortLabel: "Limits",
    title: "GST Registration threshold limits",
    summary:
      "The applicable threshold can change with the type of supply, location and notified compulsory-registration conditions.",
    icon: IndianRupee,
  },
  {
    id: "gst-documents",
    label: "Documents Required",
    shortLabel: "Documents",
    title: "Documents required for GST Registration",
    summary:
      "The exact checklist depends on the constitution of the business and the nature of its premises.",
    icon: FileCheck2,
  },
  {
    id: "gst-process",
    label: "Registration Process",
    shortLabel: "Process",
    title: "Steps to apply for GST Registration",
    summary:
      "A normal taxpayer application is completed online through Part A and Part B of Form GST REG-01.",
    icon: ListChecks,
  },
  {
    id: "gst-status",
    label: "Track GST Status",
    shortLabel: "Status",
    title: "How to check GST Registration status",
    summary:
      "Use the Application Reference Number (ARN) to follow the application on the official GST portal.",
    icon: SearchCheck,
  },
  {
    id: "gst-penalties",
    label: "Failure & Penalties",
    shortLabel: "Penalties",
    title: "Consequences of not registering when liable",
    summary:
      "Failure to register can lead to tax recovery, statutory penalties and disruption to compliant invoicing or input-tax-credit claims.",
    icon: ShieldAlert,
  },
  {
    id: "gst-certificate",
    label: "GST Certificate",
    shortLabel: "Certificate",
    title: "How to download the GST Registration Certificate",
    summary:
      "Approved taxpayers receive an electronic Form GST REG-06; the government does not issue a physical certificate.",
    icon: Download,
  },
  {
    id: "gst-faqs",
    label: "GST FAQs",
    shortLabel: "FAQs",
    title: "Frequently asked GST Registration questions",
    summary:
      "Quick answers to common questions before starting a registration request.",
    icon: CircleHelp,
  },
];

const overviewBenefits = [
  {
    title: "GSTIN for the business",
    text: "An approved applicant receives a unique 15-character, PAN-linked Goods and Services Tax Identification Number.",
  },
  {
    title: "GST-compliant invoicing",
    text: "A registered supplier can issue tax invoices and collect GST on taxable outward supplies, as applicable.",
  },
  {
    title: "Input Tax Credit access",
    text: "Eligible input tax credit may be claimed subject to invoice, return and other statutory conditions.",
  },
  {
    title: "Recognised tax identity",
    text: "GST registration creates a verifiable tax identity for customers, vendors, marketplaces and authorities.",
  },
];

const registrationCases = [
  {
    title: "Turnover above the applicable limit",
    text: "Suppliers whose aggregate PAN-based turnover crosses the notified threshold generally need registration.",
  },
  {
    title: "Casual or non-resident taxable persons",
    text: "Specified persons making taxable supplies without a fixed place of business may fall under compulsory registration.",
  },
  {
    title: "TDS, TCS and Input Service Distributor roles",
    text: "Persons required to deduct or collect tax and Input Service Distributors follow category-specific registration rules.",
  },
  {
    title: "Agents and notified representatives",
    text: "Agents supplying on behalf of another taxable person may need registration, subject to the applicable provisions.",
  },
  {
    title: "E-commerce and digital supply cases",
    text: "Registration depends on the platform role, nature of supply and current exemptions or notifications.",
  },
  {
    title: "Reverse-charge and other notified cases",
    text: "Some businesses may need registration regardless of turnover where a compulsory-registration provision applies.",
  },
];

const thresholdRows = [
  {
    supply: "Exclusive supply of goods",
    normal: "Up to ₹40 lakh threshold in states/UTs that adopted the enhanced limit",
    lower: "₹20 lakh in specified states/UTs or where the enhanced limit does not apply",
  },
  {
    supply: "Supply of services",
    normal: "₹20 lakh aggregate turnover",
    lower: "₹10 lakh in specified special-category states",
  },
  {
    supply: "Compulsory-registration cases",
    normal: "Turnover threshold may not protect the applicant",
    lower: "Check Section 24, exemptions and current notifications",
  },
];

const documentGroups = [
  {
    title: "Identity & constitution",
    rows: [
      "PAN of the business or applicant, as applicable",
      "Certificate of incorporation, partnership deed or other constitution proof",
      "Photograph and identity details of promoters, partners or authorised signatory",
    ],
  },
  {
    title: "Principal place of business",
    rows: [
      "Electricity bill, property-tax receipt or municipal khata copy",
      "Ownership proof, rent/lease agreement or consent letter, as applicable",
      "Supporting document for any additional place of business",
    ],
  },
  {
    title: "Authorised signatory",
    rows: [
      "Letter of authorisation",
      "Board or managing-committee resolution and acceptance, where applicable",
      "Valid mobile number and email for OTP and portal communication",
    ],
  },
  {
    title: "Application-specific details",
    rows: [
      "Business activities, HSN/SAC information and state jurisdiction details",
      "Aadhaar authentication or biometric verification when prompted",
      "Clarification documents requested by the proper officer, if any",
    ],
  },
];

const applicationSteps = [
  "Confirm the registration category, state and applicable liability.",
  "Open the official GST portal and choose Services → Registration → New Registration.",
  "Complete Part A with PAN, mobile number, email address and state/UT details.",
  "Verify the OTPs and save the Temporary Reference Number (TRN).",
  "Use the TRN to complete Part B: business, promoters, authorised signatory, place of business, goods/services and verification details.",
  "Upload the relevant documents and complete Aadhaar authentication or verification if requested.",
  "Submit the application using DSC or EVC, as applicable, and save the ARN.",
  "Track the ARN and respond promptly if the officer asks for clarification or additional documents.",
];

const commonStatuses = [
  {
    title: "Pending for processing / verification",
    text: "The application has been submitted and is awaiting system or officer action.",
  },
  {
    title: "Pending for clarification",
    text: "The proper officer has requested more information or documents within the displayed response period.",
  },
  {
    title: "Approved",
    text: "The GSTIN has been allotted and Form GST REG-06 is available electronically.",
  },
  {
    title: "Rejected",
    text: "The application was not accepted; review the order and available response or fresh-application options.",
  },
];

const penaltyPoints = [
  {
    title: "Tax and interest exposure",
    text: "The department may determine tax liability for the period in which registration should have been obtained, along with applicable interest.",
  },
  {
    title: "Statutory penalty",
    text: "Section 122 can impose the higher of ₹10,000 or the relevant tax-linked amount for specified offences, including failure to register when liable.",
  },
  {
    title: "Business disruption",
    text: "Unregistered taxable supplies can create invoice, vendor onboarding and input-tax-credit complications for the business and its customers.",
  },
];

const certificateSteps = [
  "Sign in to the official GST portal using the registered credentials.",
  "Open Services → User Services → View/Download Certificates.",
  "Locate the latest registration certificate in the list.",
  "Choose the download icon to save Form GST REG-06 as a PDF.",
];

const faqItems = [
  {
    question: "Is GST Registration free on the government portal?",
    answer:
      "The government portal does not charge a registration fee. A professional adviser may separately charge for document review, application preparation or follow-up assistance.",
  },
  {
    question: "Can a business register voluntarily below the threshold?",
    answer:
      "Yes, voluntary registration is possible. Once effective, the business generally assumes the compliance responsibilities of a normal registered taxpayer.",
  },
  {
    question: "Is a business address required?",
    answer:
      "Yes. The application requires a principal place of business and acceptable ownership, lease or consent-based supporting evidence.",
  },
  {
    question: "Can one PAN have registrations in multiple states?",
    answer:
      "Yes. GST registration is state/UT specific, so a business operating from multiple states may require separate registrations for those states.",
  },
  {
    question: "What are TRN and ARN?",
    answer:
      "The TRN lets an applicant continue Part B of a saved registration application. The ARN is generated after submission and is used to track the application.",
  },
  {
    question: "Will I receive a physical GST certificate?",
    answer:
      "No physical certificate is issued by the government. The approved Form GST REG-06 can be downloaded electronically from the GST portal.",
  },
];

function OverviewContent() {
  return (
    <>
      <p className="text-[14px] font-medium leading-7 text-[#526b80] md:text-[15px]">
        After approval, the business receives a GSTIN and becomes identifiable
        on the GST system for the registered state or union territory. The
        registration supports compliant tax invoicing, return filing and
        eligible input-tax-credit claims.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {overviewBenefits.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[#dce8f2] bg-[#f8fbff] p-4"
          >
            <CheckCircle2 className="h-5 w-5 text-[#075cde]" />
            <h3 className="mt-3 text-[14px] font-extrabold text-[#17354d]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#687f92]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
      <InfoNote>
        A GSTIN is PAN-linked and state-specific. Separate registrations may be
        required where a business operates from more than one state or union
        territory.
      </InfoNote>
    </>
  );
}

function EligibilityContent() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {registrationCases.map((item, index) => (
          <article
            key={item.title}
            className="flex gap-3 rounded-2xl border border-[#dfe8ef] bg-white p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f3ff] text-[11px] font-extrabold text-[#075cde]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[13px] font-extrabold leading-5 text-[#17354d]">
                {item.title}
              </h3>
              <p className="mt-1 text-[12px] font-medium leading-5 text-[#6c8193]">
                {item.text}
              </p>
            </div>
          </article>
        ))}
      </div>
      <InfoNote>
        Compulsory-registration rules include exceptions and notification-based
        relief. Confirm the current position for the exact supply model before
        applying.
      </InfoNote>
    </>
  );
}

function ThresholdContent() {
  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-[#dce7ef]">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead className="bg-[#eaf4ff] text-[#17354d]">
            <tr>
              <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide">
                Supply profile
              </th>
              <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide">
                General position
              </th>
              <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide">
                Lower / special position
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5edf3] bg-white">
            {thresholdRows.map((row) => (
              <tr key={row.supply} className="align-top">
                <td className="px-4 py-4 text-[13px] font-extrabold text-[#1d3a52]">
                  {row.supply}
                </td>
                <td className="px-4 py-4 text-[12px] font-medium leading-5 text-[#60788b]">
                  {row.normal}
                </td>
                <td className="px-4 py-4 text-[12px] font-medium leading-5 text-[#60788b]">
                  {row.lower}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InfoNote>
        Aggregate turnover is calculated PAN-wise across India. Thresholds,
        state adoption and exemptions can change through notifications—verify
        the current rule before relying on a limit.
      </InfoNote>
    </>
  );
}

function DocumentsContent() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {documentGroups.map((group) => (
        <article
          key={group.title}
          className="rounded-2xl border border-[#dce7ef] bg-white p-4 sm:p-5"
        >
          <h3 className="flex items-center gap-2 text-[14px] font-extrabold text-[#17354d]">
            <FileText className="h-4.5 w-4.5 text-[#075cde]" />
            {group.title}
          </h3>
          <div className="mt-3 grid gap-2.5">
            {group.rows.map((row) => (
              <p
                key={row}
                className="flex items-start gap-2 text-[12px] font-medium leading-5 text-[#657d90]"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#13a653]" />
                {row}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function ProcessContent() {
  return (
    <div className="grid gap-3">
      {applicationSteps.map((step, index) => (
        <article
          key={step}
          className="flex items-start gap-4 rounded-2xl border border-[#dfe8ef] bg-white p-4"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#075cde] text-[12px] font-extrabold text-white">
            {index + 1}
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8295a5]">
              Step {index + 1}
            </p>
            <p className="mt-1 text-[13px] font-semibold leading-6 text-[#3f586c]">
              {step}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function StatusContent() {
  return (
    <>
      <div className="rounded-2xl bg-[#eff8ff] p-4 sm:p-5">
        <ol className="grid gap-3 md:grid-cols-3">
          {[
            "Open the official GST portal",
            "Choose Services → Registration → Track Application Status",
            "Enter the ARN and captcha to view the result",
          ].map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#075cde] text-[10px] font-extrabold text-white">
                {index + 1}
              </span>
              <span className="text-[12px] font-semibold leading-5 text-[#3f586c]">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {commonStatuses.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[#dce7ef] bg-white p-4"
          >
            <h3 className="text-[13px] font-extrabold text-[#17354d]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#687f92]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
      <a
        href="https://www.gst.gov.in/"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#075cde] px-4 text-[12px] font-extrabold text-white no-underline transition hover:bg-[#064eb9]"
      >
        Open official GST Portal
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </>
  );
}

function PenaltiesContent() {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        {penaltyPoints.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[#f0d7d7] bg-[#fff8f8] p-4"
          >
            <ShieldAlert className="h-5 w-5 text-[#d33c3c]" />
            <h3 className="mt-3 text-[13px] font-extrabold text-[#5b2a2a]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#805b5b]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
      <InfoNote>
        Penalty and recovery depend on the facts, period, tax involved and
        applicable law. This overview is informational and is not a substitute
        for advice on a notice or enforcement matter.
      </InfoNote>
    </>
  );
}

function CertificateContent() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {certificateSteps.map((step, index) => (
          <article
            key={step}
            className="flex items-start gap-3 rounded-2xl border border-[#dce7ef] bg-white p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f3ff] text-[11px] font-extrabold text-[#075cde]">
              {index + 1}
            </span>
            <p className="text-[12px] font-semibold leading-5 text-[#526b80]">
              {step}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-[#cde8d8] bg-[#f2fbf6] p-4 sm:p-5">
        <h3 className="text-[14px] font-extrabold text-[#17613a]">
          Form GST REG-06 generally shows
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            "GSTIN and legal/trade name",
            "Business constitution",
            "Principal and additional places of business",
            "Effective date and registration type",
          ].map((item) => (
            <p
              key={item}
              className="flex items-center gap-2 text-[12px] font-semibold text-[#41705a]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#13a653]" />
              {item}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

function FaqContent() {
  return (
    <div className="divide-y divide-[#e2eaf0] overflow-hidden rounded-2xl border border-[#dce7ef] bg-white">
      {faqItems.map((item, index) => (
        <details key={item.question} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[13px] font-extrabold text-[#17354d] marker:content-none sm:px-5">
            {item.question}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf5fb] text-[#075cde] transition group-open:rotate-90">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </summary>
          <p className="px-4 pb-4 text-[12px] font-medium leading-6 text-[#657d90] sm:px-5">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#f0dfb5] bg-[#fffaf0] p-4 text-[12px] font-semibold leading-5 text-[#745f2e]">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#c28b16]" />
      <p>{children}</p>
    </div>
  );
}

function ActiveContent({ activeId }: { activeId: string }) {
  if (activeId === "who-should-register") return <EligibilityContent />;
  if (activeId === "gst-threshold") return <ThresholdContent />;
  if (activeId === "gst-documents") return <DocumentsContent />;
  if (activeId === "gst-process") return <ProcessContent />;
  if (activeId === "gst-status") return <StatusContent />;
  if (activeId === "gst-penalties") return <PenaltiesContent />;
  if (activeId === "gst-certificate") return <CertificateContent />;
  if (activeId === "gst-faqs") return <FaqContent />;
  return <OverviewContent />;
}

export function GstInformationGuide() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((tab) => tab.id === activeId) || tabs[0];
  const ActiveIcon = active.icon;

  const selectTab = (id: string) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <section className="bg-[#f7fafc] pb-10 md:pb-14">
      <div
        className="sticky z-[49] border-y border-[#d8e6f0] bg-[#eaf4ff]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8"
        style={{ top: "var(--site-header-height, 8.25rem)" }}
      >
        <div className="mx-auto flex max-w-9xl items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id)}
                aria-pressed={selected}
                className={`h-10 shrink-0 rounded-full px-4 text-[11px] font-extrabold transition sm:px-5 sm:text-[12px] ${
                  selected
                    ? "bg-[#075cde] text-white"
                    : "border border-[#d6e3ec] bg-white text-[#36546b] hover:border-[#8db9d6] hover:text-[#075cde]"
                }`}
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto grid max-w-9xl items-start gap-5 px-4 pt-7 sm:px-6 md:pt-9 lg:grid-cols-[245px_minmax(0,1fr)] lg:px-8">
        <aside
          className="hidden rounded-2xl border border-[#dce7ef] bg-white p-3 lg:sticky lg:block"
          style={{ top: "calc(var(--site-header-height, 8.25rem) + 5.25rem)" }}
        >
          <div className="px-3 pb-3 pt-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#7890a2]">
              Quick links
            </p>
            <h2 className="mt-1 text-[16px] font-extrabold text-[#17354d]">
              GST Registration Guide
            </h2>
          </div>
          <nav aria-label="GST registration guide sections" className="grid gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[11px] font-bold leading-4 transition ${
                    selected
                      ? "bg-[#e9f3ff] text-[#075cde]"
                      : "text-[#526b80] hover:bg-[#f5f8fa] hover:text-[#075cde]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1">{tab.label}</span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </nav>
          <a
            href="#gst-service-form"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#13a653] px-3 text-[11px] font-extrabold text-white no-underline transition hover:bg-[#0f8f45]"
          >
            Get GST Assistance
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </aside>

        <article
          id="gst-guide-content"
          className="min-w-0 rounded-2xl border border-[#dce7ef] bg-white p-5 sm:p-7 md:p-8"
        >
          <div className="flex items-start gap-4 border-b border-[#e5edf3] pb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
              <ActiveIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#075cde]">
                GST knowledge guide
              </p>
              <h2 className="mt-1 text-[23px] font-extrabold leading-tight tracking-[-0.02em] text-[#17354d] sm:text-[28px]">
                {active.title}
              </h2>
              <p className="mt-2 text-[13px] font-medium leading-6 text-[#718598] sm:text-[14px]">
                {active.summary}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ActiveContent activeId={activeId} />
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-[#e5edf3] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[10px] font-medium leading-5 text-[#8295a5]">
              Information is a practical overview based on GST Portal and CBIC
              guidance. Tax rules and notifications can change; verify the
              latest position for your business.
            </p>
            <a
              href="https://tutorial.gst.gov.in/userguide/registration/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold text-[#075cde] no-underline hover:underline"
            >
              Official registration guide
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
