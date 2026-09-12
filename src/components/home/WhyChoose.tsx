"use client";

import { ShieldCheck, UsersRound, Clock, Star, Landmark } from "lucide-react";

const stats = [
  { value: "2M+", label: "Happy Customers", icon: UsersRound },
  { value: "50+", label: "Partner Banks & NBFCs", icon: Landmark },
  { value: "₹50,000 Cr+", label: "Processed Successfully", icon: ShieldCheck },
  { value: "24-48 hrs", label: "Average Approval Time", icon: Clock },
  { value: "4.8 / 5", label: "Customer Rating", icon: Star },
];

const pillars = [
  {
    title: "100% Transparent",
    text: "Zero hidden charges. Clear comparison of fees, interest rates & EMIs across all lenders.",
  },
  {
    title: "RBI Compliant Partners",
    text: "Every loan and card offer is powered by registered banks and RBI-regulated NBFCs.",
  },
  {
    title: "Fast Digital Processing",
    text: "Minimal paperwork with assisted digital verification for rapid disbursals.",
  },
  {
    title: "Dedicated Loan Experts",
    text: "Experienced loan advisors to guide you through documentation and loan approval.",
  },
];

export function WhyChoose() {
  return (
    <section
      className="bg-[#fafafa] py-6 sm:py-8"
      aria-label="Why Choose Fintaraa"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#5b21b6]" />
          <h2 className="text-[17px] font-semibold text-[#0f172a] sm:text-[20px]">
            Why Choose Fintaraa
          </h2>
        </div>
        <p className="text-[12px] font-normal text-[#64748b]">
          India&apos;s trusted marketplace for loans, cards, insurance and financial solutions
        </p>

        {/* Compact Numerical Stats Row */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-3 text-center shadow-2xs last:col-span-2 sm:last:col-span-1"
            >
              <Icon className="h-4 w-4 text-[#5b21b6]" />
              <p className="mt-1 text-[16px] font-semibold text-[#0f172a] sm:text-[18px]">
                {value}
              </p>
              <p className="mt-0.5 text-[11px] font-normal text-[#64748b]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Trust Pillars */}
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-2xs"
            >
              <h3 className="text-[12.5px] font-semibold text-[#0f172a]">
                {pillar.title}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-[#64748b]">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
