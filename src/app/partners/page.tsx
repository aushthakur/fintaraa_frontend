import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import {
  BadgeCheck,
  CreditCard,
  Home,
  Landmark,
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";

const fallbackMetadata: Metadata = {
  title: "Our Lending Partners",
  description:
    "View Fintaraa's lending and insurance partners, due diligence approach, product coverage, and servicing principles.",
};

const partners = [
  {
    name: "Piramal Finance",
    segment: "Secured Lending",
    focus:
      "Home loans, loan against property, and secured top-ups for salaried and self-employed borrowers.",
    strength:
      "Useful for customers who need longer tenure, collateral-backed affordability, and assisted documentation.",
    labels: ["Home loans", "LAP", "Top-up credit"],
    color: "#0ea5e9",
    icon: Home,
  },
  {
    name: "SMFG India Credit",
    segment: "Personal Loans",
    focus:
      "Unsecured personal loans using bureau behaviour, banking signals, and profile-led risk evaluation.",
    strength:
      "Designed for fast KYC, practical ticket sizes, structured repayment, and responsive customer support.",
    labels: ["Instant KYC", "Personal credit", "EMI support"],
    color: "#22c55e",
    icon: Zap,
  },
  {
    name: "Capital First (IDFC FIRST)",
    segment: "Consumer Credit",
    focus:
      "Consumer finance, credit cards, merchant-led EMI offers, and transparent fee schedules.",
    strength:
      "Strong disclosure discipline, borrower education, and omnichannel servicing for credit journeys.",
    labels: ["Cards & EMI", "Consumer finance", "Disclosure led"],
    color: "#6366f1",
    icon: CreditCard,
  },
  {
    name: "HDFC Bank",
    segment: "Insurance Distribution",
    focus:
      "Health, term, credit protect, and protection-led products for salaried and professional segments.",
    strength:
      "Extensive branch and claims ecosystem, digital issuance, and regulator-aligned service commitments.",
    labels: ["Health & term", "Credit protect", "Claims support"],
    color: "#f97316",
    icon: ShieldCheck,
  },
];

const principles = [
  {
    title: "Curated, regulated network",
    copy: "Fintaraa works with banks, NBFCs, and insurers that are selected for governance, disclosure quality, turnaround times, servicing capacity, and customer fairness. The objective is not to show every possible offer, but to surface relevant options customers can evaluate with confidence.",
  },
  {
    title: "Due diligence before onboarding",
    copy: "Before a partner goes live, we review product governance, Key Fact Statements, sanction formats, fee disclosures, claims protocols, data-sharing requirements, and support SLAs. Partners with unclear charges or weak customer handling are not prioritised until gaps are resolved.",
  },
  {
    title: "Continuous monitoring",
    copy: "After onboarding, we monitor approval rates, document rejection patterns, grievance trends, turnaround times, fraud signals, and exception handling. Feedback from customers directly influences which products are elevated across the marketplace.",
  },
  {
    title: "Secure data exchange",
    copy: "Partner integrations use consent-led workflows, secure APIs, encrypted document movement, role-based access, and audit trails. Bureau pulls, KYC, bank-statement analysis, and payment mandates are initiated only in line with customer consent and applicable law.",
  },
  {
    title: "Balanced product coverage",
    copy: "A useful marketplace needs emergency personal loans, secured long-tenure credit, cards for flexibility, and protection products that reduce repayment risk. Fintaraa maps these categories across income segments, cities, and documentation profiles.",
  },
  {
    title: "Servicing after approval",
    copy: "Our responsibility does not end at application submission. We help customers understand status updates, repayment steps, claim or policy support, statement access, mandate issues, and escalation paths where partner coordination is required.",
  },
];

const journey = [
  {
    label: "Discovery",
    text: "Customers share requirement, profile, city, and documentation readiness.",
    icon: Search,
  },
  {
    label: "Verification",
    text: "Consent-led KYC, bureau checks, income validation, and document review.",
    icon: BadgeCheck,
  },
  {
    label: "Partner Decision",
    text: "The selected lender or insurer evaluates eligibility and shares final terms.",
    icon: Landmark,
  },
  {
    label: "Servicing",
    text: "Customers track disbursal, EMI, policy, claim, or support requests.",
    icon: RefreshCw,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/partners", fallbackMetadata);
}

export default function PartnersPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#f5fbff] px-4 py-16 md:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#195585] via-[#6366f1] to-[#12b76a]" />
        <div className="pointer-events-none absolute -right-40 -top-32 h-120 w-120 rounded-full bg-[#6366f1]/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-112 w-md rounded-full bg-[#12b76a]/12 blur-3xl" />

        <div className="relative mx-auto max-w-9xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_28rem] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#195585] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white">
                <ShieldCheck className="h-4 w-4" />
                Partner Network
              </div>
              <h1 className="mt-7 max-w-5xl text-[44px] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#07162d] md:text-[72px]">
                Our Lending Partners
              </h1>
              <p className="mt-7 max-w-4xl text-[19px] font-semibold leading-9 text-[#344054]">
                A curated network of regulated banks, NBFCs, and insurers,
                selected for transparent pricing, responsible underwriting,
                secure data handling, and dependable servicing.
              </p>
            </div>

            <div className="bg-[#195585] p-7 text-white">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/60">
                Marketplace Standard
              </p>
              <p className="mt-4 text-[28px] font-extrabold leading-tight">
                Partners are reviewed for compliance, customer outcomes, and
                operational discipline.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {partners.map(
              ({
                name,
                segment,
                focus,
                strength,
                labels,
                color,
                icon: Icon,
              }) => (
                <article key={name} className="group">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-13 w-13 items-center justify-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#98a2b3]">
                      {segment}
                    </span>
                  </div>
                  <h2 className="mt-6 text-[28px] line-clamp-1 font-extrabold leading-tight text-[#07162d]">
                    {name}
                  </h2>
                  <p className="mt-4 text-[15px] line-clamp-2 font-semibold leading-7 text-[#475467]">
                    {focus}
                  </p>
                  <p className="mt-4 text-[14px] line-clamp-3 font-medium leading-7 text-[#667085]">
                    {strength}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {labels.map((label) => (
                      <span
                        key={label}
                        className="bg-[#f1f8ff] px-3 py-1 text-[12px] font-extrabold text-[#195585]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 h-px bg-linear-to-r from-[#195585] via-[#12b76a] to-transparent opacity-45" />
                </article>
              ),
            )}
          </div>

          <section className="mt-16 bg-[#07162d] px-6 py-12 text-white md:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#7ee3a2]">
                  Partner governance
                </p>
                <h2 className="mt-4 text-[42px] font-extrabold leading-tight tracking-[-0.02em]">
                  What makes a partner fit for Fintaraa
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {principles.map((item) => (
                  <article key={item.title}>
                    <h3 className="text-[21px] font-extrabold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] font-medium leading-7 text-white/72">
                      {item.copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
                  Customer journey
                </p>
                <h2 className="mt-3 text-[38px] font-extrabold leading-tight tracking-[-0.02em] text-[#07162d]">
                  How partner-backed applications move
                </h2>
              </div>
              <p className="max-w-xl text-[16px] font-medium leading-8 text-[#475467]">
                Fintaraa stays the orchestration layer while regulated partners
                make underwriting, sanction, disbursal, and servicing decisions.
              </p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-4">
              {journey.map(({ label, text, icon: Icon }, index) => (
                <div key={label} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center bg-[#eef8ff] text-[#195585]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[13px] font-extrabold text-[#98a2b3]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[22px] font-extrabold text-[#07162d]">
                    {label}
                  </h3>
                  <p className="mt-3 text-[15px] font-medium leading-7 text-[#475467]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
