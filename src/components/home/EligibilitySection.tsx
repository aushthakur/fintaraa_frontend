"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  ArrowRight,
  CreditCard,
  BadgeCheck,
  ChevronDown,
  CalendarDays,
  Gauge,
  HandCoins,
  Info,
  IndianRupee,
  LockKeyhole,
  ShieldCheck,
  Star,
  Umbrella,
  UserRound,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";
import { loanProductDirectory } from "@/data/bankDirectory";

const productOptions = [
  { label: "Loan", icon: HandCoins },
  { label: "Insurance", icon: Umbrella },
  { label: "Credit Card", icon: CreditCard },
];

const amountOptions = [
  { label: "₹2 L", value: 200000 },
  { label: "₹5 L", value: 500000 },
  { label: "₹10 L", value: 1000000 },
  { label: "₹20 L", value: 2000000 },
  { label: "₹30 L", value: 3000000 },
];

const stepperItems = [
  { step: "1", title: "Select", text: "Choose product" },
  { step: "2", title: "Amount", text: "Set requirement" },
  { step: "3", title: "Details", text: "Basic information" },
  { step: "4", title: "Offers", text: "Matched results" },
];

const loanTypeOptions = loanProductDirectory.map((loan) => loan.name);
const tenureOptions = Array.from(
  { length: 30 },
  (_, index) => `${index + 1} ${index === 0 ? "Year" : "Years"}`,
);
const salaryOptions = [
  "Salaried",
  "Self Employed",
  "Self Employed Professional",
];
const loanPurposeSlugs = Object.fromEntries(
  loanProductDirectory.map((loan) => [loan.name, loan.slug]),
);

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

const getTenureYears = (value: string) => Number(value.match(/\d+/)?.[0] || 5);

function PremiumSelect({
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  icon: LucideIcon;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <span className="text-[13px] font-semibold text-[#344054]">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`mt-1 flex h-11 w-full items-center gap-3 rounded-xl border bg-white px-3 text-left text-[13px] font-semibold transition ${
          open ? "border-[#5b21b6]" : "border-[#e9d5ff] hover:border-[#5b21b6]"
        }`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#5b21b6]">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[#2f3a4a]">{value}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#667085] transition ${
            open ? "rotate-180 text-[#5b21b6]" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#dce7f3] bg-white p-1">
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-[13px] font-semibold transition ${
                  selected
                    ? "bg-[#ede9fe] text-[#5b21b6]"
                    : "text-[#344054] hover:bg-[#f8fcff] hover:text-[#5b21b6]"
                }`}
              >
                <span>{option}</span>
                {selected ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function EligibilitySection() {
  const [selectedProduct, setSelectedProduct] = useState("Loan");
  const [amount, setAmount] = useState(1000000);
  const [purpose, setPurpose] = useState(loanTypeOptions[0]);
  const [tenure, setTenure] = useState("5 Years");
  const [salaryType, setSalaryType] = useState(salaryOptions[0]);
  const [monthlyIncome, setMonthlyIncome] = useState("50000");
  const [cibilScore, setCibilScore] = useState(720);
  const activeStep = cibilScore ? 3 : amount ? 2 : selectedProduct ? 1 : 0;

  const continueHref = useMemo(() => {
    if (selectedProduct === "Credit Card") return "/credit-cards";
    if (selectedProduct === "Insurance") return "/products";

    const loanType = loanPurposeSlugs[purpose] || "personal-loan";
    const params = new URLSearchParams({
      product: "loan",
      loanType,
      amount: String(amount),
      salaryType,
      monthlyIncome: monthlyIncome || "0",
      cibilScore: String(cibilScore),
      tenureYears: String(getTenureYears(tenure)),
    });

    return `/eligibility-results?${params.toString()}`;
  }, [
    amount,
    cibilScore,
    monthlyIncome,
    purpose,
    salaryType,
    selectedProduct,
    tenure,
  ]);

  const continueLabel =
    selectedProduct === "Loan" ? "Check Offers" : "Continue";

  return (
    <section
      id="eligibility-check"
      className="bg-white px-4 py-12 md:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-9xl overflow-hidden rounded-2xl bg-[#f7fbff] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="relative flex flex-col justify-end overflow-hidden bg-[#ede9fe] px-5 pt-7 sm:px-8 lg:min-h-130 lg:px-10">
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2">
              {["RBI Registered", "ISO 27001 Certified"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#5b21b6]"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {item}
                </span>
              ))}
            </div>
            <h2 className="mt-5 max-w-lg text-[30px] font-bold leading-tight tracking-tight text-[#07162d] sm:text-[40px]">
              Check Your Eligibility in{" "}
              <span className="text-[#5b21b6]">30 Seconds</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] font-medium leading-7 text-[#52657d]">
              Get matched with loan, insurance and card offers from trusted
              partners without affecting your credit score.
            </p>

            <div className="mt-6 grid max-w-md gap-3">
              {[
                [
                  "100% Safe & Secure",
                  "Bank-level encryption protects your data.",
                ],
                [
                  "Instant Results",
                  "See matched offers in less than 30 seconds.",
                ],
                [
                  "No CIBIL Impact",
                  "Checking eligibility will not affect your score.",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl bg-white/90 p-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ede9fe] text-[#5b21b6]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-[#07162d]">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#61748f]">
                      {text}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-6 h-64 w-full sm:h-76">
            <Image
              src="/assets/images/hero1.png"
              alt="Fintaraa eligibility advisor"
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>

          <div className="relative z-10 mb-5 grid gap-3 rounded-xl bg-white/90 p-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="flex -space-x-2">
                {["user1.png", "user2.png", "user3.png"].map((file) => (
                  <Image
                    key={file}
                    src={`/assets/images/${file}`}
                    alt="Customer"
                    width={28}
                    height={28}
                    className="rounded-full border-2 border-white"
                    unoptimized
                  />
                ))}
              </span>
              <span className="text-[12px] font-semibold text-[#07162d]">
                Trusted by 2M+ Indians
              </span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <Star className="h-4 w-4 fill-[#f8b400] text-[#f8b400]" />
              <span className="text-[12px] font-semibold text-[#07162d]">
                4.8/5 Google rating
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 sm:p-6 lg:p-8">
          <div className="w-full rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[22px] font-bold text-[#07162d]">
                  Check Your Eligibility
                </h3>
                <p className="mt-1 text-[13px] font-semibold text-[#61748f]">
                  Compact, secure, and personalised to your selected product.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#087443]">
                <LockKeyhole className="h-3.5 w-3.5" />
                100% Secure
              </span>
            </div>

            <div className="relative mt-6">
              <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-[#e4edf5]" />
              <div
                className="absolute left-0 top-4 h-1 rounded-full bg-[#5b21b6] transition-all duration-500"
                style={{
                  width: `${(activeStep / (stepperItems.length - 1)) * 100}%`,
                }}
              />
              <div className="relative grid grid-cols-4 gap-2">
                {stepperItems.map((item, index) => {
                  const complete = index < activeStep;
                  const active = index === activeStep;
                  return (
                    <div key={item.step} className="text-center">
                      <span
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 text-[12px] font-bold ${
                          complete
                            ? "border-[#5b21b6] bg-[#5b21b6] text-white"
                            : active
                              ? "border-[#d9ebff] bg-[#5b21b6] text-white"
                              : "border-[#e4edf5] bg-white text-[#98a2b3]"
                        }`}
                      >
                        {complete ? <Check className="h-4 w-4" /> : item.step}
                      </span>
                      <p className="mt-2 text-[11px] font-semibold text-[#07162d] sm:text-[12px]">
                        {item.title}
                      </p>
                      <p className="hidden text-[10px] font-bold text-[#8090a4] sm:block">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <form className="mt-7 flex flex-col gap-5">
              <div>
                <p className="text-[13px] font-semibold text-[#344054]">
                  I want
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {productOptions.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedProduct(label)}
                      className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-2 text-[12px] font-semibold transition ${
                        selectedProduct === label
                          ? "border-[#5b21b6] bg-[#5b21b6] text-white"
                          : "border-[#e9d5ff] bg-white text-[#344054] hover:border-[#5b21b6]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[13px] font-semibold text-[#344054]">
                    Loan Amount
                  </p>
                  <p className="text-[24px] font-bold tracking-tight text-[#07162d]">
                    ₹{formatAmount(amount)}
                  </p>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#5b21b6]"
                  style={{
                    background: `linear-gradient(to right, #5b21b6 0%, #5b21b6 ${((amount - 50000) / (5000000 - 50000)) * 100}%, #e2e8f0 ${((amount - 50000) / (5000000 - 50000)) * 100}%, #e2e8f0 100%)`,
                  }}
                />
                <div className="mt-1 flex justify-between text-[11px] font-bold text-[#8090a4]">
                  <span>₹50,000</span>
                  <span>₹50,00,000</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {amountOptions.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAmount(item.value)}
                      className={`h-10 rounded-lg border text-[12px] font-semibold transition ${
                        amount === item.value
                          ? "border-[#5b21b6] bg-[#5b21b6] text-white"
                          : "border-[#e9d5ff] bg-white text-[#344054] hover:border-[#5b21b6]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <PremiumSelect
                  label="Loan Type"
                  value={purpose}
                  options={loanTypeOptions}
                  icon={UserRound}
                  onChange={setPurpose}
                />
                <PremiumSelect
                  label="Tenure"
                  value={tenure}
                  options={tenureOptions}
                  icon={CalendarDays}
                  onChange={setTenure}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PremiumSelect
                  label="Employment Type"
                  value={salaryType}
                  options={salaryOptions}
                  icon={BriefcaseBusiness}
                  onChange={setSalaryType}
                />
                <label className="block">
                  <span className="text-[13px] font-semibold text-[#344054]">
                    Monthly Salary / Income
                  </span>
                  <span className="mt-1 flex h-11 w-full items-center gap-3 rounded-xl border border-[#e9d5ff] bg-white px-3 transition hover:border-[#5b21b6] focus-within:border-[#5b21b6]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#5b21b6]">
                      <IndianRupee className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyIncome}
                      onChange={(event) =>
                        setMonthlyIncome(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter amount"
                      className="min-w-0 flex-1 border-0 bg-transparent text-[13px] font-bold text-[#2f3a4a] outline-none"
                      aria-label="Monthly Salary / Income"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-[#344054]">
                    CIBIL Score
                  </span>
                  <span className="mt-1 flex h-11 w-full items-center gap-3 rounded-xl border border-[#e9d5ff] bg-white px-3 transition hover:border-[#5b21b6]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#5b21b6]">
                      <Gauge className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      min={300}
                      max={900}
                      value={cibilScore}
                      onChange={(event) =>
                        setCibilScore(Number(event.target.value || 0))
                      }
                      className="min-w-0 flex-1 border-0 bg-transparent text-[13px] font-bold text-[#2f3a4a] outline-none"
                      aria-label="CIBIL Score"
                    />
                  </span>
                </label>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-2 rounded-xl bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold text-[#2f3e46]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0f7a4d]" />
                  <p>
                    Higher loan amount or longer tenure may increase your EMI.
                  </p>
                </div>
                <Link
                  href={continueHref}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-6 text-[15px] font-semibold text-white no-underline transition hover:bg-[#4c1d95]"
                >
                  {continueLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-center text-[11px] font-bold text-[#8090a4]">
                  Your information is 100% secure and encrypted.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
