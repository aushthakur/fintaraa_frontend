import Link from "next/link";
import {
  Mail,
  Download,
  FileText,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { LegalPageContent } from "@/data/legalPages";

const relatedLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Grievance Redressal", href: "/grievance" },
  { label: "Loan Disclosure", href: "/loan-disclosure" },
  { label: "Lending Partners", href: "/partners" },
];

export function LegalPolicyPage({
  content,
  eyebrow,
  canonicalPath,
}: {
  content: LegalPageContent;
  eyebrow: string;
  canonicalPath: string;
}) {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden border-b border-[#d9e8f4] bg-[#f5fbff] px-4 py-16 md:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de]" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#12b76a]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#195585]/12 blur-3xl" />

        <div className="relative mx-auto max-w-9xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#195585] px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-white">
                <ShieldCheck className="h-4 w-4" />
                {eyebrow}
              </div>
              <h1 className="mt-7 max-w-5xl text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-[#07162d] md:text-[72px]">
                {content.title}
              </h1>
              <p className="mt-7 max-w-4xl text-[19px] font-semibold leading-9 text-[#344054]">
                {content.subtitle}
              </p>
            </div>

            <div className="border-l-4 border-[#195585] pl-6">
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#667085]">
                Effective status
              </p>
              <p className="mt-2 text-[24px] font-black text-[#07162d]">
                {content.updatedOn}
              </p>
              <p className="mt-4 text-[15px] font-semibold leading-7 text-[#475467]">
                Maintained for customers, applicants, borrowers, insured
                members, partners, and support teams working through Fintaraa.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {content.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white px-4 py-2 text-[13px] font-black text-[#195585] shadow-[0_8px_24px_rgba(25,85,133,0.08)]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-12 lg:grid-cols-[18rem_1fr]">
          <aside className="h-fit lg:sticky lg:top-32">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#98a2b3]">
              Documents
            </p>
            <nav className="mt-5 grid gap-1">
              {relatedLinks.map((item) => {
                const active = item.href === canonicalPath;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between border-l-2 px-4 py-3 text-[14px] font-black no-underline transition ${
                      active
                        ? "border-[#195585] bg-[#f1f8ff] text-[#195585]"
                        : "border-transparent text-[#475467] hover:border-[#195585] hover:text-[#195585]"
                    }`}
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </nav>
            <button className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-[#195585] px-5 text-[13px] font-black text-white">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </aside>

          <div>
            <section className="border-b border-[#e4edf5] pb-10">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-[#12b76a]" />
                <h2 className="text-[32px] font-black tracking-[-0.01em] text-[#07162d]">
                  Executive Summary
                </h2>
              </div>
              <div className="mt-7 grid gap-6 md:grid-cols-3">
                {content.highlights.map((highlight) => (
                  <div key={highlight} className="bg-gray-100 p-6">
                    <CheckCircle2 className="h-5 w-5 text-[#12b76a]" />
                    <p className="mt-4 text-[15px] text-justify font-medium leading-7 text-[#344054]">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="divide-y divide-[#e4edf5]">
              {content.sections.map((section, index) => (
                <article
                  key={section.title}
                  className="grid py-10 md:grid-cols-[6rem_1fr]"
                >
                  <div className="text-[14px] pt-2 font-black tracking-[0.16em] text-[#195585]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-[30px] font-bold leading-tight tracking-[-0.01em] text-[#07162d]">
                      {section.title}
                    </h3>
                    <p className="mt-5 max-w-5xl text-justify text-[17px] font-medium leading-9 text-[#475467]">
                      {section.body}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-8 overflow-hidden bg-[#195585] text-white">
              <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
                <div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6" />
                    <h2 className="text-[32px] font-black tracking-[-0.01em]">
                      Need clarification?
                    </h2>
                  </div>
                  <p className="mt-4 max-w-3xl text-[16px] font-semibold leading-8 text-white/82">
                    For questions about this document, consent, data rights,
                    partner responsibilities, or grievance escalation, contact
                    the Fintaraa support desk.
                  </p>
                </div>
                <a
                  href="mailto:support@fintaraa.com"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-black text-[#195585] no-underline"
                >
                  <Mail className="h-4 w-4" />
                  support@fintaraa.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
