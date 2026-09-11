"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import {
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CreditScoreBanner } from "@/components/home/CreditScoreBanner";
import { ProductLocationDirectory } from "@/components/products/ProductLocationDirectory";
import { ProductRelatedBlogs } from "@/components/products/ProductRelatedBlogs";
import { LoanFAQSection } from "@/components/products/loan-detail/LoanFAQSection";
import { LoanStatsBar } from "@/components/products/loan-detail/LoanStatsBar";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { buildApiUrl } from "@/services/apiUrl";
import type {
  LoanSeoLocationPage,
  LoanSeoPageData,
} from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

type LeadFormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  loanAmount: string;
  employmentType: string;
  preferredLender: string;
};

type LeadFormErrors = Partial<
  Record<keyof LeadFormState | "whatsappConsent", string>
>;

const initialLeadForm: LeadFormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  loanAmount: "",
  employmentType: "",
  preferredLender: "",
};

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cityRegex = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;

const loanAmountOptions = [
  "Up to Rs 50,000",
  "Rs 50,001 - Rs 1 lakh",
  "Rs 1 lakh - Rs 3 lakh",
  "Rs 3 lakh - Rs 5 lakh",
  "Above Rs 5 lakh",
];

const employmentOptions = ["Salaried", "Self-employed", "Business owner"];
const lendersPerPage = 6;

const trustPoints = [
  {
    icon: Landmark,
    title: "All partner lenders",
    text: "Compare banks and NBFCs in one place",
  },
  {
    icon: Clock3,
    title: "Quick assisted journey",
    text: "Get a callback for the next steps",
  },
  {
    icon: ShieldCheck,
    title: "Secure lead capture",
    text: "Your details stay protected",
  },
];

const journeySteps = [
  {
    icon: FileCheck2,
    title: "Share your requirement",
    text: "Tell us your amount, city, and employment type.",
  },
  {
    icon: Sparkles,
    title: "Compare suitable lenders",
    text: "Review indicative rates, fees, amount, and tenure.",
  },
  {
    icon: BadgeCheck,
    title: "Complete your application",
    text: "Continue securely with the selected bank and Fintaraa support.",
  },
];

const dedupeLenders = (lenders: BankProductLender[]) => {
  const unique = new Map<string, BankProductLender>();
  lenders.forEach((lender) => {
    const key = lender.bankSlug || lender.bankName.toLowerCase();
    if (!unique.has(key)) unique.set(key, lender);
  });
  return Array.from(unique.values()).sort((first, second) =>
    first.bankName.localeCompare(second.bankName),
  );
};

export function InstantLoanMarketplacePage({
  page,
  lenders,
  locationPages = [],
}: {
  page: LoanSeoPageData;
  lenders: BankProductLender[];
  locationPages?: LoanSeoLocationPage[];
}) {
  const allLenders = useMemo(() => dedupeLenders(lenders), [lenders]);
  const [search, setSearch] = useState("");
  const [visibleLenderCount, setVisibleLenderCount] = useState(lendersPerPage);
  const [leadForm, setLeadForm] = useState(initialLeadForm);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const leadFormRef = useRef<HTMLDivElement>(null);

  const filteredLenders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allLenders;
    return allLenders.filter((lender) =>
      [lender.bankName, lender.interestRate, lender.loanAmount]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [allLenders, search]);
  const visibleLenders = filteredLenders.slice(0, visibleLenderCount);
  const remainingLenderCount = Math.max(
    filteredLenders.length - visibleLenderCount,
    0,
  );

  const faqItems = useMemo(
    () =>
      page.tabs
        .flatMap((tab) => tab.faqs || [])
        .filter(
          (faq, index, items) =>
            items.findIndex((item) => item.question === faq.question) === index,
        ),
    [page.tabs],
  );

  const updateField = (key: keyof LeadFormState, value: string) => {
    setLeadForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError("");
    setSubmitSuccess("");
  };

  const validateLead = () => {
    const nextErrors: LeadFormErrors = {};
    const normalizedMobile = leadForm.mobile.trim().replace(/[\s-]/g, "");

    if (!nameRegex.test(leadForm.fullName.trim())) {
      nextErrors.fullName = "Enter a valid full name.";
    }
    if (!mobileRegex.test(normalizedMobile)) {
      nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!emailRegex.test(leadForm.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!cityRegex.test(leadForm.city.trim())) {
      nextErrors.city = "Enter a valid city.";
    }
    if (!leadForm.loanAmount) {
      nextErrors.loanAmount = "Select the required loan amount.";
    }
    if (!leadForm.employmentType) {
      nextErrors.employmentType = "Select your employment type.";
    }
    if (!whatsappConsent) {
      nextErrors.whatsappConsent =
        "Please accept the communication consent to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    if (!validateLead()) return;

    const url = buildApiUrl("/contact-requests");
    if (!url) {
      setSubmitError("Lead service is not configured. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: leadForm.fullName.trim(),
          mobile: leadForm.mobile.trim(),
          email: leadForm.email.trim(),
          city: leadForm.city.trim(),
          message: [
            "Instant Loan lead",
            `Required amount: ${leadForm.loanAmount}`,
            `Employment: ${leadForm.employmentType}`,
            `Preferred lender: ${leadForm.preferredLender || "Open to all partners"}`,
            `Page: ${page.canonicalPath || "/products/instant-loan"}`,
          ].join(" | "),
          ...buildWebsiteConsentPayload("instant_loan_marketplace"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          result?.message || "We could not submit your request right now.",
        );
      }

      setSubmitSuccess(
        "Request submitted successfully. Our loan expert will contact you shortly.",
      );
      setLeadForm(initialLeadForm);
      setWhatsappConsent(false);
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

  const requestLenderCallback = (lender: BankProductLender) => {
    updateField("preferredLender", lender.bankName);
    leadFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <main className="overflow-hidden bg-white text-[#07162d]">
      <section className="relative isolate overflow-hidden bg-[#f3f8ff] px-4 pb-12 pt-6 md:px-6 md:pb-16 md:pt-9 lg:px-8">
        <div className="absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#d9eaff] blur-3xl" />
        <div className="absolute -right-28 -top-24 -z-10 h-96 w-96 rounded-full bg-[#dff8eb] blur-3xl" />

        <div className="mx-auto max-w-9xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 text-[12px] font-bold text-[#667085]"
          >
            <Link
              href="/"
              className="text-[#667085] no-underline hover:text-[#5b21b6]"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/products?category=loans"
              className="text-[#667085] no-underline hover:text-[#5b21b6]"
            >
              Loans
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#5b21b6]">Instant Loan</span>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.82fr)] lg:gap-12">
            <div className="pt-2 lg:pt-8">
              <h1 className="mt-5 max-w-4xl text-[36px] font-extrabold leading-[1.06] tracking-[-0.04em] text-[#07162d] sm:text-[46px] lg:text-[54px]">
                Compare Instant Loans from{" "}
                <span className="text-[#5b21b6]">all partner banks</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-[#52657d] sm:text-[17px]">
                Review indicative lender terms, choose a suitable bank or NBFC,
                and get assisted support for your instant loan application.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {trustPoints.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_10px_35px_rgba(7,22,45,0.06)] backdrop-blur"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf3ff] text-[#5b21b6]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-3 text-[13px] font-extrabold text-[#07162d]">
                      {title}
                    </p>
                    <p className="mt-1 text-[11px] font-medium leading-5 text-[#667085]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-[#344054]">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#13a653]" />
                  No hidden marketplace fee
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#13a653]" />
                  Profile-based offers
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#13a653]" />
                  Secure assisted process
                </span>
              </div>
            </div>

            <div
              ref={leadFormRef}
              id="instant-loan-lead-form"
              className="rounded-3xl border border-[#d7e5f2] bg-white p-5 shadow-[0_24px_70px_rgba(7,42,76,0.13)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5b21b6]">
                    Free expert callback
                  </p>
                  <h2 className="mt-1.5 text-[24px] font-extrabold tracking-tight text-[#07162d]">
                    Find the right instant loan
                  </h2>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-[#667085]">
                    Share your requirement and our team will help you compare
                    suitable lenders.
                  </p>
                </div>
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#13a653] sm:flex">
                  <Phone className="h-5 w-5" />
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-5 grid gap-3.5 sm:grid-cols-2"
              >
                <LeadInput
                  label="Full Name"
                  value={leadForm.fullName}
                  error={errors.fullName}
                  icon={<User className="h-4 w-4" />}
                  autoComplete="name"
                  placeholder="Enter full name"
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                />
                <LeadInput
                  label="Mobile Number"
                  value={leadForm.mobile}
                  error={errors.mobile}
                  icon={<Phone className="h-4 w-4" />}
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={14}
                  placeholder="9876543210"
                  onChange={(event) =>
                    updateField("mobile", event.target.value)
                  }
                />
                <LeadInput
                  label="Email Address"
                  value={leadForm.email}
                  error={errors.email}
                  icon={<Mail className="h-4 w-4" />}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.com"
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <LeadInput
                  label="City"
                  value={leadForm.city}
                  error={errors.city}
                  icon={<MapPin className="h-4 w-4" />}
                  autoComplete="address-level2"
                  placeholder="Enter city"
                  onChange={(event) => updateField("city", event.target.value)}
                />
                <LeadSelect
                  label="Required Amount"
                  value={leadForm.loanAmount}
                  error={errors.loanAmount}
                  icon={<BadgeIndianRupee className="h-4 w-4" />}
                  placeholder="Select amount"
                  options={loanAmountOptions}
                  onChange={(value) => updateField("loanAmount", value)}
                />
                <LeadSelect
                  label="Employment Type"
                  value={leadForm.employmentType}
                  error={errors.employmentType}
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                  placeholder="Select employment"
                  options={employmentOptions}
                  onChange={(value) => updateField("employmentType", value)}
                />
                <div className="sm:col-span-2">
                  <LeadSelect
                    label="Preferred Bank / NBFC"
                    optional
                    value={leadForm.preferredLender}
                    icon={<Landmark className="h-4 w-4" />}
                    placeholder="Open to all partner lenders"
                    options={allLenders.map((lender) => lender.bankName)}
                    onChange={(value) => updateField("preferredLender", value)}
                  />
                </div>

                <WhatsAppConsent
                  checked={whatsappConsent}
                  error={errors.whatsappConsent}
                  className="sm:col-span-2"
                  onChange={(checked) => {
                    setWhatsappConsent(checked);
                    setErrors((current) => ({
                      ...current,
                      whatsappConsent: undefined,
                    }));
                    setSubmitError("");
                    setSubmitSuccess("");
                  }}
                />

                <div className="sm:col-span-2" aria-live="polite">
                  {submitError ? (
                    <p className="flex items-start gap-2 rounded-xl border border-[#fecaca] bg-[#fff5f5] px-3 py-2.5 text-[12px] font-bold text-[#b42318]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {submitError}
                    </p>
                  ) : null}
                  {submitSuccess ? (
                    <p className="flex items-start gap-2 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2.5 text-[12px] font-bold text-[#027a48]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {submitSuccess}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0d5dc7] to-[#0878dd] px-6 text-[14px] font-extrabold text-white shadow-[0_12px_28px_rgba(91,33,182,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0 sm:col-span-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {isSubmitting
                    ? "Submitting request..."
                    : "Get matched with lenders"}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-[#98a2b3] sm:col-span-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure form. No marketplace charges for submitting a request.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <LoanStatsBar />

      <section
        id="instant-loan-lenders"
        className="bg-white px-4 py-12 md:px-6 md:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-9xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#07162d] sm:text-[34px]">
                All Instant Loan Banks &amp; NBFCs
              </h2>
            </div>

            <label className="relative block w-full lg:w-82">
              <span className="sr-only">Search banks and NBFCs</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8aa0]" />
              <input
                type="search"
                value={search}
                placeholder="Search bank or NBFC"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setVisibleLenderCount(lendersPerPage);
                }}
                className="h-12 w-full rounded-xl border border-[#d7e5f2] bg-[#fbfdff] pl-11 pr-4 text-[13px] font-semibold text-[#07162d] outline-none transition placeholder:text-[#98a2b3] focus:border-[#5b21b6] focus:ring-3 focus:ring-[#5b21b6]/10"
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#e2edf8] bg-[#f8fbff] px-4 py-3 text-[12px] font-bold text-[#52657d]">
            <span>
              Showing {visibleLenders.length} of {filteredLenders.length} partner
              lenders{search.trim() ? ` matching “${search.trim()}”` : ""}
            </span>
            <span className="hidden items-center gap-1.5 text-[#13a653] sm:inline-flex">
              <BadgeCheck className="h-4 w-4" />
              Verified partner directory
            </span>
          </div>

          {filteredLenders.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleLenders.map((lender) => (
                <LenderCard
                  key={lender.bankSlug || lender.bankName}
                  lender={lender}
                  onRequestCallback={() => requestLenderCallback(lender)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#cbdced] bg-[#f8fbff] px-6 py-12 text-center">
              <Landmark className="mx-auto h-8 w-8 text-[#8da5bb]" />
              <h3 className="mt-3 text-[17px] font-extrabold text-[#07162d]">
                No lender found
              </h3>
              <p className="mt-1 text-[12px] font-medium text-[#667085]">
                Try another bank or NBFC name.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setVisibleLenderCount(lendersPerPage);
                }}
                className="mt-4 text-[12px] font-extrabold text-[#5b21b6]"
              >
                Clear search
              </button>
            </div>
          )}

          {remainingLenderCount > 0 ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setVisibleLenderCount((current) =>
                    Math.min(current + lendersPerPage, filteredLenders.length),
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#b9d5ee] bg-white px-6 text-[12px] font-extrabold text-[#5b21b6] shadow-[0_8px_22px_rgba(91,33,182,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f5f9ff]"
              >
                Load {Math.min(lendersPerPage, remainingLenderCount)} more lenders
                <ChevronDown className="h-4 w-4" />
              </button>
              <p className="text-[10px] font-semibold text-[#8a94a6]">
                {remainingLenderCount} more partner lenders available
              </p>
            </div>
          ) : null}

          <p className="mt-6 rounded-xl bg-[#fffaf0] px-4 py-3 text-[11px] font-semibold leading-5 text-[#756238]">
            <strong>Important:</strong> Rates and lender terms shown here are
            indicative. The selected lender will communicate the final offer
            after eligibility, credit, and document checks. Fintaraa does not
            guarantee approval or a fixed disbursal time.
          </p>
        </div>
      </section>

      <section className="bg-[#f7faff] px-4 py-12 md:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5b21b6]">
              Simple application journey
            </p>
            <h2 className="mt-2 text-[27px] font-extrabold tracking-tight text-[#07162d]">
              From requirement to application in 3 steps
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {journeySteps.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="relative rounded-2xl border border-[#dce8f3] bg-white p-5 shadow-[0_9px_30px_rgba(7,22,45,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3ff] text-[#5b21b6]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[30px] font-black text-[#e0eaf4]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[16px] font-extrabold text-[#07162d]">
                  {title}
                </h3>
                <p className="mt-2 text-[12px] font-medium leading-6 text-[#667085]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CreditScoreBanner />

      {faqItems.length ? (
        <LoanFAQSection
          faqs={faqItems}
          title="Instant Loan Questions, Answered"
        />
      ) : null}

      <ProductRelatedBlogs category="Loans" productName={page.loanType} />
      <ProductLocationDirectory
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        currentLocation={page.location}
        pages={locationPages}
      />
      <AppDownloadBanner />
    </main>
  );
}

function LenderCard({
  lender,
  onRequestCallback,
}: {
  lender: BankProductLender;
  onRequestCallback: () => void;
}) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: "instant-loan",
    bankSlug: lender.bankSlug,
    referrer: lender.canonicalPath || "/products/instant-loan",
  });

  const detailItems = [
    { label: "Interest rate", value: lender.interestRate },
    { label: "Processing fee", value: lender.processingFee },
    { label: "Loan amount", value: lender.loanAmount },
    { label: "Tenure", value: lender.tenure },
  ];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#dce8f3] bg-white p-5 shadow-[0_10px_34px_rgba(7,22,45,0.055)] transition hover:-translate-y-1 hover:border-[#b8d4ee] hover:shadow-[0_18px_42px_rgba(7,42,76,0.1)]">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={lender.canonicalPath}
          aria-label={`View ${lender.bankName} instant loan details`}
          className="flex min-w-0 items-center gap-3 no-underline"
        >
          <span className="flex h-14 w-28 shrink-0 items-center justify-center rounded-xl border border-[#edf2f7] bg-white px-2">
            {lender.logoUrl ? (
              <BankLogoImage
                src={lender.logoUrl}
                alt={lender.bankName}
                className="h-10 w-full"
                imageClassName="object-contain"
                sizes="112px"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3ff] text-[13px] font-black text-[#5b21b6]">
                {lender.bankName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#13a653]">
              Instant loan partner
            </span>
            <span className="mt-1 block line-clamp-2 text-[15px] font-extrabold leading-5 text-[#07162d]">
              {lender.bankName}
            </span>
          </span>
        </Link>
        <BadgeCheck className="h-5 w-5 shrink-0 text-[#5b21b6]" />
      </div>

      <dl className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-[#e6eef6] bg-[#f8fbff]">
        {detailItems.map((item, index) => (
          <div
            key={item.label}
            className={`min-w-0 p-3 ${index % 2 === 0 ? "border-r border-[#e6eef6]" : ""} ${index < 2 ? "border-b border-[#e6eef6]" : ""}`}
          >
            <dt className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#8a94a6]">
              {item.label}
            </dt>
            <dd className="mt-1 line-clamp-2 text-[12px] font-extrabold leading-5 text-[#3b0764]">
              {item.value || "Check lender details"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <button
          type="button"
          onClick={onRequestCallback}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#bdd5ea] bg-white px-3 text-[11px] font-extrabold text-[#5b21b6] transition hover:bg-[#f3f8ff]"
        >
          Get callback
        </button>
        <AuthRedirectLink
          href={applyHref}
          productSlug="instant-loan"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-3 text-[11px] font-extrabold text-white no-underline shadow-[0_8px_18px_rgba(15,174,94,0.2)]"
        >
          Apply now
          <ArrowRight className="h-3.5 w-3.5" />
        </AuthRedirectLink>
      </div>
    </article>
  );
}

function LeadInput({
  label,
  icon,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-extrabold text-[#344054]">
        {label} <span className="text-[#e5484d]">*</span>
      </span>
      <span
        className={`flex h-11 items-center rounded-xl border bg-white transition ${
          error
            ? "border-[#f04438]"
            : "border-[#d7e2ee] focus-within:border-[#5b21b6] focus-within:ring-3 focus-within:ring-[#5b21b6]/10"
        }`}
      >
        <span className="ml-3.5 shrink-0 text-[#7a8aa0]">{icon}</span>
        <input
          {...props}
          className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-[12px] font-semibold text-[#07162d] outline-none placeholder:text-[#98a2b3]"
        />
      </span>
      {error ? (
        <span className="mt-1 block text-[10px] font-bold text-[#d92d20]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function LeadSelect({
  label,
  icon,
  value,
  placeholder,
  options,
  error,
  optional = false,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  placeholder: string;
  options: string[];
  error?: string;
  optional?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-extrabold text-[#344054]">
        {label}{" "}
        {optional ? (
          <span className="font-semibold text-[#98a2b3]">(optional)</span>
        ) : (
          <span className="text-[#e5484d]">*</span>
        )}
      </span>
      <span
        className={`flex h-11 items-center rounded-xl border bg-white transition ${
          error
            ? "border-[#f04438]"
            : "border-[#d7e2ee] focus-within:border-[#5b21b6] focus-within:ring-3 focus-within:ring-[#5b21b6]/10"
        }`}
      >
        <span className="ml-3.5 shrink-0 text-[#7a8aa0]">{icon}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 appearance-none rounded-xl bg-transparent px-3 text-[12px] font-semibold text-[#07162d] outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
      {error ? (
        <span className="mt-1 block text-[10px] font-bold text-[#d92d20]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
