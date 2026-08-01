"use client";

import type { InsuranceSeoTab } from "@/services/insuranceSeoPages";

const coveredItems = [
  {
    title: "In-patient Hospitalization",
    description:
      "Covers room rent, boarding, and nursing expenses for min 24h stay.",
  },
  {
    title: "Pre & Post Hospitalization",
    description:
      "Expenses incurred 30–60 days before and 60–180 days after admission.",
  },
  {
    title: "Day Care Procedures",
    description:
      "Medical treatments that require less than 24 hours of hospitalization.",
  },
  {
    title: "Ambulance Charges",
    description:
      "Emergency transport costs to the nearest hospital are reimbursed.",
  },
  {
    title: "Organ Donor Expenses",
    description:
      "Hospitalization expenses for the person donating an organ to you.",
  },
  {
    title: "AYUSH Treatment",
    description:
      "Coverage for Ayurvedic, Unani, Sidha, and Homeopathy treatments.",
  },
];

const notCoveredItems = [
  {
    title: "Self-Inflicted Injuries",
    description:
      "Any injuries arising from intentional self-harm or suicide attempts.",
  },
  {
    title: "Cosmetic Surgery",
    description:
      "Treatments like plastic surgery unless required due to an accident.",
  },
  {
    title: "Adventure Sports",
    description:
      "Injuries sustained while participating in high-risk sports activities.",
  },
  {
    title: "War & Nuclear Fallout",
    description:
      "Medical issues resulting from war, invasion or radioactive contamination.",
  },
  {
    title: "Weight Loss Treatments",
    description: "Expenses related to obesity treatment or bariatric surgery.",
  },
  {
    title: "Drug & Alcohol Abuse",
    description:
      "Hospitalization due to addiction or overdose of illegal substances.",
  },
];

export function InsuranceCoverageExplanation({
  tab,
  embedded = false,
}: {
  tab?: InsuranceSeoTab;
  embedded?: boolean;
}) {
  const covered = tab?.covered?.length
    ? tab.covered.map((item) => ({ title: item, description: "" }))
    : coveredItems;
  const notCovered = tab?.notCovered?.length
    ? tab.notCovered.map((item) => ({ title: item, description: "" }))
    : notCoveredItems;

  return (
    <section
      className={
        embedded
          ? "antialiased text-[#111827]"
          : "mx-auto w-full max-w-9xl bg-white px-4 py-12 antialiased text-[#111827] md:px-6"
      }
    >
      {!embedded ? (
        <div className="mb-10 text-center">
          <h2 className="text-[32px] font-bold tracking-tight text-[#212529]">
            {tab?.title || "Understanding your coverage"}
          </h2>
          {tab?.description ? (
            <p className="mx-auto mt-3 max-w-3xl text-[14px] font-semibold leading-7 text-[#667085]">
              {tab.description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid items-stretch gap-4 md:grid-cols-2">
        <div className="space-y-6 rounded-2xl border border-[#dfe8ef] bg-white p-5 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight border-b border-gray-50 pb-2">
            What&apos;s Covered
          </h3>

          <div className="space-y-4">
            {covered.map((item) => (
              <div key={item.title} className="space-y-0.5">
                <h4 className="text-[15px] font-bold text-gray-800 tracking-tight">
                  {item.title}
                </h4>
                {item.description ? (
                  <p className="text-xs font-medium leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-[#dfe8ef] bg-[#fbfdff] p-5 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight border-b border-gray-50 pb-2">
            What&apos;s Not Covered
          </h3>

          <div className="space-y-4">
            {notCovered.map((item) => (
              <div key={item.title} className="space-y-0.5">
                <h4 className="text-[15px] font-bold text-gray-800 tracking-tight">
                  {item.title}
                </h4>
                {item.description ? (
                  <p className="text-xs font-medium leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
