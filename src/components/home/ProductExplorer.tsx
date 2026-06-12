import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productSections } from "@/data/homePage";
import { productHref } from "@/lib/productRouting";

const toneClass: Record<string, string> = {
  amber: "bg-[#fff3df] text-[#f79009]",
  blue: "bg-[#e4f4ff] text-[#195585]",
  brown: "bg-[#fff3e5] text-[#a36a19]",
  gold: "bg-[#fff3c6] text-[#d4a42f]",
  green: "bg-[#dff7e8] text-[#2a9f55]",
  olive: "bg-[#fbffd8] text-[#8a941a]",
  orange: "bg-[#fff4eb] text-[#f28c28]",
  pink: "bg-[#ffd5f1] text-[#f1129d]",
  red: "bg-[#ffe1e4] text-[#ef1010]",
  rose: "bg-[#ffd4e5] text-[#bd3b75]",
  sky: "bg-[#dff0ff] text-[#1b76a6]",
  violet: "bg-[#f3e2ff] text-[#c067f2]",
  yellow: "bg-[#fff1bd] text-[#e8b23d]",
};

export function ProductExplorer() {
  return (
    <section className="px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="grid gap-18">
          {productSections.map((section) => (
            <div key={section.title}>
              <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-[28px] font-bold tracking-tight text-[#101828] md:text-[32px]">
                    {section.title}
                  </h2>
                  <p className="text-sm font-medium leading-7 text-[#66758f] md:text-base">
                    {section.subtitle}
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[16px] font-extrabold text-[#08a045] no-underline transition hover:translate-x-1"
                >
                  {section.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
                {section.products.map(({ title, text, icon: Icon, tone }) => (
                  <Link
                    href={productHref(title)}
                    key={title}
                    className="group flex flex-col items-center justify-between rounded-xl bg-white px-2 py-4 text-center no-underline shadow-[0_8px_18px_rgba(16,24,40,0.08)] ring-1 ring-[#eef2f7] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(16,24,40,0.13)] hover:ring-[#d9f6e6]"
                  >
                    <span
                      className={`flex h-14 w-14 mt-3 items-center justify-center rounded-full ${
                        toneClass[tone] || toneClass.blue
                      }`}
                    >
                      <Icon className="h-7 w-7 stroke-2" />
                    </span>
                    <span className="mt-5 block">
                      <span className="text-[16px] line-clamp-1 font-extrabold leading-snug text-[#1d2738]">
                        {title}
                      </span>
                      <span className="mt-5 line-clamp-2 text-[15px] font-medium text-[#2f3137]">
                        {text}
                      </span>
                    </span>
                    <span className="mt-6 flex h-9 w-9 items-center justify-center text-[#08a045] transition group-hover:translate-x-1">
                      <ArrowRight className="h-7 w-7 stroke-[2.6]" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
