import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Headphones,
  Search,
  Workflow,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";
import {
  SectionReveal,
  PageMotionProvider,
} from "@/components/common/motion/SectionReveal";
import { trustedPartners } from "@/data/trustedPartners";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Our Lending Partners",
  description:
    "View Fintaraa's lending and insurance partners, due diligence approach, product coverage, and servicing principles.",
};

const networkStats = [
  { value: `${trustedPartners.length}+`, label: "Trusted institutions" },
  { value: "4", label: "Product categories" },
  { value: "100%", label: "Consent-led journeys" },
  { value: "1", label: "Assisted platform" },
];

const standards = [
  {
    title: "Regulated institutions",
    text: "Banks, NBFCs and insurers are reviewed for regulatory standing and product governance.",
    icon: ShieldCheck,
  },
  {
    title: "Clear product disclosures",
    text: "Pricing, eligibility, documents and key terms are surfaced before customers continue.",
    icon: FileCheck2,
  },
  {
    title: "Reliable customer support",
    text: "Turnaround, escalation handling and post-application service remain part of the review.",
    icon: Headphones,
  },
];

const journey = [
  {
    label: "Discover",
    text: "Compare relevant products and institutions.",
    icon: Search,
  },
  {
    label: "Verify",
    text: "Complete consent-led profile and document checks.",
    icon: BadgeCheck,
  },
  {
    label: "Partner review",
    text: "The institution evaluates eligibility and final terms.",
    icon: Landmark,
  },
  {
    label: "Track",
    text: "Follow application and servicing updates in one place.",
    icon: Workflow,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/partners", fallbackMetadata);
}

export default function PartnersPage() {
  return (
    <PageMotionProvider>
      <main className="bg-white text-[#102c45]">
        <section className="relative overflow-hidden border-b border-[#dfebf4] bg-linear-to-br from-white via-[#f7fbff] to-[#eef7ff] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#dceeff]/65 blur-3xl" />
          <div className="relative mx-auto grid max-w-9xl gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center">
            <SectionReveal>
              <h1 className="mt-5 max-w-3xl text-[36px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#07162d] sm:text-[44px] md:text-[52px]">
                Financial partners selected with customer clarity in mind
              </h1>
              <p className="mt-4 max-w-2xl text-[14px] font-medium leading-7 text-[#61748f] md:text-[15px]">
                Explore banks, NBFCs and financial institutions across loans,
                insurance, credit cards and credit services on Fintaraa.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#partner-directory"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[12px] font-extrabold text-white no-underline transition hover:bg-[#064cb8]"
                >
                  View partners
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/products"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#c9dce9] bg-white px-5 text-[12px] font-extrabold text-[#075cde] no-underline transition hover:border-[#8db9d6]"
                >
                  Explore products
                </Link>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.08} distance={14}>
              <div className="rounded-2xl border border-[#dce7ef] bg-white p-5 sm:p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#718397]">
                  Network at a glance
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {networkStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-[#f5f9fc] p-4"
                    >
                      <p className="text-[24px] font-extrabold text-[#075cde]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px] font-bold leading-4 text-[#61748f]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        <SectionReveal>
          <div id="partner-directory" className="scroll-mt-28">
            <TrustedPartnerBanksSection
              mode="grid"
              title="Banks, NBFCs and financial partners"
              className="py-10 md:py-12"
              showViewAllAction={false}
            />
          </div>
        </SectionReveal>

        <section className="border-y border-[#e2ebf2] bg-[#f7fafc] px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <div className="mx-auto max-w-9xl">
            <SectionReveal>
              <div className="max-w-2xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#075cde]">
                  Partner standards
                </p>
                <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.02em] text-[#07162d] md:text-[34px]">
                  What we review before showcasing a partner
                </h2>
              </div>
            </SectionReveal>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {standards.map(({ title, text, icon: Icon }, index) => (
                <SectionReveal key={title} delay={index * 0.06} distance={14}>
                  <article className="h-full rounded-2xl border border-[#dce7ef] bg-white p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#075cde]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-[17px] font-extrabold text-[#17354d]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[12px] font-medium leading-6 text-[#718598]">
                      {text}
                    </p>
                  </article>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <div className="mx-auto max-w-9xl">
            <SectionReveal>
              <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#07162d] md:text-[34px]">
                How a partner-backed journey works
              </h2>
            </SectionReveal>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {journey.map(({ label, text, icon: Icon }, index) => (
                <SectionReveal key={label} delay={index * 0.05} distance={12}>
                  <article className="flex h-full gap-3 rounded-2xl border border-[#e2ebf2] bg-white p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7ff] text-[#075cde]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#98a6b3]">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-0.5 text-[14px] font-extrabold text-[#17354d]">
                        {label}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium leading-5 text-[#718598]">
                        {text}
                      </p>
                    </div>
                  </article>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageMotionProvider>
  );
}
