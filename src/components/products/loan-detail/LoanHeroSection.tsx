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
      <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-[1fr_26rem] md:items-center">
       {/* LEFT CONTAINER: HERO COPY */}
        <div className="relative z-10 space-y-6">
          <h1 className="max-w-2xl text-[38px] font-black leading-tight tracking-[-0.03em] text-[#111827] md:text-[52px]">
            <span className="text-[#005ca8]">{page.loanType}</span>
            <span className="block text-[#111827]">
              Apply online / Low Interest Rates/ Quick Approval
            </span>
          </h1>
          
          <p className="mt-5 max-w-xl text-[17px] font-medium leading-7 text-[#667085]">
            {page.heroDescription || page.subtitle || "Get instant personal loans with low interest rates, minimal documentation, and fast approval."}
          </p>
          
          <div className="pt-2">
            <Link
              href={`/login?product=${page.loanTypeSlug}`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#13a653] px-7 text-[14px] font-black text-white no-underline"
            >
              Apply {page.loanType}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-125.5 md:mx-0">
          <div className="absolute inset-0 block translate-x-2 translate-y-2 rounded-[18px] bg-[#00529c] sm:translate-x-3 sm:translate-y-3" />

          <div className="relative rounded-[18px] border border-[#d9dfe8] bg-white p-6 px-8 shadow-[0_10px_26px_rgba(0,92,168,0.12)]">
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
      </div>
    </section>
  );
}
