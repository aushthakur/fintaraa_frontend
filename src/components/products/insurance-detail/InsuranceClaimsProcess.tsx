"use client";

import { Fragment } from "react";
import { Clock, ShieldCheck, FileText, Zap } from "lucide-react";
import type { InsuranceSeoTab } from "@/services/insuranceSeoPages";

const claimSteps = [
  {
    number: "01",
    title: "Notify Us",
    text: "Inform the insurer within 24 hours of emergency admission or 48 hours before planned admission.",
    icon: Clock,
  },
  {
    number: "02",
    title: "Submit Docs",
    text: "Upload hospital bills, prescriptions, and discharge summary via our mobile app.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Verification",
    text: "Our medical experts verify the documents and process the claim details.",
    icon: FileText,
  },
  {
    number: "04",
    title: "Settlement",
    text: "Amount is directly settled with the hospital (Cashless) or reimbursed to you.",
    icon: Zap,
  },
];

export function InsuranceClaimsProcess({
  tab,
  embedded = false,
}: {
  tab?: InsuranceSeoTab;
  embedded?: boolean;
}) {
  const steps = tab?.bullets?.length
    ? tab.bullets.map((item, index) => ({
        number: String(index + 1).padStart(2, "0"),
        title: index === 0 ? "Start Claim" : `Step ${index + 1}`,
        text: item,
        icon: claimSteps[index % claimSteps.length].icon,
      }))
    : claimSteps;

  return (
    <section
      className={
        embedded
          ? "bg-white antialiased text-[#111827]"
          : "bg-white px-4 py-14 text-[#111827] antialiased md:px-6 lg:px-16"
      }
    >
      <div className="mx-auto max-w-9xl text-center">
        {!embedded ? (
          <>
            <h2 className="text-[24px] font-bold tracking-tight text-gray-900 md:text-[26px]">
              {tab?.title || "Hassle-Free Claims Process"}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-[13px] font-medium text-gray-400">
              {tab?.description ||
                "We understand that emergencies are stressful. Our digital claim process is built for speed."}
            </p>
          </>
        ) : null}

        <div
          className={`grid grid-cols-1 items-start gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-7 lg:gap-x-0 lg:gap-y-0 ${
            embedded ? "" : "mt-12 lg:mt-16"
          }`}
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Fragment key={step.title}>
                
                {/* INTERACTIVE STEP ELEMENT CARD CONTAINER */}
                <div className="flex flex-col items-center px-2 lg:col-span-1">
                  
                  {/* Icon Node Badge */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#4c1d95] text-white shadow-[0_4px_12px_rgba(0,92,168,0.2)]">
                    <IconComponent className="h-6 w-6" strokeWidth={2} />
                  </div>

                  {/* Step Number Badge */}
                  <div className="mt-6 bg-white px-2.5 py-0.5 rounded-full border border-gray-200 text-[10px] font-bold text-blue-500 shadow-2xs select-none">
                    {step.number}
                  </div>
                  
                  {/* Typography Block Copy Stack */}
                  <div className="mt-3.5 space-y-2">
                    <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-medium leading-relaxed text-gray-400 max-w-52.5 mx-auto">
                      {step.text}
                    </p>
                  </div>

                </div>

                {/* NATIVE DIRECTIONAL FLOW ARROW CONNECTOR SLOT 
                  Rendered in alternate rows directly inline within the grid matrix blueprint tree.
                */}
                {index < steps.length - 1 && (
                  <div className="hidden h-14 select-none items-center justify-center lg:col-span-1 lg:flex pointer-events-none">
                    <div className="flex items-center w-full px-2 max-w-32.5">
                      {/* Linear Horizontal Dashed Path Track Line */}
                      <div className="w-full h-0 border-t-2 border-dashed border-blue-200" />
                      {/* Hardcoded Arrow Tip Segment Element Vector Triangle */}
                      <div className="w-2 h-2 border-t-2 border-r-2 border-blue-300 rotate-45 -ml-1.5 shrink-0" />
                    </div>
                  </div>
                )}

              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
