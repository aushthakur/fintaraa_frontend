"use client";
import Link from "next/link";
import Image from "next/image";
import { productSections } from "@/data/homePage";
import { productHref } from "@/lib/productRouting";

// Soft, clean color palette configurations mirroring the design circles
const toneClass: Record<string, string> = {
  amber: "bg-[#fff3df] text-[#f79009]",
  blue: "bg-[#e4f4ff] text-[#195585]",
  brown: "bg-[#fff3e5] text-[#a36a19]",
  gold: "bg-[#fff3c6] text-[#d4a42f]",
  green: "bg-[#dff7e8] text-[#2a9f55]",
  orange: "bg-[#fff4eb] text-[#f28c28]",
  pink: "bg-[#ffe4f2] text-[#f1129d]",
  red: "bg-[#ffe1e4] text-[#ef1010]",
  sky: "bg-[#dff0ff] text-[#1b76a6]",
};

type ProductExplorerProps = {
  sectionTitles?: string[];
  compactSpacing?: boolean;
};

export function ProductExplorer({
  sectionTitles,
  compactSpacing = false,
}: ProductExplorerProps) {
  // Filters data cleanly matching your designated calling sequence arrays
  const visibleSections = sectionTitles?.length
    ? productSections.filter((section) => sectionTitles.includes(section.title))
    : productSections;

  return (
    <section
      className={`px-4 sm:px-6 lg:px-8 bg-white ${
        compactSpacing ? "py-4" : "pt-2 pb-6"
      }`}
    >
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col">
          {visibleSections.map((section) => (
            <div key={section.title}>
              
              {/* Row Header Grid: Merged title and subtitle text on the left, View All link on the right */}
              <div className="mb-6 flex items-center justify-between pb-1">
                <div className="text-[22px] font-bold tracking-tight text-[#0b192c] md:text-[24px]">
                  <h2>
                    {section.title}
                    {section.subtitle && (
                      <span> ({section.subtitle})</span>
                    )}
                  </h2>
                </div>
                
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-[14px] font-bold text-[#22c55e] no-underline transition-colors hover:text-[#16a34a] shrink-0"
                >
                  {section.cta || "View All"}
                  <span className="text-[15px] font-light">→</span>
                </Link>
              </div>

              {/* Grid System: Sized and proportioned perfectly to resemble the screenshot */}
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
                {section.products.map((product, index) => {
                  const { title, icon: Icon, logo, tone, tag } = product as any;
                  // Checks specifically if the card is the first item within Instant Loans row
                  const hasCashbackBadge = tag || (index === 0 && section.title.includes("Get Instant Loan"));

                  return (
                    <Link
                      href={productHref(title)}
                      key={title}
                      className="group relative flex flex-col items-center justify-center rounded-3xl border border-gray-200/70 bg-white px-4 pb-8 pt-10 text-center no-underline transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.02)]"
                    >
                      {/* Top Absolute Cashback Offers Badge Layout */}
                      {hasCashbackBadge && (
                        <div className="absolute top-0 left-0 right-0 rounded-t-[23px] bg-[#dff0ff] py-1.5 text-center text-[10px] font-bold text-[#1b76a6] tracking-wide">
                          {tag || "Cashback Offers"}
                        </div>
                      )}

                      {/* Icon or Logo Circle Wrapper Frame */}
                      {logo ? (
                        <div
                          className={`flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                            toneClass[tone] || "bg-[#fff2ec] text-[#ff7643]"
                          }`}
                        >
                          <Image
                            src={logo}
                            alt={title}
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                            toneClass[tone] || "bg-[#fff2ec] text-[#ff7643]"
                          }`}
                        >
                          <Icon className="h-9 w-9 stroke-[1.8]" />
                        </div>
                      )}

                      {/* Explicitly Bolded Bank/Product Title Copy */}
                      <h3 className="mt-5 text-[14px] font-bold tracking-tight text-[#0f172a]">
                        {title}
                      </h3>
                    </Link>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}