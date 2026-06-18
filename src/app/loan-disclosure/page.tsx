import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import {
  Mail,
  Landmark,
  Calculator,
  AlertCircle,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

const fallbackMetadata: Metadata = {
  title: "Loan Disclosure & Disclaimer",
  description:
    "View Fintaraa loan disclosure, indicative loan ranges, sample EMI calculation, lender responsibility, and support details.",
};

const summary = [
  { label: "Loan Amount", value: "Rs50,000 - Rs10,00,000", icon: Landmark },
  { label: "Interest Rate", value: "10% - 28% p.a.", icon: Calculator },
  { label: "Tenure", value: "6 - 60 months", icon: ReceiptText },
  { label: "Support", value: "support@fintaraa.com", icon: Mail },
];

const sections = [
  {
    kicker: "01",
    title: "Fintaraa's role in your loan journey",
    accent: "text-[#195585]",
    body: [
      "Fintaraa is a financial services marketplace that helps customers discover, compare, and apply for loan products offered by RBI-registered banks and NBFCs.",
      "Fintaraa is not a lender and does not disburse loans directly. We operate as a facilitator / Direct Selling Agent (DSA), helping customers submit applications and understand next steps with partner financial institutions.",
      "Every final approval, sanction amount, interest rate, fee, repayment schedule, and disbursal decision is made solely by the respective bank or NBFC after its internal credit evaluation.",
    ],
  },
  {
    kicker: "02",
    title: "Indicative loan ranges and charges",
    accent: "text-[#12b76a]",
    body: [
      "Indicative loan amount: Rs50,000 to Rs10,00,000.",
      "Indicative interest rate: 10% to 28% per annum.",
      "Indicative tenure: 6 to 60 months.",
      "Processing fee: 0% to 3%, depending on lender policy and applicant profile.",
      "Actual terms may vary based on credit score, income, employer or business profile, repayment capacity, documentation quality, city, and partner underwriting rules.",
    ],
  },
  {
    kicker: "03",
    title: "Illustrative EMI example",
    accent: "text-[#f97316]",
    body: [
      "For a loan of Rs1,00,000 for 12 months at an annual interest rate of 12%, the approximate EMI would be Rs8,885 per month.",
      "This example is for explanation only. Your actual EMI may differ based on the lender's sanctioned amount, rate, tenure, processing fee, insurance add-ons, repayment date, and any applicable taxes or charges.",
    ],
  },
  {
    kicker: "04",
    title: "Partner responsibility and agreement execution",
    accent: "text-[#6366f1]",
    body: [
      "Loans available through Fintaraa are offered by RBI-registered banks and NBFCs.",
      "The legal loan agreement, Key Fact Statement, sanction letter, repayment schedule, mandate, and customer obligations are executed directly between the customer and the selected lending partner.",
      "Customers should read all lender documents carefully before accepting an offer or authorising any payment mandate.",
    ],
  },
  {
    kicker: "05",
    title: "Important customer notice",
    accent: "text-[#ef4444]",
    body: [
      "Fintaraa does not charge customers simply for exploring products on the platform.",
      "Any applicable processing fee, stamp duty, insurance premium, convenience fee, foreclosure charge, late payment fee, or other charge is defined by the respective bank or NBFC and disclosed in lender documents.",
      "Never share OTPs, PINs, passwords, full card details, or remote-access permissions with anyone claiming to process a loan.",
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/loan-disclosure", fallbackMetadata);
}

export default function LoanDisclosurePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#f5fbff] px-4 py-16 md:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#f97316]" />
        <div className="pointer-events-none absolute right-32 top-32 h-96 w-96 rounded-full bg-[#12b76a]/14 blur-3xl" />
        <div className="pointer-events-none absolute bottom-40 left-32 h-112 w-md rounded-full bg-[#195585]/14 blur-3xl" />

        <div className="relative mx-auto max-w-9xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#195585] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white">
                <ShieldCheck className="h-4 w-4" />
                Loan Transparency
              </div>
              <h1 className="mt-7 max-w-5xl text-[44px] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#07162d] md:text-[72px]">
                Loan Disclosure & Disclaimer
              </h1>
              <p className="mt-7 max-w-4xl text-[19px] font-semibold leading-9 text-[#344054]">
                A clear disclosure of Fintaraa&apos;s role, indicative loan
                ranges, sample repayment math, lender responsibility, and
                customer safeguards before you apply.
              </p>
            </div>

            <div className="bg-[#195585] p-7 text-white">
              <AlertCircle className="h-8 w-8 text-[#7ee3a2]" />
              <p className="mt-5 text-[26px] font-extrabold leading-tight">
                Fintaraa facilitates. Lending decisions rest with regulated
                partners.
              </p>
              <p className="mt-4 text-[15px] font-semibold leading-7 text-white/78">
                Always review lender-provided Key Fact Statements, sanction
                terms, fee schedules, and repayment obligations before accepting
                an offer.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {summary.map(({ label, value, icon: Icon }) => (
              <div key={label} className="border-t-2 border-[#195585] pt-5">
                <Icon className="h-6 w-6 text-[#195585]" />
                <p className="mt-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#667085]">
                  {label}
                </p>
                <p className="mt-2 text-[22px] font-extrabold text-[#07162d]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="divide-y divide-[#e4edf5]">
            {sections.map((section) => (
              <article
                key={section.title}
                className="grid gap-8 py-12 lg:grid-cols-[14rem_1fr]"
              >
                <div>
                  <p
                    className={`text-[48px] font-extrabold leading-none ${section.accent}`}
                  >
                    {section.kicker}
                  </p>
                  <div className="mt-4 h-1 w-16 bg-current opacity-20" />
                </div>
                <div>
                  <h2 className="max-w-4xl text-[34px] font-extrabold leading-tight tracking-[-0.01em] text-[#07162d]">
                    {section.title}
                  </h2>
                  <div className="mt-6 grid gap-4">
                    {section.body.map((line) => (
                      <p
                        key={line}
                        className="max-w-5xl text-[17px] font-medium leading-9 text-[#475467]"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-8 bg-linear-to-r from-[#195585] via-[#1375de] to-[#12b76a] p-8 text-white md:p-10">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-[32px] font-extrabold tracking-[-0.01em]">
                  Questions about loan disclosures?
                </h2>
                <p className="mt-3 max-w-3xl text-[16px] font-semibold leading-8 text-white/82">
                  For product explanations, partner status, document
                  requirements, or support with a submitted application, write
                  to the Fintaraa support desk.
                </p>
              </div>
              <a
                href="mailto:support@fintaraa.com"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[14px] font-extrabold text-[#195585] no-underline"
              >
                support@fintaraa.com
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
