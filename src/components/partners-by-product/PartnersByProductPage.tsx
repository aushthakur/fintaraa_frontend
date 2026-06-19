import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Building2,
  Landmark,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { PartnerProductShowcase } from "./PartnerProductShowcase";

function HeroBadge({
  className,
  icon: Icon,
}: {
  className: string;
  icon: LucideIcon;
}) {
  return (
    <div
      className={`absolute flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white text-[#1f4fbf] shadow-[0_18px_40px_rgba(0,0,0,0.15)] ${className}`}
    >
      <Icon className="h-8 w-8" />
    </div>
  );
}

export default function PartnersByProductPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0d377f_0%,#092e77_45%,#082767_100%)] px-4 text-white md:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_84%_24%,rgba(255,255,255,0.05),transparent_14%)]" />
        <div className="pointer-events-none absolute left-[34%] top-0 hidden h-full w-90 opacity-[0.18] md:block lg:w-130">
          <div className="h-full w-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_1px,transparent_1.5px)] bg-[length:9px_9px] [mask-image:radial-gradient(ellipse_at_center,black_0%,black_45%,transparent_72%)]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-[36%] h-px bg-white/5" />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-[-40px] h-80 w-80 rounded-full bg-[#2b67ff]/16 blur-3xl" />

        <div className="relative mx-auto flex max-w-9xl flex-col justify-center py-8 lg:h-87.5 lg:py-0">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="max-w-3xl">
              <p className="text-[13px] font-semibold text-white/70">
                Our Partners
              </p>
              <h1 className="mt-4 text-[42px] font-extrabold leading-[1.03] tracking-normal text-white sm:text-[50px] lg:text-[52px]">
                Our Partners from
                <span className="block">across the industry</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-[1.6] text-white/78">
                We collaborate with leading financial institutions and service
                providers to bring you the best solutions.
              </p>
            </div>

            <div className="relative mx-auto flex min-h-62.5 w-full max-w-130 items-center justify-center lg:min-h-75">
              <div className="absolute inset-x-[15%] top-[15%] h-[70%] rounded-full border border-white/12" />
              <div className="absolute left-[10%] top-[38%] h-10 w-10 rounded-full border border-white/10" />
              <div className="absolute right-[10%] top-[31%] h-10 w-10 rounded-full border border-white/10" />
              <HeroBadge className="left-[17%] top-[16%]" icon={Landmark} />
              <HeroBadge className="right-[15%] top-[13%]" icon={ShieldCheck} />
              <HeroBadge className="left-[9%] top-[48%]" icon={CreditCard} />
              <HeroBadge className="right-[4%] top-[47%]" icon={Building2} />

              <div className="relative z-10 flex items-center justify-center">
                <Image
                  src="/assets/images/handshake.png"
                  alt="Handshake partnership"
                  width={380}
                  height={240}
                  unoptimized
                  className="h-auto w-70 drop-shadow-[0_24px_40px_rgba(0,0,0,0.22)] sm:w-78.75 lg:w-82.5"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerProductShowcase />

      <section className="px-4 pb-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl rounded-[18px] border border-[#d9eafb] bg-[#eaf4ff] px-5 py-6 shadow-[0_18px_42px_rgba(16,24,40,0.06)] md:px-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-21 w-21 shrink-0 items-center justify-center rounded-2xl border border-dashed border-[#8bbbf0] bg-white/75 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#407bd8]">
               <Image
  src="/assets/images/help-desk 1.png"
  alt="Handshake partnership"
  width={120}
  height={120}
  unoptimized
  className="h-25 w-25 object-contain sm:h-27.5 sm:w-27.5 lg:h-30 lg:w-30"
/>
              </div>
              <div>
                <p className="text-[22px] font-extrabold tracking-[-0.03em] text-[#152033] sm:text-[26px]">
                  Need help choosing the right partner or product?
                </p>
                <p className="mt-1 text-[15px] font-medium text-[#667085]">
                  Connect with our experts and get personalized assistance.
                </p>
              </div>
            </div>

            <a
              href="/contact-us"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#16b654] px-7 text-[16px] font-semibold text-white no-underline shadow-[0_16px_30px_rgba(22,182,84,0.24)] transition hover:-translate-y-0.5 hover:bg-[#119b48]"
            >
              <PhoneCall className="h-5 w-5" />
              Talk to Loan Expert
            </a>
          </div>
        </div>
      </section>

      <AppDownloadBanner />
    </main>
  );
}
