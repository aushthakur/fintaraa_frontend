import Link from "next/link";
import { DynamicField } from "./DynamicField";
import type { LoanSeoPageData, LoanSeoFormField } from "@/services/loanSeoPages";

export function LoanHeroSection({
  page,
  fields,
}: {
  page: LoanSeoPageData;
  fields: LoanSeoFormField[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/* Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>
      <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-[1fr_23rem] md:items-center">
       {/* LEFT CONTAINER: HERO COPY */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-[36px] font-bold tracking-tight text-[#005ca8] sm:text-[46px] leading-[1.15]">
            {page.loanType} -
            <span className="block text-[#212529] mt-1 font-bold">
              Apply online / Low Interest Rates/ Quick Approval
            </span>
          </h1>
          
          <p className="max-w-xl text-[15px] font-medium leading-relaxed text-gray-600">
            {page.heroDescription || page.subtitle || "Get instant personal loans with low interest rates, minimal documentation, and fast approval."}
          </p>
          
          <div className="pt-2">
            <Link
              href={`/login?product=${page.loanTypeSlug}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#00b254] px-7 text-sm font-bold text-white transition-colors hover:bg-[#009948] no-underline shadow-sm"
            >
              Apply {page.loanType}
            </Link>
          </div>
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
  );
}