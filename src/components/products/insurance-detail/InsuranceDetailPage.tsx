"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  ChevronDown,
  CircleCheck,
  HeartPulse,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";
import { productSections, testimonials } from "@/data/homePage";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { productHref } from "@/lib/productRouting";
import type {
  InsuranceSeoFormField,
  InsuranceSeoPageData,
} from "@/services/insuranceSeoPages";

const fieldClass =
  "h-8 w-full border-0 border-b border-[#d6dce5] bg-transparent px-1 text-[12px] font-semibold text-[#111827] outline-none placeholder:text-[#8b95a3] focus:border-[#005ca8]";

const planRows = [
  ["HDFC ERGO", "/assets/banks/hdfc.png", "₹450 - ₹1200", "Up to 2%", "₹10 Lac", "60 Years"],
  ["ICICI Lombard", "/assets/banks/icici.png", "₹520 - ₹1500", "Up to 2.5%", "₹25 Lac", "65 Years"],
  ["PNB MetLife", "/assets/banks/pnb.png", "₹430 - ₹1000", "Up to 1.5%", "₹50 Lac", "70 Years"],
  ["Kotak", "/assets/banks/kotak.png", "₹480 - ₹1300", "Up to 2%", "₹20 Lac", "65 Years"],
  ["Tata Capital", "/assets/banks/indian.png", "₹500 - ₹1600", "Up to 2%", "₹1 Cr", "70 Years"],
];

const stats = [
  ["₹24,00,000+", "Cover Available"],
  ["30+", "Insurer Partners"],
  ["800+", "Claim Assist Cases"],
  ["Get Instant Expert", "Assistance"],
];

const claimSteps = [
  ["Notify Us", "Inform the team with policy and event details."],
  ["Submit Docs", "Upload required documents and claim forms."],
  ["Verification", "Our team helps coordinate document checks."],
  ["Settlement", "Track claim progress until closure."],
];

const defaultFaqs = [
  "How long does it take for the claim to be settled?",
  "Is there a penalty for cancelling the policy?",
  "Can I renew my insurance while the first policy is active?",
  "What is the minimum and maximum cover amount?",
  "Do I need to provide documents before buying?",
  "Will checking eligibility affect my profile?",
  "Can I change my nominee after the policy is issued?",
  "What happens if I miss a premium payment?",
];

function DynamicField({ field }: { field: InsuranceSeoFormField }) {
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

export function InsuranceDetailPage({ page }: { page: InsuranceSeoPageData }) {
  const tabs = (page.tabs || [])
    .filter((tab) => tab.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const coverage = tabs[0];
  const eligibility = tabs.find((tab) => tab.key === "eligibility") || tabs[1];
  const documents = tabs.find((tab) => tab.key === "documents") || tabs[2];
  const fields = (page.formFields || [])
    .filter((field) => field.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 4);
  const otherProducts = productSections[0]?.products.slice(0, 3) || [];
  const faqs = tabs.flatMap((tab) => tab.faqs || []);

  return (
    <main className="bg-white text-[#111827]">
      <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-6 hidden h-24 w-24 rotate-45 bg-[#d7ecff] md:block" />
        <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-[1fr_23rem] md:items-center">
          <div>
            <h1 className="text-[34px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[44px]">
              {page.insuranceType}
              <span className="block text-[#111827]">Compare Plans</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[14px] font-semibold leading-6 text-[#333b47]">
              {page.heroDescription || page.subtitle}
            </p>
            <Link
              href={`/login?product=${page.insuranceTypeSlug}`}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#13a653] px-6 text-[13px] font-extrabold text-white no-underline"
            >
              Apply Health Insurance
            </Link>
          </div>

          <div className="border-r-8 border-b-8 border-[#005ca8] bg-white p-5 shadow-[0_10px_26px_rgba(0,92,168,0.12)]">
            <h2 className="text-[16px] font-black text-[#111827]">
              Premium Calculator
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-[#596272]">
              Get an indicative premium range.
            </p>
            <form className="mt-4 grid gap-3" onSubmit={(event) => event.preventDefault()}>
              {fields.map((field) => (
                <label key={field.key} className="grid gap-1">
                  <span className="text-[11px] font-bold text-[#374151]">
                    {field.label}
                  </span>
                  <DynamicField field={field} />
                </label>
              ))}
              <div>
                <span className="text-[11px] font-bold text-[#374151]">
                  Estimated premium
                </span>
                <p className="mt-1 text-[24px] font-black text-[#005ca8]">
                  ₹12,450
                </p>
              </div>
              <Link
                href={`/login?product=${page.insuranceTypeSlug}`}
                className="inline-flex h-9 items-center justify-center rounded-full border border-[#13a653] px-4 text-[12px] font-extrabold text-[#13a653] no-underline"
              >
                Compare Plans
              </Link>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#005ca8] px-4 py-4 text-white md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(([value, label], index) => (
            <div
              key={label}
              className={`flex items-center gap-3 ${index > 0 ? "md:border-l md:border-white/50 md:pl-6" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#005ca8]">
                {index === 3 ? <Zap className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
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

      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl text-center">
          <h2 className="text-[24px] font-black text-[#111827]">
            Compare Top {page.insuranceType} Plans
          </h2>
          <p className="mt-2 text-[12px] font-semibold text-[#667085]">
            Compare plan information and continue with guided assistance.
          </p>
          <div className="mt-6 overflow-x-auto rounded-lg border border-[#e5eaf0] text-left">
            <table className="w-full min-w-180 border-collapse bg-white text-[12px]">
              <thead className="bg-[#f2f5f8]">
                <tr>
                  {["Insurer", "Annual Premium", "Processing Fee", "Max Cover", "Max Tenure", "Action"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-black">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planRows.map(([name, logo, premium, fee, cover, tenure]) => (
                  <tr key={name} className="border-t border-[#edf2f7]">
                    <td className="px-4 py-3">
                      <Image
                        src={logo}
                        alt={name}
                        width={82}
                        height={26}
                        className="object-contain"
                        style={{ width: "88px", height: "auto" }}
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold">{premium}</td>
                    <td className="px-4 py-3 font-semibold">{fee}</td>
                    <td className="px-4 py-3 font-semibold">{cover}</td>
                    <td className="px-4 py-3 font-semibold">{tenure}</td>
                    <td className="px-4 py-3">
                      <Link href={`/login?product=${page.insuranceTypeSlug}`} className="rounded-full bg-[#13a653] px-3 py-1.5 text-[11px] font-black text-white no-underline">
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
        <div className="mx-auto max-w-9xl">
          <h2 className="text-center text-[24px] font-black text-[#111827]">
            Understanding your coverage
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="border border-[#e5eaf0] bg-white p-6">
              <h3 className="text-[16px] font-black">What&apos;s Covered</h3>
              <ul className="mt-4 grid gap-3 text-[13px] font-semibold leading-6 text-[#344054]">
                {(coverage?.covered || []).map((item) => (
                  <li key={item}>
                    <strong>{item.split(" ")[0]}</strong> {item.split(" ").slice(1).join(" ")}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f5f5f5] p-6">
              <h3 className="text-[16px] font-black">What&apos;s Not Covered</h3>
              <ul className="mt-4 grid gap-3 text-[13px] font-semibold leading-6 text-[#344054]">
                {(coverage?.notCovered || []).map((item) => (
                  <li key={item}>
                    <strong>{item.split(" ")[0]}</strong> {item.split(" ").slice(1).join(" ")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl text-center">
          <h2 className="text-[22px] font-black">Hassle-Free Claims Process</h2>
          <p className="mt-2 text-[12px] font-semibold text-[#667085]">
            We understand that emergencies are stressful. Our digital claim process is built for speed.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {claimSteps.map(([title, text], index) => (
              <div key={title} className="relative">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#005ca8] text-white">
                  {index === 3 ? <Zap className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </span>
                <p className="mt-3 text-[13px] font-black">{title}</p>
                <p className="mt-1 text-[11px] font-semibold leading-5 text-[#667085]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#dff0ff] px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-6 md:grid-cols-2">
          <div className="rounded bg-white p-6">
            <h2 className="text-[18px] font-black">Eligibility Criteria</h2>
            <div className="mt-4 grid gap-2">
              {(eligibility?.bullets || []).map((item) => (
                <div key={item} className="bg-[#f2f7fc] px-4 py-3 text-[12px] font-bold text-[#344054]">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded bg-white p-6">
            <h2 className="text-[18px] font-black">Required Documents</h2>
            <div className="mt-4 grid gap-2">
              {(documents?.bullets || []).map((item) => (
                <details key={item} className="border-b border-[#edf2f7] py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-black text-[#005ca8]">
                    {item}
                    <ChevronDown className="h-4 w-4" />
                  </summary>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[18px] font-black">Explore Other Products</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {otherProducts.map(({ title, icon: Icon }) => (
              <Link key={title} href={productHref(title)} className="border border-[#dfe7f1] bg-white p-6 no-underline">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe8f1] text-[#f11275]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-4 block text-[14px] font-black text-[#111827]">
                  {title}
                </span>
                <span className="mt-8 block text-[12px] font-black text-[#005ca8]">
                  Learn More
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-[26px] font-black">Frequently Asked Questions</h2>
          <p className="mt-2 text-[12px] font-semibold text-[#667085]">
            Everything you need to know about our insurance plans.
          </p>
          <div className="mt-8 grid gap-3 text-left">
            {(faqs.length ? faqs : defaultFaqs.map((question) => ({ question, answer: "Our team will help you verify the latest insurer-specific requirement during enquiry." }))).map((faq) => (
              <details key={faq.question} className="rounded-lg border border-[#e5eaf0] bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-black">
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
          <h2 className="text-[22px] font-black">What Our Clients Say</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[28px] border border-dashed border-[#005ca8] p-6 text-left">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-black">{item.name}</span>
                    <span className="text-[11px] font-semibold text-[#667085]">{item.role}</span>
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

      <section className="px-4 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-8 bg-[#edf6ff] p-8 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div>
            <h2 className="text-[24px] font-black text-[#005ca8]">
              Your Journey to
              <span className="block text-[#111827]">Financial Protection</span>
            </h2>
            <p className="mt-3 text-[13px] font-semibold leading-6 text-[#344054]">
              Compare, choose, and continue your insurance enquiry through a guided digital flow.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Check Premium", "Choose Plan", "Fill Personal Details", "Upload Documents", "Review Selection", "Policy Issuance"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-[12px] font-black text-[#005ca8]">
                  <CircleCheck className="h-4 w-4" />
                  {item}
                </span>
              ))}
            </div>
            <Link href={`/login?product=${page.insuranceTypeSlug}`} className="mt-6 inline-flex h-10 items-center justify-center bg-[#005ca8] px-5 text-[12px] font-black text-white no-underline">
              Start Your Application Now
            </Link>
          </div>
          <div className="rounded bg-white p-5 shadow-[0_18px_40px_rgba(0,92,168,0.12)]">
            <div className="mb-4 flex items-center gap-2 text-[12px] font-black text-[#005ca8]">
              <HeartPulse className="h-5 w-5" />
              Medical Details
            </div>
            <div className="grid gap-3">
              <div className="h-12 rounded bg-[#f1f5f9]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 rounded bg-[#f1f5f9]" />
                <div className="h-16 rounded bg-[#f1f5f9]" />
              </div>
              <div className="h-10 rounded bg-[#005ca8]" />
            </div>
          </div>
        </div>
      </section>

      <AppDownloadBanner />
    </main>
  );
}
