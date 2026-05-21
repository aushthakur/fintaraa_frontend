import { Quote, ShieldCheck, Sparkles, Star } from "lucide-react";
import { testimonials } from "@/data/homePage";

const accentColors = ["#0ea5e9", "#22c55e", "#f97316"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function Testimonials() {
  return (
    <section className="bg-linear-to-b from-white via-[#f8fcff] to-white px-4 py-18 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#195585]">
              <Sparkles className="h-4 w-4" />
              Customer stories
            </p>
            <h2 className="mt-4 text-[34px] font-extrabold leading-tight text-[#07162d] md:text-[44px]">
              What Our Clients Say
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] font-semibold leading-7 text-[#667085]">
              Real journeys from customers who compared offers, understood the
              documentation clearly, and completed their next financial step
              with guided support.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dbe8f2] bg-white px-5 py-4 shadow-[0_12px_28px_rgba(25,85,133,0.06)]">
            <div className="flex items-center gap-2 text-[#f79009]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-[13px] font-extrabold text-[#07162d]">
              Trusted assisted experience
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => {
            const accent = accentColors[index % accentColors.length];
            return (
              <article
                key={item.name}
                className="relative overflow-hidden rounded-2xl border border-[#e4edf5] bg-white p-6 shadow-[0_14px_34px_rgba(25,85,133,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(25,85,133,0.11)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: accent }}
                />
                <Quote className="absolute right-5 top-6 h-9 w-9 text-[#e8f1f8]" />

                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[18px] font-extrabold text-white shadow-[0_12px_24px_rgba(16,24,40,0.08)]"
                    style={{ backgroundColor: accent }}
                  >
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-extrabold text-[#07162d]">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#667085]">
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-1 text-[#f79009]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="mt-5 min-h-28 text-[15px] font-semibold leading-7 text-[#475467]">
                  “{item.text}”
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#edf2f7] pt-4">
                  <span className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#195585]">
                    <ShieldCheck className="h-4 w-4 text-[#12b76a]" />
                    Verified customer
                  </span>
                  <span className="text-[12px] font-semibold text-[#98a2b3]">
                    Fintaraa support
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
