"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { CreditCardRecommendation } from "./CreditCardsHero";

const categoryOptions = [
  "Cashback",
  "Travel",
  "Fuel",
  "Rewards",
  "Lifetime Free",
  "Beginners",
  "Self-Employed",
  "Super-Premium",
];

const initialForm = {
  fullName: "",
  mobile: "",
  email: "",
  employmentType: "",
  monthlyIncome: "",
  preferredCategory: "",
  creditScore: "",
};

const fieldClass =
  "h-11 w-full rounded-lg border border-[#e2eaf2] bg-[#fafcfe] px-4 text-[13px] font-semibold text-[#2d3142] outline-none transition-colors placeholder:text-[#b0bac9] focus:border-[#4c1d95] focus:bg-white focus:ring-2 focus:ring-[#e5f2ff]";

const formatIncome = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
};

export function CreditEligibility({
  onOffersRequested,
  onCategorySelect,
}: {
  onOffersRequested: (value: CreditCardRecommendation) => void;
  onCategorySelect: (category: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSubmitted(false);
  };

  const validateStep = () => {
    if (step === 1) {
      if (form.fullName.trim().length < 3) {
        return "Please enter your full name.";
      }
      if (!/^[6-9]\d{9}$/.test(form.mobile)) {
        return "Please enter a valid 10-digit Indian mobile number.";
      }
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        return "Please enter a valid email address.";
      }
    }
    if (step === 2) {
      const income = Number(form.monthlyIncome.replace(/\D/g, ""));
      if (!form.employmentType) return "Please select your employment type.";
      if (!Number.isFinite(income) || income < 10000) {
        return "Please enter a monthly income of ₹10,000 or more.";
      }
    }
    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }

    const recommendation: CreditCardRecommendation = {
      fullName: form.fullName.trim().replace(/\s+/g, " "),
      mobile: form.mobile,
      monthlyIncome: Number(form.monthlyIncome.replace(/\D/g, "")),
      employmentType: form.employmentType,
      creditScore: form.creditScore ? Number(form.creditScore) : undefined,
      preferredCategory: form.preferredCategory || undefined,
    };
    if (form.preferredCategory) onCategorySelect(form.preferredCategory);
    onOffersRequested(recommendation);
    setSubmitted(true);
  };

  return (
    <section className="relative bg-[#fafbfe] px-4 py-12 font-sans md:px-8 lg:px-16">
      <div className="absolute left-0 top-0 -z-10 h-32 w-32 rounded-br-full bg-[#e3effc] opacity-60" />
      <div className="absolute left-0 top-12 -z-10 h-16 w-16 rounded-br-full bg-[#d2e5f9] opacity-40" />

      <div className="mx-auto grid max-w-9xl gap-10 pt-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="flex h-full flex-col justify-between">
          <div>
            <h2 className="text-[30px] font-bold leading-[1.16] text-[#4c1d95] md:text-[38px]">
              Check your <br />
              <span className="text-[#05437a]">credit card eligibility</span>
            </h2>
            <p className="mt-3 max-w-md text-[14px] font-medium text-[#7c8b9e] md:text-[15px]">
              Complete four quick steps to see cards matched to your profile.
            </p>

            <div className="mt-8 space-y-4">
              {[
                [
                  "No impact on your CIBIL score",
                  "We use an indicative soft check only",
                ],
                [
                  "Personalised results",
                  "Matched with your income and profile",
                ],
                [
                  "Compare top benefits",
                  "Review fees, rewards and eligibility",
                ],
              ].map(([title, text]) => (
                <div key={title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#4c1d95] text-[#4c1d95]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#2d3142]">
                      {title}
                    </h3>
                    <p className="text-[12px] font-medium text-[#8c9ba5]">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ms-auto mt-8 hidden justify-center md:flex lg:justify-end lg:pl-6">
            <Image
              src="/assets/images/eligibility-illustration1.png"
              alt="Credit card eligibility"
              width={340}
              height={220}
              className="h-auto w-auto object-contain"
            />
          </div>

          <div className="mb-6 mt-10 max-w-xl border border-[#e2eaf2] bg-white p-4">
            <div className="grid grid-cols-1 items-center gap-4 text-[12px] sm:grid-cols-3">
              {[
                [ShieldCheck, "Secure data", "Bank-level protection"],
                [Star, "Trusted platform", "10 Lakh+ users"],
                [Building2, "Top banks", "Multiple card choices"],
              ].map(([Icon, title, text], index) => {
                const ItemIcon = Icon as typeof ShieldCheck;
                return (
                  <div
                    key={String(title)}
                    className={`flex items-center gap-2.5 ${
                      index === 1
                        ? "border-y border-[#e9eff5] py-3 sm:border-x sm:border-y-0 sm:px-3 sm:py-0"
                        : ""
                    }`}
                  >
                    <ItemIcon className="h-5 w-5 shrink-0 text-[#4c1d95]" />
                    <div>
                      <div className="font-bold text-[#2d3142]">
                        {String(title)}
                      </div>
                      <div className="text-[10px] text-[#9ca7b6]">
                        {String(text)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-6 w-full max-w-lg justify-self-center pb-5 pr-5 lg:mt-0 lg:justify-self-end">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-2xl bg-[#4c1d95]" />
          <div className="relative z-10 min-h-125 rounded-2xl border border-[#e8eff6] bg-white p-6 shadow-[0_14px_36px_rgba(0,82,156,0.12)] sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              {[1, 2, 3, 4].map((item, index) => (
                <div
                  key={item}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <motion.span
                    animate={{
                      backgroundColor: item <= step ? "#4c1d95" : "#e1f0ff",
                      scale: item === step ? 1.08 : 1,
                    }}
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold ${
                      item <= step ? "text-white" : "text-[#75a9d7]"
                    }`}
                  >
                    {item < step ? <Check className="h-4 w-4" /> : item}
                  </motion.span>
                  {index < 3 ? (
                    <span className="relative h-0.75 flex-1 bg-[#e1f0ff]">
                      <motion.span
                        initial={false}
                        animate={{ width: item < step ? "100%" : "0%" }}
                        className="absolute inset-y-0 left-0 bg-[#4c1d95]"
                      />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="min-h-77"
                >
                  {step === 1 ? (
                    <div className="space-y-4">
                      <StepHeading
                        title="Basic Details"
                        subtitle="Start with your contact information"
                      />
                      <Field label="Full Name (as per PAN)">
                        <input
                          name="eligibilityFullName"
                          value={form.fullName}
                          onChange={(event) =>
                            updateField("fullName", event.target.value)
                          }
                          autoComplete="name"
                          placeholder="Enter full name"
                          className={fieldClass}
                        />
                      </Field>
                      <Field label="Mobile Number">
                        <div className="flex h-11 overflow-hidden rounded-lg border border-[#e2eaf2] bg-[#fafcfe] focus-within:border-[#4c1d95] focus-within:ring-2 focus-within:ring-[#e5f2ff]">
                          <span className="flex items-center border-r border-[#e2eaf2] bg-[#eef5fc] px-4 text-[13px] font-bold text-[#4c1d95]">
                            +91
                          </span>
                          <input
                            name="eligibilityMobile"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={form.mobile}
                            onChange={(event) =>
                              updateField(
                                "mobile",
                                event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10),
                              )
                            }
                            autoComplete="tel"
                            placeholder="10-digit mobile number"
                            className="min-w-0 flex-1 bg-transparent px-4 text-[13px] font-semibold outline-none placeholder:text-[#b0bac9]"
                          />
                        </div>
                      </Field>
                      <Field label="Email Address (optional)">
                        <input
                          name="eligibilityEmail"
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            updateField("email", event.target.value)
                          }
                          autoComplete="email"
                          placeholder="Enter email ID"
                          className={fieldClass}
                        />
                      </Field>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="space-y-4">
                      <StepHeading
                        title="Income Profile"
                        subtitle="Used only to match minimum eligibility"
                      />
                      <Field label="Employment Type">
                        <select
                          name="eligibilityEmployment"
                          value={form.employmentType}
                          onChange={(event) =>
                            updateField("employmentType", event.target.value)
                          }
                          className={fieldClass}
                        >
                          <option value="">Select employment</option>
                          <option value="salaried">Salaried</option>
                          <option value="self-employed">Self-employed</option>
                          <option value="business-owner">Business owner</option>
                          <option value="student">Student</option>
                        </select>
                      </Field>
                      <Field label="Monthly Income">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#4c1d95]">
                            ₹
                          </span>
                          <input
                            name="eligibilityIncome"
                            inputMode="numeric"
                            value={form.monthlyIncome}
                            onChange={(event) =>
                              updateField(
                                "monthlyIncome",
                                formatIncome(event.target.value),
                              )
                            }
                            placeholder="e.g. 50,000"
                            className={`${fieldClass} pl-9`}
                          />
                        </div>
                      </Field>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="space-y-4">
                      <StepHeading
                        title="Card Preference"
                        subtitle="Optional details for a more relevant match"
                      />
                      <Field label="Preferred Category">
                        <select
                          name="eligibilityCategory"
                          value={form.preferredCategory}
                          onChange={(event) =>
                            updateField("preferredCategory", event.target.value)
                          }
                          className={fieldClass}
                        >
                          <option value="">Show all suitable categories</option>
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Credit Score">
                        <select
                          name="eligibilityCreditScore"
                          value={form.creditScore}
                          onChange={(event) =>
                            updateField("creditScore", event.target.value)
                          }
                          className={fieldClass}
                        >
                          <option value="">I&apos;m not sure</option>
                          <option value="650">650 - 699</option>
                          <option value="700">700 - 749</option>
                          <option value="750">750 - 799</option>
                          <option value="800">800+</option>
                        </select>
                      </Field>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div>
                      <StepHeading
                        title="Review Details"
                        subtitle="Confirm the profile used for matching"
                      />
                      <dl className="mt-5 grid grid-cols-2 gap-3">
                        {[
                          ["Applicant", form.fullName],
                          ["Mobile", `+91 ${form.mobile}`],
                          [
                            "Employment",
                            form.employmentType.replace(/-/g, " "),
                          ],
                          ["Monthly income", `₹${form.monthlyIncome}`],
                          [
                            "Category",
                            form.preferredCategory || "All suitable",
                          ],
                          ["Credit score", form.creditScore || "Not sure"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-xl bg-[#f6f9fc] p-3"
                          >
                            <dt className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#8a98aa]">
                              {label}
                            </dt>
                            <dd className="mt-1 truncate text-[12px] font-extrabold capitalize text-[#24384a]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      {submitted ? (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          role="status"
                          className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[11px] font-bold text-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          Your matched cards are ready below.
                        </motion.p>
                      ) : null}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {error ? (
                <p
                  role="alert"
                  className="mb-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStep((current) => current - 1);
                      setError("");
                    }}
                    className="h-11 flex-1 rounded-full border border-[#cdddeb] bg-white text-[13px] font-bold text-[#526b80] hover:bg-[#f7faff]"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-5 text-[13px] font-bold text-white shadow-sm transition hover:brightness-105"
                >
                  {step === 4 ? "Show Eligible Cards" : "Continue"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#9ca7b6]">
                <Lock className="h-3 w-3" />
                Your information is safe and encrypted
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h3 className="inline-block border-b-2 border-[#4c1d95] pb-1 text-[20px] font-bold text-[#1a1d24]">
        {title}
      </h3>
      <p className="mt-2 text-[12px] font-medium text-[#7c8b9e]">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold text-[#2d3142]">{label}</span>
      {children}
    </label>
  );
}
