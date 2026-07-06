import { Quote, Star } from "lucide-react";
import { dsaTestimonials } from "./dsaData";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function DsaTestimonials() {
  return (
    <section className="bg-white px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-black uppercase tracking-wide text-[#13a653]">
              Partner Reviews
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#33393f] md:text-[30px]">
              Trusted by DSA partners across India
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {dsaTestimonials.map((item) => (
            <article
              key={item.name}
              className="flex min-h-72 flex-col justify-between rounded-[22px] border border-[#e3eaf3] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.04)]"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf5ff] text-[13px] font-black text-[#0d64bf]">
                      {initials(item.name)}
                    </span>
                    <span>
                      <span className="block text-[14px] font-black text-[#22272e]">
                        {item.name}
                      </span>
                      <span className="text-[12px] font-semibold text-[#7d8794]">
                        {item.role} - {item.location}
                      </span>
                    </span>
                  </div>
                  <Quote className="h-5 w-5 shrink-0 text-[#0d64bf]" />
                </div>

                <div className="mt-4 flex items-center gap-1 text-[#f59e0b]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`${item.name}-${index}`}
                      className={`h-4 w-4 ${
                        index < item.rating
                          ? "fill-current stroke-current"
                          : "stroke-current text-[#fde3a3]"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-[13px] font-semibold leading-6 text-[#52657d]">
                  {item.text}
                </p>
              </div>

              <div className="mt-5 rounded-full bg-[#eaf3ff] px-4 py-2 text-center text-[12px] font-black text-[#0d64bf]">
                {item.metric}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
