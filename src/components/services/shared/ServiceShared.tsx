import { ChevronDown, ClipboardCheck } from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";

export const serviceFaqs = [
  "How long does it take for the request to be completed?",
  "Is there a penalty for late filing?",
  "Can I track my inquiry after submission?",
  "What documents are required?",
  "Do I need to provide any collateral or security?",
  "Will checking eligibility affect my CIBIL score?",
  "Can I update details after submitting?",
  "What happens if I miss a deadline?",
];

export function ServiceStatusCard({
  title,
  idLabel,
}: {
  title: string;
  idLabel: string;
}) {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-8">
        <div className="grid gap-6 md:grid-cols-[8rem_1fr] md:items-center">
          <div className="flex justify-center md:justify-start">
            <span className="flex h-22 w-22 items-center justify-center rounded-2xl bg-[#e8f4ff] text-[#005ca8]">
              <ClipboardCheck className="h-12 w-12" />
            </span>
          </div>
          <div>
            <h2 className="text-[24px] font-black text-[#2a2f36]">{title}</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b95a3]">
              Enter your mobile number and tracking id & check status
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="grid gap-2">
                <span className="text-[13px] font-black text-[#2a2f36]">
                  Mobile Number
                </span>
                <input
                  placeholder="Enter Mobile Number"
                  className="h-11 border border-[#dce3eb] px-4 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[13px] font-black text-[#2a2f36]">
                  {idLabel}
                </span>
                <input
                  placeholder="Enter Inquiry ID"
                  className="h-11 border border-[#dce3eb] px-4 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2]"
                />
              </label>
              <button
                type="button"
                className="h-12 rounded-full border border-[#13a653] px-12 text-[13px] font-black text-[#13a653]"
              >
                Track Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceTimeline({ title }: { title: string }) {
  return (
    <section className="px-4 pb-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-9">
        <h2 className="text-[32px] font-black tracking-[-0.02em] text-[#005ca8]">
          {title}
        </h2>
        <div className="mt-12 grid grid-cols-5 items-start">
          {[1, 2, 3, 4, 5].map((step, index) => (
            <div key={step} className="relative text-center">
              {index < 4 ? (
                <div
                  className={`absolute left-1/2 top-5 h-1 w-full ${
                    index < 2 ? "bg-[#005ca8]" : "bg-[#dff0ff]"
                  }`}
                />
              ) : null}
              <span
                className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[16px] font-black text-white ${
                  index < 2 ? "bg-[#005ca8]" : "bg-[#dff0ff]"
                }`}
              >
                {step}
              </span>
              <p className="mt-5 text-[12px] font-black text-[#111827]">
                Inquiry Submit
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceFaqSection({ subtitle }: { subtitle: string }) {
  return (
    <section className="px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-[34px] font-black tracking-[-0.02em] text-[#2a2f36]">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-[13px] font-semibold text-[#667085]">
          {subtitle}
        </p>
        <div className="mt-10 grid gap-4 text-left">
          {serviceFaqs.map((question) => (
            <details
              key={question}
              className="rounded-xl border border-[#e4eaf2] bg-white px-5 py-4 shadow-[0_5px_15px_rgba(16,24,40,0.04)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-black text-[#2a2f36]">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0" />
              </summary>
              <p className="mt-3 text-[12px] font-semibold leading-6 text-[#667085]">
                Our team will verify the latest requirement and guide you with
                the next step after submission.
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceAppBanner() {
  return <AppDownloadBanner />;
}
