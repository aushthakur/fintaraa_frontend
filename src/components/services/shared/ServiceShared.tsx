import { ChevronDown } from "lucide-react";
import Image from "next/image";
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
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Status icon — replace /assets/services/track-status-icon.png with your icon */}
          <div className="flex shrink-0 justify-center md:justify-start">
            <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#dbeeff]">
              <Image
                src="/assets/services/statusicon1.png"
                alt="Track status icon"
                width={48}
                height={48}
                unoptimized
                className="relative z-10 object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-[22px] font-black text-[#2a2f36]">{title}</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b95a3]">
              Enter your mobile number and tracking id &amp; check status
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="grid gap-1.5">
                <span className="text-[12px] font-black text-[#2a2f36]">
                  Mobile Number
                </span>
                <input
                  placeholder="Enter Mobile Number"
                  className="h-10 rounded-lg border border-[#dce3eb] px-3 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8]"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[12px] font-black text-[#2a2f36]">
                  {idLabel}
                </span>
                <input
                  placeholder="Enter Inquiry ID"
                  className="h-10 rounded-lg border border-[#dce3eb] px-3 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8]"
                />
              </label>
              <button
                type="button"
                className="h-10 rounded-full border-2 border-[#13a653] px-8 text-[13px] font-black text-[#13a653] transition hover:bg-[#13a653] hover:text-white"
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

const timelineSteps = [
  "Inquiry Submit",
  "Expert Assigned",
  "Document Review",
  "Processing",
  "Completed",
];

export function ServiceTimeline({ title }: { title: string }) {
  return (
    <section className="px-4 pb-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-9">
        <h2 className="text-[28px] font-black tracking-[-0.01em] text-[#005ca8]">
          {title}
        </h2>

        <div className="mt-10 grid grid-cols-5 items-start">
          {timelineSteps.map((label, index) => (
            <div key={label} className="relative text-center">
              {/* Connector line */}
              {index < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-5.5 h-0.75 w-full ${
                    index < 2 ? "bg-[#005ca8]" : "bg-[#daeeff]"
                  }`}
                />
              )}
              {/* Step circle */}
              <span
                className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-black ${
                  index < 2
                    ? "bg-[#005ca8] text-white"
                    : "bg-[#daeeff] text-[#005ca8]"
                }`}
              >
                {index + 1}
              </span>
              {/* Step label */}
              <p className="mt-4 text-[11px] font-bold leading-[1.4] text-[#374151]">
                {label}
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
