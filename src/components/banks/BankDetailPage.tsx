"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import type { BankSeoPageData } from "@/services/bankSeoPages";

const productIcons = [BadgeIndianRupee, Banknote, Building2, CreditCard];

export function BankDetailPage({ page }: { page: BankSeoPageData }) {
  const tabs = (page.tabs || [])
    .filter((tab) => tab.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const products = (page.products || [])
    .filter((product) => product.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const rates = (page.interestRates || []).sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  return (
    <main className="bg-white text-[#111827]">
      <section className="relative overflow-hidden px-4 pb-12 pt-10 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
        <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-center">
          <div className="grid gap-8 md:grid-cols-[16rem_1fr] md:items-center">
            <div className="relative z-10">
              {page.logoUrl ? (
                <Image
                  src={page.logoUrl}
                  alt={page.bankName}
                  width={250}
                  height={92}
                  className="h-auto w-62 object-contain object-left"
                />
              ) : null}
            </div>
            <div>
              <div className="flex flex-wrap items-start gap-4">
                <h1 className="max-w-2xl text-[44px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[62px]">
                  {page.bankName} {page.productName}
                </h1>
                {page.trustBadge ? (
                  <span className="mt-2 rounded-full bg-[#e8f4ff] px-5 py-2 text-[12px] font-bold text-[#005ca8]">
                    {page.trustBadge}
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-[20px] font-medium leading-8 text-[#111827]">
                {page.subtitle}
              </p>
            </div>
          </div>

          <div className="flex min-h-64 items-center justify-center bg-[radial-gradient(circle,#eef5ff_0%,#ffffff_68%)] text-[#005ca8]">
            {page.heroImageUrl ? (
              <Image
                src={page.heroImageUrl}
                alt={page.title}
                width={360}
                height={260}
                unoptimized
                className="h-64 w-full object-contain"
              />
            ) : (
              <BadgeIndianRupee className="h-40 w-40" />
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-9xl gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-5 md:grid-cols-4">
            {(page.heroStats || []).map(({ label, value }, index) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#005ca8] text-[#005ca8]">
                  {index === 0 ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : index === 1 ? (
                    <LockKeyhole className="h-6 w-6" />
                  ) : (
                    <Clock3 className="h-6 w-6" />
                  )}
                </span>
                <span>
                  <span className="block text-[15px] font-black text-[#111827]">
                    {label}
                  </span>
                  <span className="text-[12px] font-semibold text-[#9aa0a6]">
                    {value}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-5">
            <Link
              href={`/login?product=${page.productSlug}&bank=${page.bankSlug}`}
              className="inline-flex h-14 w-70 items-center justify-center rounded-full bg-[#13a653] text-[16px] font-black text-white no-underline shadow-[0_8px_18px_rgba(19,166,83,0.25)]"
            >
              Apply Now
            </Link>
            <Link
              href={`/login?product=${page.productSlug}&bank=${page.bankSlug}`}
              className="inline-flex h-14 w-70 items-center justify-center rounded-full border border-[#13a653] bg-white text-[16px] font-black text-[#13a653] no-underline"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#e8f4ff] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-9xl gap-7 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              className={`h-12 min-w-32 shrink-0 rounded-full px-8 text-[15px] font-semibold ${
                index === 0
                  ? "bg-[#005ca8] text-white"
                  : "bg-white text-[#2a2f36]"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.55fr]">
          <div>
            <h2 className="text-[26px] font-black text-[#111827]">
              {page.aboutTitle || `About ${page.bankName}`}
            </h2>
            <p className="mt-5 max-w-3xl text-[15px] font-semibold leading-7 text-[#9aa0a6]">
              {page.aboutDescription}
            </p>
            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              {(page.bankStats || []).map(({ label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
                    <ShieldCheck className="h-8 w-8" />
                  </span>
                  <span>
                    <span className="block text-[16px] font-black">{value}</span>
                    <span className="text-[12px] font-semibold text-[#9aa0a6]">
                      {label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[26px] font-black text-[#111827]">
              Why Apply on Fintaraa?
            </h2>
            <div className="mt-7 grid gap-5">
              {(page.whyApply || []).map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 text-[17px] font-semibold text-[#9aa0a6]"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#005ca8]" />
                  {item}
                </p>
              ))}
              <p className="mt-2 flex items-center gap-3 text-[16px] font-semibold text-[#9aa0a6]">
                <span className="flex -space-x-2">
                  {[0, 1, 2].map((item) => (
                    <span
                      key={item}
                      className="h-10 w-10 rounded-full border-2 border-white bg-[#d7ecff]"
                    />
                  ))}
                </span>
                <strong className="text-[#005ca8]">50,000+</strong>
                Happy Customers
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[26px] font-black text-[#111827]">
            Loans & Products Offered by {page.bankName}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              const Icon = productIcons[index % productIcons.length];
              return (
                <article
                  key={product.title}
                  className="rounded-xl border border-[#d7dfe8] bg-white p-6"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e8f4ff] text-[#005ca8]">
                      <Icon className="h-8 w-8" />
                    </span>
                    <div>
                      <h3 className="text-[17px] font-black text-[#111827]">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-[13px] font-semibold leading-6 text-[#9aa0a6]">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={
                      product.href ||
                      `/login?product=${page.productSlug}&bank=${page.bankSlug}`
                    }
                    className="mt-9 flex items-center justify-end gap-2 text-[14px] font-black text-[#13a653] no-underline"
                  >
                    {product.ctaLabel || "Apply Now"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-18 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-5 rounded-xl border border-[#d7dfe8] bg-white p-8 lg:grid-cols-[1fr_18rem]">
          <div>
            <h2 className="text-[26px] font-black text-[#111827]">
              {page.bankName} {page.productName} Interest Rates
            </h2>
            <div className="mt-6 overflow-x-auto rounded border border-[#d7dfe8]">
              <table className="w-full min-w-180 border-collapse text-left text-[14px]">
                <thead className="bg-white">
                  <tr>
                    {[
                      "Loan Amount",
                      "Interest Rate (p.a.)",
                      "Processing Fee",
                      "Loan Tenure",
                    ].map((heading) => (
                      <th key={heading} className="border-b border-[#d7dfe8] px-4 py-4 text-[17px] font-black">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate, index) => (
                    <tr key={`${rate.loanAmount}-${index}`} className="border-b border-[#e5eaf0] last:border-0">
                      <td className="px-4 py-4 font-semibold text-[#9aa0a6]">
                        {rate.loanAmount}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#9aa0a6]">
                        {rate.interestRate}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#9aa0a6]">
                        {rate.processingFee}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#9aa0a6]">
                        {rate.tenure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <aside className="rounded-xl bg-[#e8f4ff] p-7">
            <h2 className="text-[25px] font-black text-[#111827]">
              Ready to Apply?
            </h2>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#9aa0a6]">
              Get the best loan offer from {page.bankName} in just a few
              minutes.
            </p>
            <div className="mt-6 grid gap-4">
              {(page.applyBullets || []).map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 text-[16px] font-semibold text-[#9aa0a6]"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#005ca8]" />
                  {item}
                </p>
              ))}
            </div>
            <Link
              href={`/login?product=${page.productSlug}&bank=${page.bankSlug}`}
              className="mt-18 flex h-14 items-center justify-center rounded-full bg-[#13a653] text-[16px] font-black text-white no-underline shadow-[0_8px_18px_rgba(19,166,83,0.25)]"
            >
              Apply Now
            </Link>
          </aside>
        </div>
      </section>

      <AppDownloadBanner />
    </main>
  );
}
