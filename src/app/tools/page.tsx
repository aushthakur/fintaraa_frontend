import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeIndianRupee,
  Calculator,
  ClipboardList,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Financial Tools",
  description:
    "Use Fintaraa tools for CIBIL score, product discovery, application tracking, and credit card comparison.",
};

const tools = [
  {
    title: "CIBIL Score Checker",
    text: "Verify mobile, fetch score, and view report insights.",
    href: "/cibil-score",
    icon: ShieldCheck,
  },
  {
    title: "Loan & Insurance Products",
    text: "Explore product pages and start assisted applications.",
    href: "/products",
    icon: BadgeIndianRupee,
  },
  {
    title: "Credit Card Explorer",
    text: "Filter cards by bank, rewards, fee, network, and eligibility.",
    href: "/credit-cards",
    icon: CreditCard,
  },
  {
    title: "Application Tracker",
    text: "Track loan, insurance, and service request progress.",
    href: "/application-status",
    icon: ClipboardList,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/tools", fallbackMetadata);
}

export default function ToolsPage() {
  return (
    <main className="bg-white px-4 py-12 md:px-6 lg:px-8">
      <section className="mx-auto max-w-9xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#eef6ff] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#005ca8]">
          <Calculator className="h-4 w-4" />
          Tools
        </p>
        <h1 className="mt-5 text-[38px] font-extrabold tracking-[-0.02em] text-[#111827] md:text-[54px]">
          Financial tools and trackers
        </h1>
        <p className="mt-4 max-w-3xl text-[17px] font-semibold leading-8 text-[#667085]">
          Quick access to the tools already integrated across Fintaraa.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map(({ title, text, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="rounded-2xl border border-[#e4edf6] bg-white p-5 no-underline shadow-[0_18px_48px_rgba(16,24,40,0.06)] transition hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#005ca8]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-[18px] font-extrabold text-[#111827]">
                {title}
              </h2>
              <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
                {text}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
