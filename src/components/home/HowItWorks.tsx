import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  Headphones,
} from "lucide-react";

const workflowSteps = [
  {
    number: "01",
    title: "Share Your Requirement",
    text: "Tell us what you need, your preferred amount, city, income range, and basic profile details through a guided form.",
    icon: ClipboardList,
    color: "#0ea5e9",
    points: ["Product need", "Amount range", "Basic profile"],
  },
  {
    number: "02",
    title: "Get Eligibility Checked",
    text: "Fintaraa maps your profile against partner criteria so you can focus on practical options, not generic offers.",
    icon: BadgeCheck,
    color: "#22c55e",
    points: ["Profile fit", "Partner filters", "No noisy results"],
  },
  {
    number: "03",
    title: "Compare Clear Offers",
    text: "Review EMI comfort, tenure, estimated charges, required documents, and partner terms before moving ahead.",
    icon: FileCheck2,
    color: "#f97316",
    points: ["EMI view", "Documents", "Charges clarity"],
  },
  {
    number: "04",
    title: "Complete With Support",
    text: "Our support team helps with document upload, application movement, partner follow-up, and status tracking.",
    icon: Headphones,
    color: "#6366f1",
    points: ["Upload help", "Follow-ups", "Status updates"],
  },
];

export function HowItWorks() {
  return (
    <section className="bg-linear-to-b from-white via-[#f8fcff] to-white px-4 py-18 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
            Simple guided flow
          </p>
          <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-[#07162d] md:text-[44px]">
            How It Works
          </h2>
          <p className="mt-4 text-[16px] font-semibold leading-7 text-[#667085]">
            A clean process designed to help you discover suitable financial
            products, understand the next step, and complete applications with
            informed support.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-18 hidden h-px bg-linear-to-r from-transparent via-[#cfe1ef] to-transparent lg:block" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="relative rounded-2xl border border-[#e4edf5] bg-white p-5 shadow-[0_12px_30px_rgba(25,85,133,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_12px_24px_rgba(16,24,40,0.08)]"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[34px] font-extrabold leading-none text-[#e4edf5]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[21px] font-extrabold leading-tight text-[#07162d]">
                    {step.title}
                  </h3>
                  <p className="mt-3 min-h-24 text-[14px] font-semibold leading-6 text-[#667085]">
                    {step.text}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {step.points.map((point) => (
                      <span
                        key={point}
                        className="rounded-full bg-[#f1f8ff] px-3 py-1 text-[11px] font-extrabold text-[#195585]"
                      >
                        {point}
                      </span>
                    ))}
                  </div>

                  {index < workflowSteps.length - 1 ? (
                    <span className="absolute -right-4 top-15 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-[#dbe8f2] bg-white text-[#195585] shadow-sm xl:flex">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
