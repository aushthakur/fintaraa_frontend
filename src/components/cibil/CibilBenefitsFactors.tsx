"use client";

import React from "react";
import { ChartNoAxesCombined, CreditCard, ShieldCheck } from "lucide-react";
import { History, BarChart3, LineChart, FileText } from "lucide-react";

const factors = [
  {
    title: "Payment History",
    desc: "Paying your EMIs and bills on time helps improve your CIBIL score",
    icon: History,
  },
  {
    title: "Credit Utilization",
    desc: "Using only a small part of your credit limit shows responsible usage.",
    icon: CreditCard,
  },
  {
    title: "Credit Age",
    desc: "Older credit accounts help build a stronger credit history.",
    icon: BarChart3,
  },
  {
    title: "Credit Mix",
    desc: "A healthy mix of loans and credit cards can improve your score.",
    icon: LineChart,
  },
  {
    title: "Credit Enquiries",
    desc: "Too many loan or card applications in a short time can lower your score.",
    icon: FileText,
  },
];

const benefits = [
  {
    title: "Know Your Credit Health",
    text: "Understand your credit worthiness",
    icon: CreditCard,
  },
  {
    title: "Better Loan Eligibility",
    text: "Improve chances of loan approval",
    icon: ShieldCheck, // Custom stamp-style visual to match image_9eb7ab.png
  },
  {
    title: "Higher Credit Limits",
    text: "Get better credit card offers",
    icon: CreditCard,
  },
  {
    title: "Financial Planning",
    text: "Plan your finances better",
    icon: ChartNoAxesCombined,
  },
];

export function CibilBenefitsFactors() {
  return (
    <>
      {/* SECTION 1: Why Check Your CIBIL Score? (image_9eb7ab.png) */}
      <section className="bg-[#00529c] px-4 py-16 md:px-6 lg:px-8 w-full select-none text-white">
        <div className="mx-auto max-w-9xl">
          {/* Main Underlined Section Heading Stack */}
          <div className="flex flex-col items-start">
            <h2 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold tracking-tight text-white relative pb-2 inline-block">
              Why Check Your CIBIL Score?
              {/* White accent bottom rule highlight */}
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-white rounded-full opacity-90" />
            </h2>

            <p className="mt-4 max-w-xl text-[14px] md:text-[15px] font-normal text-white/85 leading-relaxed">
              Checking your score regularly helps you stay financially healthy
              and get the best offers.
            </p>
          </div>

          {/* Premium White Content Cards Layout Grid */}
          <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl bg-white p-6 md:p-7 flex flex-col justify-start min-h-55 transition-transform duration-200 hover:scale-[1.01] shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
              >
                {/* Embedded Soft-Colored Icon Box Container */}
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f4ff] text-[#00529c]">
                  <Icon className="h-5 w-5 stroke-[1.8]" />
                </div>

                {/* Card Context Data Details Group */}
                <h3 className="mt-6 text-[16px] font-bold text-gray-900 leading-tight tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-gray-500 max-w-52.5">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: What Affects Your CIBIL Score? (image_9eb010.png) */}
      <section className="bg-white px-4 py-12 md:px-6 lg:px-8 w-full select-none">
        <div className="mx-auto max-w-9xl">
          {/* Section Heading Group Layout */}
          <div className="flex flex-col items-start text-left mb-10">
            <h2 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-[#222222]">
              What affects your Score?
            </h2>
            <p className="mt-2 text-[14px] font-medium text-gray-500 max-w-xl leading-relaxed">
              Understand the key factors that shape your CIBIL score.
            </p>
          </div>

          {/* Dynamic Card Matrix Grid matching image_9eb010.png */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {factors.map((item) => {
              const IconComponent = item.icon;
              return (
                <article
                  key={item.title}
                  className="min-h-62.5 rounded-xl border border-gray-200/80 bg-white p-5 flex flex-col justify-start text-left shadow-[0_2px_12px_rgba(0,0,0,0.005)]"
                >
                  {/* Micro-Icon Box Wrapper Container */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4ff] text-[#00529c] mb-6">
                    <IconComponent className="h-4 w-4 stroke-[1.75]" />
                  </div>

                  {/* Content Details Block */}
                  <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[12px] font-medium leading-relaxed text-gray-500">
                    {item.desc}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Bottom Integrated Action Dashboard Banner Layout Block */}
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-blue-100/60 bg-[#f0f7ff] p-5 md:p-8 md:px-10">
            <div className="flex flex-col text-left">
              <p className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-[#1d2939] tracking-tight">
                Join millions who are monitoring their CIBIL score with Fintaraa
              </p>
              <p className="mt-1.5 text-[14px] font-medium text-gray-400">
                It’s a quick, secure and completely FREE!
              </p>
            </div>

            {/* Custom Styled Shield Icon Matching Right Hand Silhouette Placement */}
            <div className="text-[#00529c] shrink-0 flex items-center justify-center">
              <ShieldCheck className="h-16 w-16 stroke-[1.2] fill-[#00529c]/5" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
