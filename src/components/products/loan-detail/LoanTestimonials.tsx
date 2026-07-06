import { UserRound } from "lucide-react";
import { testimonials } from "@/data/homePage";

export function LoanTestimonials() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl text-center">
        <h2 className="text-[22px] font-black text-[#111827]">
          What Our Clients Say
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="border-t border-[#dfe5ec] pt-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                  <UserRound className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[13px] font-black text-[#111827]">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#667085]">
                    {item.role}
                  </span>
                </span>
              </div>
              <p className="mt-4 text-[12px] font-medium leading-6 text-[#344054]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
