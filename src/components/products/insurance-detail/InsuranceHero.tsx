"use client";

import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import type {
  InsuranceSeoFormField,
  InsuranceSeoPageData,
} from "@/services/insuranceSeoPages";

const fieldClass =
  "h-12 w-full rounded-xl border border-[#d9dfe8] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#8b95a3] focus:border-[#005ca8] focus:ring-4 focus:ring-[#005ca8]/10";

const coverageOptions = ["5L", "10L", "20L", "30L", "40L", "50L"];

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

export function InsuranceHero({ page }: { page: InsuranceSeoPageData }) {
  const applyHref = getApplyHref({
    category: "insurance",
    productSlug: page.insuranceTypeSlug,
    referrer: page.canonicalPath || `/products/${page.insuranceTypeSlug}`,
  });
  const fields = (page.formFields || [])
    .filter((field) => field.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const ageField =
    fields.find((field) => field.key === "age") ||
    fields.find((field) => field.key === "insuredAge") ||
    fields[0];
  const cityField = fields.find((field) => field.key === "city") || fields[1];

  const coverageField = {
    key: "sumInsured",
    label: "Desired Coverage.",
    type: "number",
    placeholder: "Enter coverage amount",
    required: true,
  } satisfies InsuranceSeoFormField;

  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <div
          className="absolute hidden bg-[#e0effe] md:block"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        <div
          className="absolute hidden bg-[#e0effe] md:block"
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

      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(400px,460px)] lg:items-center">
        <div className="relative z-10 space-y-6">
          <h1 className="max-w-2xl text-[38px] font-black leading-tight tracking-[-0.03em] text-[#111827] md:text-[52px]">
            <span className="text-[#005ca8]">{page.insuranceType}</span>
            <span className="block text-[#111827]">
              Compare Plans / Best Rates / Quick Approval
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[17px] font-medium leading-7 text-[#667085]">
            {page.heroDescription ||
              page.subtitle ||
              "Compare top insurance plans from leading insurers with the best rates and quick approval process."}
          </p>

          <div className="pt-2">
            <AuthRedirectLink
              href={applyHref}
              productSlug={page.insuranceTypeSlug}
              className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-7 text-[14px] font-black text-white no-underline"
            >
              Apply {page.insuranceType}
            </AuthRedirectLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px] lg:mx-0">
          <div className="absolute inset-0 hidden translate-x-3 translate-y-3 rounded-[18px] bg-[#00529c] md:block" />

          <div className="relative rounded-[22px] border border-[#d9dfe8] bg-white p-6 shadow-[0_14px_34px_rgba(0,82,156,0.12)] md:p-7">
            <h2 className="text-[24px] font-black leading-tight tracking-[-0.02em] text-[#222222]">
              Premium Calculator
            </h2>
            <p className="mt-1.5 text-[13px] font-semibold text-[#667085]">
              Get an instant estimate in 30 seconds.
            </p>

            <form
              className="mt-5 grid gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[13px] font-bold text-[#222222]">
                    {ageField?.label || "Age of oldest member"}
                  </span>
                  <DynamicField
                    field={
                      ageField || {
                        key: "age",
                        label: "Age of oldest member",
                        type: "number",
                        required: true,
                      }
                    }
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[13px] font-bold text-[#222222]">
                    {cityField?.label || "City"}
                  </span>
                  <DynamicField
                    field={
                      cityField || {
                        key: "city",
                        label: "City",
                        type: "text",
                        required: true,
                      }
                    }
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[13px] font-bold text-[#222222]">
                  {coverageField.label}
                </span>
                <DynamicField field={coverageField} />
              </label>

              <div className="grid grid-cols-3 gap-1.5 pt-0.5 sm:grid-cols-6">
                {coverageOptions.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    className={`h-10 rounded-xl border px-0 text-[12px] font-bold transition ${
                      index === 0
                        ? "border-[#005ca8] bg-[#005ca8] text-white"
                        : "border-[#005ca8] bg-white text-[#8b95a3]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <span className="text-[13px] font-bold text-[#222222]">
                  Estimated annual premium
                </span>
                <div className="mt-1.5 flex items-end justify-between gap-3">
                  <p className="text-[26px] font-black tracking-[-0.03em] text-[#3556a5] md:text-[30px]">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(12450)}
                  </p>
                  <p className="pb-1 text-[10px] font-medium text-[#98a2b3]">
                    T &amp; C Apply
                  </p>
                </div>
              </div>

              <AuthRedirectLink
                href={applyHref}
                productSlug={page.insuranceTypeSlug}
                className="mt-1 inline-flex h-12 items-center justify-center rounded-full border border-[#12b76a] bg-white px-5 text-[14px] font-extrabold text-[#12b76a] no-underline shadow-[0_10px_24px_rgba(18,183,106,0.14)] transition hover:bg-[#f3fbf6]"
              >
                Compare detailed plans
              </AuthRedirectLink>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
