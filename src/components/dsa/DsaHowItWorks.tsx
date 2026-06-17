import { ArrowRight, ShieldCheck } from "lucide-react";
import { dsaSteps } from "./dsaData";

export function DsaHowItWorks() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#33393f]">
          How Partnership Works
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dsaSteps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < dsaSteps.length - 1 ? (
                <ArrowRight className="absolute right-[-22px] top-6 hidden h-8 w-8 text-[#0d64bf] lg:block" />
              ) : null}
              <div className="rounded-[22px] bg-white px-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5ff] text-[#0d64bf]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="h-px flex-1 bg-[#dfe8f3] lg:hidden" />
                </div>
                <h3 className="mt-4 text-[14px] font-extrabold leading-5 text-[#22272e]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[16rem] text-[11px] font-medium leading-5 text-[#8b95a5]">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
