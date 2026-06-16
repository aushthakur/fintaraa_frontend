import { ArrowRight, ShieldCheck } from "lucide-react";
import { dsaSteps } from "./dsaData";

export function DsaHowItWorks() {
  return (
    <section className="px-4 py-9 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[22px] font-black text-[#111827]">
          How Partnership Works
        </h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {dsaSteps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-[#e8f4ff] text-[#005ca8]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              {index < dsaSteps.length - 1 ? (
                <ArrowRight className="absolute right-[-24px] top-4 hidden h-8 w-8 text-[#005ca8] lg:block" />
              ) : null}
              <h3 className="mt-4 text-[13px] font-black leading-5 text-[#111827]">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-38 text-[11px] font-medium leading-5 text-[#667085]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
