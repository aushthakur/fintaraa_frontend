import Image from "next/image";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { PremiumServiceTimeline } from "./PremiumServiceTimeline";

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
            <h2 className="text-[22px] font-extrabold text-[#2a2f36]">
              {title}
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b95a3]">
              Enter your mobile number and tracking id &amp; check status
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="grid gap-1.5">
                <span className="text-[12px] font-extrabold text-[#2a2f36]">
                  Mobile Number
                </span>
                <input
                  placeholder="Enter Mobile Number"
                  className="h-10 rounded-lg border border-[#dce3eb] px-3 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#4c1d95]"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[12px] font-extrabold text-[#2a2f36]">
                  {idLabel}
                </span>
                <input
                  placeholder="Enter Inquiry ID"
                  className="h-10 rounded-lg border border-[#dce3eb] px-3 text-[12px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#4c1d95]"
                />
              </label>
              <button
                type="button"
                className="h-10 rounded-full border-2 border-[#13a653] px-8 text-[13px] font-extrabold text-[#13a653] transition hover:bg-[#13a653] hover:text-white"
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
      <div className="mx-auto max-w-9xl">
        <PremiumServiceTimeline title={title} activeStep={2} />
      </div>
    </section>
  );
}

export function ServiceFaqSection({ subtitle }: { subtitle: string }) {
  return <FaqAccordion subtitle={subtitle} />;
}

export function ServiceAppBanner() {
  return <AppDownloadBanner />;
}
