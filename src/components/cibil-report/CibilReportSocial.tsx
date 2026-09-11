"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { FaqAccordion } from "@/components/common/FaqAccordion";

const searchLinks = [
  { label: "Personal Loan", href: "/products/personal-loan" },
  { label: "Home Loan", href: "/products/home-loan" },
  { label: "Business Loan", href: "/products/business-loan" },
  { label: "Car Loan", href: "/products/car-loan" },
  { label: "Education Loan", href: "/products/education-loan" },
  { label: "Gold Loan", href: "/products/gold-loan" },
  { label: "Loan Against Property", href: "/products/loan-against-property" },
  { label: "Credit Cards", href: "/credit-cards" },
  { label: "Health Insurance", href: "/products/health-insurance" },
  { label: "Life Insurance", href: "/products/life-insurance" },
  { label: "Check CIBIL Score", href: "/cibil-score" },
  { label: "Offers & Rewards", href: "/offers" },
  { label: "EMI Calculators", href: "/tools" },
  { label: "Application Status", href: "/application-status" },
  { label: "Financial Guides", href: "/blog" },
  { label: "Customer Support", href: "/support" },
];

export function CibilReportSocial() {
  return (
    <>
      <FaqAccordion />
      <MotionConfig reducedMotion="user">
        <section className="border-y border-[#dce9f1] bg-[#f4f9fc] px-4 py-10 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-9xl"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#5b21b6]">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Explore more
                </p>
                <h2 className="mt-3 text-[24px] font-extrabold text-[#3b0764] sm:text-[28px]">
                  Popular financial journeys
                </h2>
              </div>
              <p className="max-w-xl text-[12px] font-medium leading-5 text-[#7890a2]">
                Continue to products, tools and guides available across Fintaraa.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {searchLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-[#cddfe9] bg-white px-3 py-2 text-[11px] font-bold text-[#526e82] no-underline transition-colors hover:border-[#8ebbd3] hover:text-[#5b21b6]"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      </MotionConfig>
    </>
  );
}
