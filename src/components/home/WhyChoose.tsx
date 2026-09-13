"use client";

import Link from "next/link";
import {
  ShieldCheck,
  UsersRound,
  Clock,
  Star,
  Landmark,
  CheckCircle2,
  Zap,
  Headphones,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    value: "2M+",
    label: "Happy Customers",
    sub: "Across 200+ Cities",
    icon: UsersRound,
    accent: "#6424C7",
    badge: "Active Users",
    bg: "rgba(100,36,199,0.08)",
  },
  {
    value: "50+",
    label: "Partner Banks & NBFCs",
    sub: "RBI Regulated",
    icon: Landmark,
    accent: "#0ea5e9",
    badge: "Official Tie-ups",
    bg: "rgba(14,165,233,0.08)",
  },
  {
    value: "₹50,000 Cr+",
    label: "Processed Successfully",
    sub: "Secure Disbursal",
    icon: ShieldCheck,
    accent: "#10b981",
    badge: "Disbursed",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    value: "24-48 hrs",
    label: "Average Approval Time",
    sub: "Fast Digital Flow",
    icon: Clock,
    accent: "#f59e0b",
    badge: "Express Track",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    value: "4.8 / 5",
    label: "Customer Rating",
    sub: "Verified Reviews",
    icon: Star,
    accent: "#8b5cf6",
    badge: "50k+ Reviews",
    bg: "rgba(139,92,246,0.08)",
  },
];

const pillars = [
  {
    title: "100% Transparent",
    badge: "Zero Hidden Fees",
    text: "Zero hidden charges. Clear comparison of fees, interest rates & EMIs across all lenders before you commit.",
    icon: CheckCircle2,
    gradient: "from-purple-500/10 to-indigo-500/5",
    accent: "#6424C7",
    highlight: "₹0 Free Comparison",
  },
  {
    title: "RBI Compliant Partners",
    badge: "Bank-Grade Safety",
    text: "Every loan and card offer is powered strictly by registered commercial banks and RBI-regulated NBFCs with 256-bit encryption.",
    icon: ShieldCheck,
    gradient: "from-emerald-500/10 to-teal-500/5",
    accent: "#10b981",
    highlight: "256-bit SSL Security",
  },
  {
    title: "Fast Digital Processing",
    badge: "Paperless Flow",
    text: "Minimal paperwork with assisted digital verification, instant e-KYC, and automated eligibility for rapid disbursals.",
    icon: Zap,
    gradient: "from-cyan-500/10 to-blue-500/5",
    accent: "#0ea5e9",
    highlight: "Instant e-KYC",
  },
  {
    title: "Dedicated Loan Experts",
    badge: "1-on-1 Guidance",
    text: "Experienced loan advisors to guide you through documentation, negotiate optimal terms, and maximize loan approvals.",
    icon: Headphones,
    gradient: "from-amber-500/10 to-orange-500/5",
    accent: "#f59e0b",
    highlight: "Free Advisory",
  },
];

export function WhyChoose() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#fafbfe] via-white to-[#fafbfe] py-14 sm:py-20"
      aria-label="Why Choose Fintaraa"
    >
      {/* Soft ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(100,36,199,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(14,165,233,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 px-3.5 py-1 text-[12px] font-semibold text-[#6424C7] shadow-2xs mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-[#6424C7]" />
            <span>Built on Trust, Transparency &amp; Speed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-tight text-gray-900 leading-tight">
            Why Choose <span style={{ color: "#6424C7" }}>Fintaraa</span>
          </h2>
          <p className="mt-3 text-[14.5px] sm:text-[16px] text-gray-500 font-normal max-w-xl mx-auto leading-relaxed">
            India&apos;s trusted marketplace for loans, cards, insurance, and smart financial decisions.
          </p>
        </div>

        {/* Impact Numerical Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 lg:gap-5">
          {stats.map(({ value, label, sub, icon: Icon, accent, badge, bg }) => (
            <div
              key={label}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#6424C7]/30 hover:shadow-[0_16px_32px_-8px_rgba(100,36,199,0.14)] hover:-translate-y-1.5 last:col-span-2 sm:last:col-span-1"
            >
              {/* Badge tag */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium border"
                  style={{
                    backgroundColor: bg,
                    color: accent,
                    borderColor: `${accent}30`,
                  }}
                >
                  {badge}
                </span>
              </div>

              <div>
                <p className="text-[24px] sm:text-[27px] font-bold text-gray-900 tracking-tight leading-tight">
                  {value}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-gray-800 leading-snug">
                  {label}
                </p>
                <p className="mt-0.5 text-[11px] font-normal text-gray-400">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Trust & Advantage Pillars */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#6424C7]/30 hover:shadow-[0_16px_36px_-8px_rgba(100,36,199,0.14)] hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Ambient corner gradient */}
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${pillar.gradient} blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div>
                  {/* Top row with icon & tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: `${pillar.accent}12` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: pillar.accent }} />
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10.5px] font-medium border"
                      style={{
                        backgroundColor: `${pillar.accent}0f`,
                        color: pillar.accent,
                        borderColor: `${pillar.accent}30`,
                      }}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-[15.5px] font-semibold text-gray-900 group-hover:text-[#6424C7] transition-colors leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500 font-normal">
                    {pillar.text}
                  </p>
                </div>

                {/* Bottom highlight pill */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11.5px] font-medium text-gray-600 flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: pillar.accent }}
                    />
                    {pillar.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Eye-catching Bottom Guarantee Strip */}
        <div className="mt-8 sm:mt-10 rounded-2xl bg-gradient-to-r from-purple-900 via-[#6424C7] to-indigo-900 p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          {/* Subtle light shimmer */}
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
          />
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <h4 className="text-[16.5px] sm:text-[18px] font-semibold text-white tracking-tight">
                Ready to find the loan that fits your dreams?
              </h4>
              <p className="text-[12.5px] sm:text-[13.5px] text-purple-100/90 font-normal mt-0.5">
                Check personalized offers across 50+ partner lenders in under 2 minutes with zero credit impact.
              </p>
            </div>
          </div>
          <Link
            href="/eligibility-results"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#6424C7] transition-all hover:bg-purple-50 hover:shadow-md hover:scale-[1.02]"
          >
            Check Eligibility Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
