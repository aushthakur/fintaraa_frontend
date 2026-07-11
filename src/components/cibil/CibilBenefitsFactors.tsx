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
      <section className="w-full select-none bg-[#00529c] px-4 py-10 text-white md:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-9xl">
          {/* Main Underlined Section Heading Stack */}
          <div className="flex flex-col items-start">
            <h2 className="relative inline-block pb-2 text-[22px] font-bold tracking-tight text-white sm:text-[28px] md:text-[34px]">
              Why Check Your CIBIL Score?
              {/* White accent bottom rule highlight */}
              <div className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-white opacity-90" />
            </h2>

            <p className="mt-3 max-w-xl text-[13px] font-normal leading-6 text-white/85 md:text-[15px]">
              Checking your score regularly helps you stay financially healthy
              and get the best offers.
            </p>
          </div>

          {/* Premium White Content Cards Layout Grid */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {benefits.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="flex h-full min-w-0 items-start gap-3 rounded-xl bg-white p-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-transform duration-200 hover:scale-[1.01] sm:p-5 lg:flex-col lg:gap-0"
              >
                {/* Embedded Soft-Colored Icon Box Container */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ff] text-[#00529c] lg:h-11 lg:w-11">
                  <Icon className="h-4.5 w-4.5 stroke-[1.8] lg:h-5 lg:w-5" />
                </div>

                {/* Card Context Data Details Group */}
                <div className="min-w-0 lg:mt-5">
                  <h3 className="wrap-break-word text-[14px] font-bold leading-tight tracking-tight text-gray-900 md:text-[15px] lg:text-[16px]">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[12px] font-medium leading-5 text-gray-500 md:text-[13px]">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: What Affects Your CIBIL Score? (image_9eb010.png) */}
      <section className="w-full select-none bg-white px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-9xl">
          {/* Section Heading Group Layout */}
          <div className="mb-7 flex flex-col items-start text-left md:mb-9">
            <h2 className="text-[22px] font-bold tracking-tight text-[#222222] sm:text-[30px]">
              What affects your Score?
            </h2>
            <p className="mt-2 max-w-xl text-[13px] font-medium leading-6 text-gray-500 md:text-[14px]">
              Understand the key factors that shape your CIBIL score.
            </p>
          </div>

          {/* Dynamic Card Matrix Grid matching image_9eb010.png */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {factors.map((item) => {
              const IconComponent = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex h-full min-w-0 items-start gap-3 rounded-xl border border-gray-200/80 bg-white p-4 text-left shadow-[0_2px_12px_rgba(0,0,0,0.005)] xl:flex-col xl:gap-0"
                >
                  {/* Micro-Icon Box Wrapper Container */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ff] text-[#00529c]">
                    <IconComponent className="h-4 w-4 stroke-[1.75]" />
                  </div>

                  {/* Content Details Block */}
                  <div className="min-w-0 xl:mt-5">
                    <h3 className="wrap-break-word text-[14px] font-bold leading-tight tracking-tight text-gray-900 md:text-[15px]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] font-medium leading-5 text-gray-500">
                      {item.desc}
                    </p>
                  </div>
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
