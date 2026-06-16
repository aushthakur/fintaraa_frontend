"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Banknote,
  BadgeIndianRupee,
  ChevronDown,
  CircleCheck,
  FileCheck2,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { productSections, testimonials } from "@/data/homePage";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { productHref, slugifyProduct } from "@/lib/productRouting";
import type { LoanSeoPageData, LoanSeoFormField } from "@/services/loanSeoPages";

const loanStats = [
  ["24-Hours", "Processing Time"],
  ["30+", "Bank & NBFC Partners"],
  ["100%", "Digital Assistance"],
  ["₹50,00,000", "Maximum Loan Amount"],
];

const bankRows = [
  {
    name: "HDFC Bank",
    logo: "/assets/banks/hdfc.png",
    rate: "10.75% p.a.",
    fee: "Up to 2%",
    amount: "₹40 Lac",
    tenure: "6 Years",
  },
  {
    name: "ICICI Bank",
    logo: "/assets/banks/icici.png",
    rate: "10.99% p.a.",
    fee: "Up to 2.5%",
    amount: "₹50 Lac",
    tenure: "6 Years",
  },
  {
    name: "PNB",
    logo: "/assets/banks/pnb.png",
    rate: "11.25% p.a.",
    fee: "Up to 1%",
    amount: "₹20 Lac",
    tenure: "5 Years",
  },
  {
    name: "SBI",
    logo: "/assets/banks/sbi.png",
    rate: "11.45% p.a.",
    fee: "Up to 1.5%",
    amount: "₹30 Lac",
    tenure: "6 Years",
  },
  {
    name: "Kotak",
    logo: "/assets/banks/kotak.png",
    rate: "11.99% p.a.",
    fee: "Up to 2%",
    amount: "₹35 Lac",
    tenure: "5 Years",
  },
];

const verificationSteps = [
  ["Step 01", "Tell Us Your Requirement"],
  ["Step 02", "Verify Mobile Number"],
  ["Step 03", "Complete KYC Details"],
  ["Step 04", "Get Partner Assistance"],
];

const fieldClass =
  "h-9 w-full rounded border border-[#d6dce5] bg-white px-3 text-[12px] font-semibold text-[#1f2937] outline-none placeholder:text-[#98a2b3] focus:border-[#0b64a8]";

const iconPool = [
  BadgeIndianRupee,
  ShieldCheck,
  FileCheck2,
  Banknote,
  WalletCards,
  CircleCheck,
];

function DynamicField({ field }: { field: LoanSeoFormField }) {
  if (field.type === "select") {
    return (
      <select required={field.required} className={fieldClass} defaultValue="">
        <option value="" disabled>
          {field.placeholder || field.label}
        </option>
        {(field.options || []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      required={field.required}
      type={field.type || "text"}
      placeholder={field.placeholder || field.label}
      className={fieldClass}
    />
  );
}

const defaultFaqs = [
  "How long does it take for the loan to be disbursed?",
  "Is there a penalty for prepaying the loan?",
  "Can I apply for a second loan while the first is active?",
  "What is the minimum and maximum loan amount?",
  "Do I need to provide any collateral or security?",
  "Will checking my eligibility affect my CIBIL score?",
  "Can I change my EMI date after the loan is disbursed?",
  "What happens if I miss an EMI payment?",
];

export function LoanDetailPage({ page }: { page: LoanSeoPageData }) {
  const tabs = useMemo(
    () =>
      (page.tabs || [])
        .filter((tab) => tab.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [page.tabs],
  );
  const fields = useMemo(
    () =>
      (page.formFields || [])
        .filter((field) => field.isActive !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .slice(0, 5),
    [page.formFields],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "overview");
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const featureItems = (
    active?.bullets?.length ? active.bullets : tabs.flatMap((tab) => tab.bullets || [])
  ).slice(0, 6);
  const faqs = tabs.flatMap((tab) => tab.faqs || []);
  const otherProducts = productSections[0]?.products.slice(0, 6) || [];

  return (
    <main className="bg-white text-[#1f2329]">
      <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-6 hidden h-24 w-24 rotate-45 bg-[#d7ecff] md:block" />
        <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-[1fr_23rem] md:items-center">
          <div className="relative z-10">
            <h1 className="text-[32px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[42px]">
              {page.loanType} -
              <span className="block text-[#111827]">
                Apply online / Low Interest Rates/ Quick Approval
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-[14px] font-semibold leading-6 text-[#333b47]">
              {page.heroDescription || page.subtitle}
            </p>
            <Link
              href={`/login?product=${page.loanTypeSlug}`}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#13a653] px-6 text-[13px] font-extrabold text-white no-underline"
            >
              Apply Online Now
            </Link>
          </div>

          <div className="border-r-8 border-b-8 border-[#005ca8] bg-white p-5 shadow-[0_10px_26px_rgba(0,92,168,0.12)]">
            <h2 className="text-[16px] font-black text-[#111827]">
              Eligibility Checker
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-[#596272]">
              Find suitable partner options with basic details.
            </p>
            <form
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1"
              onSubmit={(event) => event.preventDefault()}
            >
              {fields.map((field) => (
                <label key={field.key} className="grid gap-1">
                  <span className="text-[11px] font-bold text-[#374151]">
                    {field.label}
                  </span>
                  <DynamicField field={field} />
                </label>
              ))}
              <Link
                href={`/login?product=${page.loanTypeSlug}`}
                className="inline-flex h-9 items-center justify-center rounded-full bg-[#13a653] px-4 text-[12px] font-extrabold text-white no-underline"
              >
                Check Eligibility
              </Link>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#005ca8] px-4 py-4 text-white md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl grid-cols-2 gap-3 md:grid-cols-4">
          {loanStats.map(([value, label], index) => (
            <div
              key={label}
              className={`flex items-center gap-3 ${index > 0 ? "md:border-l md:border-white/50 md:pl-6" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#005ca8]">
                <Banknote className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[13px] font-black">{value}</span>
                <span className="text-[11px] font-semibold text-white/80">
                  {label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-5 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-9xl gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-8 shrink-0 rounded-full px-4 text-[11px] font-extrabold ${active?.key === tab.key
                  ? "bg-[#005ca8] text-white"
                  : "bg-[#edf2f7] text-[#364152]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[22px] font-black text-[#111827]">
            {page.loanType} <span className="text-[#13a653]">Features</span>
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {featureItems.map((item, index) => {
              const Icon = iconPool[index % iconPool.length];
              return (
                <div key={item} className="rounded-md border border-[#e1e7ef] bg-white p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="mt-3 text-[12px] font-bold leading-5 text-[#344054]">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-7">
            <section>
              <h2 className="text-[24px] font-black text-[#111827]">
                <span className="text-[#13a653]">Features & Benefits</span> of our{" "}
                {page.loanType}
              </h2>
              <p className="mt-3 text-[14px] font-semibold leading-7 text-[#2f3744]">
                {active?.description || page.subtitle}
              </p>
              <ul className="mt-3 grid gap-2 text-[13px] font-medium leading-6 text-[#111827]">
                {(active?.bullets || featureItems).map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-[24px] font-black text-[#111827]">
                {page.loanType} <span className="text-[#13a653]">Eligibility Criteria</span>
              </h2>
              <p className="mt-3 text-[14px] font-semibold leading-7 text-[#2f3744]">
                Eligibility depends on profile quality, income, documents, credit
                history, and partner policy.
              </p>
              <ul className="mt-3 grid gap-1 text-[13px] font-medium leading-6 text-[#111827]">
                {[
                  "Age should generally be 21 years or above.",
                  "Stable monthly income or business cash flow is required.",
                  "PAN, Aadhaar, mobile number, and address details should match.",
                  "Credit score and repayment history can influence approval.",
                  "Serviceability may vary by state, city, pincode, and area.",
                ].map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-[24px] font-black text-[#111827]">
                Documents required to apply for{" "}
                <span className="text-[#13a653]">{page.loanType}</span>
              </h2>
              <ul className="mt-3 grid gap-1 text-[13px] font-medium leading-6 text-[#111827]">
                {[
                  "Completed application details with registered mobile number.",
                  "PAN card and Aadhaar or valid identity proof.",
                  "Current address proof and service pincode.",
                  "Recent bank statement and income proof.",
                  "Employment or business proof where applicable.",
                ].map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-[#005ca8] px-4 py-10 text-white md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-[26px] font-black leading-tight">
              Calculate Your
              <span className="block text-[#55e281]">{page.loanType} EMI</span>
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Loan Amount", "Interest Rate", "Loan Tenure", "Processing Fee"].map(
                (label) => (
                  <label key={label} className="rounded bg-white p-3 text-[#111827]">
                    <span className="text-[11px] font-black">{label}</span>
                    <input type="range" className="mt-4 w-full accent-[#005ca8]" />
                  </label>
                ),
              )}
            </div>
          </div>
          <div className="self-end rounded bg-[#e8f4ff] p-6 text-center text-[#111827]">
            <p className="text-[13px] font-bold text-[#344054]">
              Your Monthly EMI Payment
            </p>
            <p className="mt-2 text-[30px] font-black">₹15,668</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-[12px] font-bold">
              <span>Principal Amount</span>
              <span>₹5,00,000</span>
              <span>Interest Amount</span>
              <span>₹64,050</span>
            </div>
            <Link
              href={`/login?product=${page.loanTypeSlug}`}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#13a653] px-6 text-[12px] font-extrabold text-white no-underline"
            >
              Get Instant Loan
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[24px] font-black text-[#111827]">
            Compare Top Banks & NBFCs
          </h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-[#e5eaf0]">
            <table className="w-full min-w-180 border-collapse bg-white text-left text-[12px]">
              <thead className="bg-[#f2f5f8] text-[#111827]">
                <tr>
                  {["Lender", "Interest Rate", "Processing Fee", "Max Amount", "Max Tenure", "Action"].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3 font-black">
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {bankRows.map((row) => (
                  <tr key={row.name} className="border-t border-[#edf2f7]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/banks/${slugifyProduct(row.name)}/${page.loanTypeSlug}`}
                        className="flex items-center gap-2 font-black no-underline"
                      >
                        <Image
                          src={row.logo}
                          alt={row.name}
                          width={74}
                          height={24}
                          className="object-contain"
                          style={{ width: "80px", height: "auto" }}
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-semibold">{row.rate}</td>
                    <td className="px-4 py-3 font-semibold">{row.fee}</td>
                    <td className="px-4 py-3 font-semibold">{row.amount}</td>
                    <td className="px-4 py-3 font-semibold">{row.tenure}</td>
                    <td className="px-4 py-3">
                      <Link href={`/banks/${slugifyProduct(row.name)}/${page.loanTypeSlug}`} className="rounded-full bg-[#13a653] px-3 py-1.5 text-[11px] font-black text-white no-underline">
                        Apply Now
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div>
            <h2 className="text-[24px] font-black text-[#111827]">
              Simple 4-Step verification
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-[#667085]">
              Simple process for faster approval journey.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {verificationSteps.map(([step, title], index) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#e8f4ff] text-[#005ca8]">
                    <FileCheck2 className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-black text-[#005ca8]">
                      {step}
                    </span>
                    <span className="text-[13px] font-black text-[#111827]">
                      {title}
                    </span>
                    <span className="block text-[11px] font-medium text-[#667085]">
                      {index === 0 ? "Start your request online." : "Complete the next required detail."}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <Link
              href={`/login?product=${page.loanTypeSlug}`}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#13a653] px-6 text-[12px] font-extrabold text-white no-underline"
            >
              Get Personal Loan
            </Link>
          </div>
          <div className="relative min-h-70">
            <Image
              src="/assets/refer/header.png"
              alt="Fintaraa verification"
              width={580}
              height={420}
              unoptimized
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-black text-[#111827]">
              Explore Other Products
            </h2>
            <Link href="/products" className="text-[12px] font-black text-[#13a653] no-underline">
              View All
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {otherProducts.map(({ title, icon: Icon }) => (
              <Link
                key={title}
                href={productHref(title)}
                className="rounded-lg border border-[#e5eaf0] bg-white p-5 text-center no-underline"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0e8] text-[#ef6c2f]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-3 block text-[11px] font-black text-[#111827]">
                  {title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdff] px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-[26px] font-black text-[#111827]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[12px] font-semibold text-[#667085]">
            Everything you need to know about our {page.loanType}.
          </p>
          <div className="mt-8 grid gap-3 text-left">
            {(faqs.length ? faqs : defaultFaqs.map((question) => ({ question, answer: "Our team will help you verify the latest lender-specific requirement during application." }))).map((faq) => (
              <details key={faq.question} className="rounded-lg border border-[#e5eaf0] bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-black text-[#111827]">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </summary>
                <p className="mt-3 text-[12px] font-semibold leading-6 text-[#667085]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl text-center">
          <h2 className="text-[22px] font-black text-[#111827]">
            What Our Clients Say
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="border-t border-[#dfe5ec] pt-5 text-left">
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

      <AppDownloadBanner />
    </main>
  );
}
