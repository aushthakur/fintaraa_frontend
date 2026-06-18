"use client";

import { ShieldCheck } from "lucide-react";
import type { BankSeoPageData } from "@/services/bankSeoPages";
import Image from "next/image";

export function BankAboutSection({ page }: { page: BankSeoPageData }) {
  return (
    <section className="bg-white px-4 py-14 md:px-8 lg:px-16 font-sans antialiased">
      <div className="max-w-9xl grid gap-12 lg:grid-cols-2 ">
        {/* LEFT COLUMN: About the Bank and Numerical Stats */}
        <div className="space-y-8">
          <div>
            <h2 className="text-[24px] font-bold text-[#000000] tracking-tight">
              {page.aboutTitle || `About ${page.bankName}`}
            </h2>
            <p className="mt-4 text-[14px] font-medium leading-[1.6] text-[#9fa3a9] max-w-2xl">
              {page.aboutDescription ||
                `${page.bankName} is India's premier private sector bank known for its customer centric approach, innovative banking solutions and quick loan disbursal process. With a strong network of branches and digital presence, ${page.bankName} offers a wide range of financial products to meet your needs.`}
            </p>
          </div>

          {/* Stats Badge Strip Row */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 pt-4">
            {(page.bankStats && page.bankStats.length > 0
              ? page.bankStats
              : [
                  { label: "Founded", value: "1995" },
                  { label: "Branches", value: "6,500+" },
                  { label: "Presence", value: "1,500+ Cities" },
                ]
            ).map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3.5">
                {/* Modern Soft Blue Shape Border Badge */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eef5ff] text-[#005ca8]">
                  <ShieldCheck className="h-6 w-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="block text-[15px] font-bold text-[#000000] leading-tight">
                    {value}
                  </span>
                  <span className="text-[12px] font-medium text-[#9fa3a9] mt-0.5 block">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Value Proposition & Social Proof Banner */}
        <div className="lg:me-10 ml-auto space-y-6">
          <h2 className="text-[24px] font-bold text-[#000000] tracking-tight">
            Why Apply on Fintaraa?
          </h2>

          {/* Custom Minimalist Check Icon Rows */}
          <div className="space-y-4">
            {(page.whyApply && page.whyApply.length > 0
              ? page.whyApply
              : [
                  "Free & Easy Application",
                  "100% Safe & Secure",
                  "Multiple Loan Offers",
                  "Best Interest Rates",
                ]
            ).map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-[15px] font-medium text-[#90949c]"
              >
                {/* Precise Double Ring Circle Check Graphic matching image_eef248.png */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#005ca8] bg-white text-[#005ca8]">
                  <span className="text-[10px] font-bold">✓</span>
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Overlapping Social Proof Avatars Section */}
          <div className="pt-2 flex items-center gap-4">
            <div className="flex -space-x-3 overflow-hidden isolate py-1">
              {/* Profile Headshots overlapping cleanly like a ratings block */}
              <div className="relative z-30 h-9 w-9 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gray-100">
                <Image
                  src="/assets/images/user1.png"
                  alt="User Profile 1"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="relative z-20 h-9 w-9 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gray-100">
                <Image
                  src="/assets/images/user2.png"
                  alt="User Profile 2"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 h-9 w-9 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gray-100">
                <Image
                  src="/assets/images/user3.png"
                  alt="User Profile 3"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="text-[14px] font-medium">
              <span className="font-bold text-[#005ca8] text-[15px]">
                50,000+
              </span>{" "}
              <span className="text-[#9fa3a9] ml-1">Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
