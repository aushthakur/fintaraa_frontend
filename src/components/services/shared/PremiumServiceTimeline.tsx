"use client";

import {
  Check,
  ClipboardList,
  FileSearch,
  Loader2,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

const timelineSteps: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Inquiry Submitted", icon: ClipboardList },
  { label: "Expert Assigned", icon: UserCheck },
  { label: "Document Review", icon: FileSearch },
  { label: "Processing", icon: Loader2 },
  { label: "Completed", icon: Check },
];

export function PremiumServiceTimeline({
  title,
  activeStep = 0,
}: {
  title: string;
  activeStep?: number;
}) {
  const currentStep = Math.min(
    Math.max(Math.round(activeStep), 0),
    timelineSteps.length - 1,
  );

  return (
    <div className="relative w-full max-w-full overflow-hidden rounded-3xl border border-[#cfe1f1] bg-[linear-gradient(145deg,#ffffff_0%,#fafdff_54%,#f1f8ff_100%)] p-5 shadow-[0_22px_55px_rgba(12,78,151,0.09)] sm:p-6 md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#cbe8ff]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-[34%] h-52 w-52 rounded-full bg-[#dff7eb]/45 blur-3xl" />

      <h3 className="relative text-[21px] font-extrabold leading-tight tracking-[-0.02em] text-[#5b21b6] sm:text-[24px] md:text-[28px]">
        {title}
      </h3>

      <div className="relative mt-8 overflow-x-auto pb-2 pt-3 [scrollbar-width:none] md:mt-10 [&::-webkit-scrollbar]:hidden">
        <div className="grid min-w-[620px] grid-cols-5 items-start px-1 sm:min-w-[660px] md:min-w-0 md:px-3">
          {timelineSteps.map(({ label, icon: Icon }, index) => {
            const finalCompleted =
              currentStep === timelineSteps.length - 1 &&
              index === timelineSteps.length - 1;
            const completed = index < currentStep || finalCompleted;
            const active = index === currentStep && !finalCompleted;
            const connectorCompleted = index < currentStep;

            return (
              <div
                key={label}
                className="relative text-center"
                aria-current={active ? "step" : undefined}
              >
                {index < timelineSteps.length - 1 ? (
                  <div className="absolute left-1/2 top-5 h-1.5 w-full overflow-hidden rounded-full bg-[#dceefe] md:top-6">
                    {connectorCompleted ? (
                      <span
                        className="service-tracker-line-fill absolute inset-y-0 left-0 w-full overflow-hidden rounded-full bg-[linear-gradient(90deg,#5b21b6_0%,#08a8df_55%,#15b962_100%)]"
                        style={{ animationDelay: `${index * 210 + 120}ms` }}
                      />
                    ) : null}
                  </div>
                ) : null}

                <div className="relative z-10 mx-auto h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12">
                  {active ? (
                    <span className="service-tracker-active-ring absolute -inset-2 rounded-full border border-[#1684ed]/40" />
                  ) : null}
                  <span
                    className={`relative flex h-full w-full items-center justify-center rounded-full border text-[13px] font-extrabold transition-colors sm:text-sm md:text-[15px] ${
                      completed
                        ? "service-tracker-node-complete border-white/70 bg-[linear-gradient(145deg,#5b21b6_0%,#087fd8_55%,#12af65_135%)] text-white shadow-[0_8px_22px_rgba(91,33,182,0.28)]"
                        : active
                          ? "service-tracker-node-active border-white/80 bg-[linear-gradient(145deg,#5b21b6_0%,#087fd8_100%)] text-white shadow-[0_8px_26px_rgba(91,33,182,0.38)]"
                          : "border-[#c9e0f3] bg-white text-[#4b79a2] shadow-[0_5px_14px_rgba(35,92,139,0.09)]"
                    }`}
                    style={{
                      animationDelay: completed
                        ? `${index * 210 + 280}ms`
                        : undefined,
                    }}
                  >
                    {completed ? (
                      <Check className="h-4.5 w-4.5 stroke-3 sm:h-5 sm:w-5" />
                    ) : active ? (
                      <Icon
                        className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${label === "Processing" ? "animate-spin" : ""}`}
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                </div>

                <p
                  className={`mt-3 px-1 text-[11px] font-extrabold leading-[1.35] sm:text-[12px] md:mt-4 md:text-[13px] ${
                    completed || active ? "text-[#5b21b6]" : "text-[#52687c]"
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
