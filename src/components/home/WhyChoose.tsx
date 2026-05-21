import { BadgeCheck, Landmark, ShieldCheck } from "lucide-react";
import { reasons } from "@/data/homePage";

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-[#195585] px-4 py-16 text-white">
      <div className="absolute -left-16 -top-10 h-32 w-32 rotate-45 border-18 border-white/20" />
      <div className="absolute -bottom-12 -right-10 h-32 w-32 rotate-45 border-18 border-white/20" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="text-[38px] font-extrabold leading-tight">
            Why Choose
            <br /> Fintaraa ?
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-7 text-white/75">
            Get a guided financial journey with transparent recommendations,
            secure handling, and trusted lending and insurance partners.
          </p>
          <div className="mt-8 flex items-end gap-5">
            <Landmark className="h-10 w-10 text-[#b8e4ff]" />
            <ShieldCheck className="h-20 w-20 rounded-full bg-[#12b76a] p-3 text-white shadow-2xl" />
            <BadgeCheck className="h-10 w-10 text-[#b8e4ff]" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="rounded-xl bg-white p-4 text-[#101828] shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            >
              <ShieldCheck className="h-8 w-8 text-[#195585]" />
              <h3 className="mt-3 text-lg font-semibold">{reason}</h3>
              <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                Designed for quick comparison and clear decision making.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
