"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calculator,
  CreditCard,
  ClipboardCheck,
  Info,
  Gauge,
  Landmark,
  LineChart,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

type ToolKey = "eligibility" | "emi" | "utilisation";

const loanPresets = {
  personal: { label: "Personal Loan", rate: "12", tenure: "5", foir: 50 },
  home: { label: "Home Loan", rate: "8.5", tenure: "20", foir: 55 },
  business: { label: "Business Loan", rate: "14", tenure: "5", foir: 50 },
  vehicle: { label: "Vehicle Loan", rate: "9", tenure: "7", foir: 50 },
  education: { label: "Education Loan", rate: "10.5", tenure: "10", foir: 45 },
} as const;

const numberValue = (value: string) => {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumberInput = (value: string, maxDigits = 10) => {
  const digits = value.replace(/\D/g, "").slice(0, maxDigits);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
};

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number.isFinite(value) ? value : 0));

const principalFromEmi = (emi: number, annualRate: number, months: number) => {
  if (!emi || !months) return 0;
  const rate = annualRate / 1200;
  if (!rate) return emi * months;
  const factor = Math.pow(1 + rate, months);
  return emi * ((factor - 1) / (rate * factor));
};

const emiFromPrincipal = (
  principal: number,
  annualRate: number,
  months: number,
) => {
  if (!principal || !months) return 0;
  const rate = annualRate / 1200;
  if (!rate) return principal / months;
  const factor = Math.pow(1 + rate, months);
  return principal * rate * (factor / (factor - 1));
};

const toolTabs = [
  {
    key: "eligibility" as const,
    label: "Loan Eligibility",
    description: "Estimate borrowing capacity",
    icon: ClipboardCheck,
  },
  {
    key: "emi" as const,
    label: "EMI Calculator",
    description: "Plan monthly repayments",
    icon: Calculator,
  },
  {
    key: "utilisation" as const,
    label: "Credit Utilisation",
    description: "Check card usage ratio",
    icon: Gauge,
  },
];

const quickLinks = [
  {
    title: "CIBIL Score Checker",
    text: "Verify your mobile and view available score insights.",
    href: "/cibil-score",
    icon: ShieldCheck,
    image: "/assets/services/cibil-score-service.png",
    alt: "Credit score analysis and protection illustration",
    imageClassName: "object-contain object-center p-2",
    imageBackground: "bg-[#f4f8ff]",
  },
  {
    title: "Credit Card Explorer",
    text: "Compare cards by fee, rewards, bank and eligibility.",
    href: "/credit-cards",
    icon: CreditCard,
    image: "/assets/product-cards/credit-cards/rewards-cards.webp",
    alt: "Credit card rewards and benefits",
    imageClassName: "object-cover object-center",
    imageBackground: "bg-[#eef3ff]",
  },
  {
    title: "Application Tracker",
    text: "Track submitted loan, insurance and service requests.",
    href: "/application-status",
    icon: LineChart,
    image: "/assets/images/application-status.png",
    alt: "Digital application status tracking illustration",
    imageClassName: "object-contain object-center p-4",
    imageBackground: "bg-[#f1fbf7]",
  },
];

export function FinancialToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolKey>("eligibility");

  return (
    <main className="bg-[#f7f9fc]">
      <section className="relative overflow-hidden border-b border-[#dfebf4] bg-linear-to-br from-white via-[#f7fbff] to-[#eef7ff] px-4 py-4 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-28 -top-36 h-96 w-96 rounded-full bg-[#dceeff]/60 blur-3xl" />
        <div className="mx-auto max-w-9xl">
          <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-10">
            <div className="relative z-10">
              <h1 className="mt-4 max-w-3xl text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-[#102c45] sm:text-[42px] md:text-[48px]">
                Make clearer financial decisions
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] font-medium leading-7 text-[#637b8e] md:text-[15px]">
                Check indicative eligibility, calculate EMI and understand
                credit utilisation before applying.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-extrabold text-[#17354d] ring-1 ring-[#dce9f3]">
                  <ShieldCheck className="h-4 w-4 text-[#13a653]" />
                  No login required
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-extrabold text-[#17354d] ring-1 ring-[#dce9f3]">
                  <Gauge className="h-4 w-4 text-[#075cab]" />
                  Instant indicative results
                </span>
              </div>
              <p className="mt-3 text-[10px] font-semibold text-[#7b8e9d]">
                Your entered values stay in this browser.
              </p>
            </div>

            <div className="relative mx-auto flex h-62 w-full max-w-md items-end justify-center sm:h-72 lg:h-76">
              <div className="absolute inset-x-6 bottom-3 top-8 rounded-[36px] bg-linear-to-br from-[#e7f2ff] via-white to-[#e9fbf2]" />
              <div className="absolute left-3 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-[#075cab] ring-1 ring-[#d9e8f4]">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div className="absolute right-2 top-12 z-20 hidden items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[10px] font-extrabold text-[#087443] ring-1 ring-[#d9e8f4] sm:flex">
                <ShieldCheck className="h-3.5 w-3.5" />
                Private & secure
              </div>
              <Image
                src="/assets/images/eligibility-illustration1.png"
                alt="Financial eligibility and planning tools"
                width={620}
                height={500}
                priority
                className="relative z-10 h-full w-full object-contain object-bottom"
              />
              <div className="absolute bottom-3 left-3 z-20 rounded-xl bg-[#102c45] px-3 py-2 text-white">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/65">
                  Plan before you apply
                </p>
                <p className="mt-0.5 text-[11px] font-extrabold">
                  3 instant calculators
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-3 md:grid-cols-3">
            {toolTabs.map(({ key, label, description, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTool(key)}
                aria-pressed={activeTool === key}
                className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${
                  activeTool === key
                    ? "border-[#075cab] bg-[#eef7ff] shadow-[0_8px_24px_rgba(7,92,171,0.1)]"
                    : "border-[#dfe8ef] bg-white hover:border-[#b8d4e9]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    activeTool === key
                      ? "bg-[#075cab] text-white"
                      : "bg-[#edf3f7] text-[#587386]"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span>
                  <span className="block text-[13px] font-extrabold text-[#17354d]">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-[#758999]">
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[#dfe8ef] bg-white p-4 shadow-[0_14px_38px_rgba(16,44,69,0.06)] sm:p-6">
            {activeTool === "eligibility" ? <EligibilityCalculator /> : null}
            {activeTool === "emi" ? <EmiCalculator /> : null}
            {activeTool === "utilisation" ? <UtilisationCalculator /> : null}
          </div>

          <div className="mt-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-[22px] font-extrabold text-[#102c45]">
                  More useful tools
                </h2>
                <p className="mt-1 text-[12px] font-medium text-[#718596]">
                  Continue with Fintaraa&apos;s specialised checkers and
                  trackers.
                </p>
              </div>
              <Link
                href="/products"
                className="text-[12px] font-extrabold text-[#075cab] no-underline hover:underline"
              >
                Explore financial products →
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {quickLinks.map(
                ({
                  title,
                  text,
                  href,
                  icon: Icon,
                  image,
                  alt,
                  imageClassName,
                  imageBackground,
                }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group overflow-hidden rounded-2xl border border-[#dfe8ef] bg-white no-underline transition hover:border-[#acd0e9] hover:bg-[#fbfdff]"
                  >
                    <span
                      className={`relative flex h-34 w-full overflow-hidden ${imageBackground}`}
                    >
                      <Image
                        src={image}
                        alt={alt}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className={`transition duration-500 group-hover:scale-[1.03] ${imageClassName}`}
                      />
                      <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-[#075cab] ring-1 ring-[#dce9f3] backdrop-blur-sm">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                    </span>
                    <span className="flex items-start gap-3 p-4 sm:p-5">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-extrabold text-[#17354d]">
                          {title}
                        </span>
                        <span className="mt-1 block text-[11px] font-medium leading-5 text-[#718596]">
                          {text}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#9bb0be] transition group-hover:translate-x-0.5 group-hover:text-[#075cab]" />
                    </span>
                  </Link>
                ),
              )}
            </div>
          </div>

          <p className="mt-6 flex items-start gap-2 rounded-xl border border-[#eadfbd] bg-[#fffaf0] px-4 py-3 text-[10.5px] font-medium leading-5 text-[#766335]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            These estimates are indicative. Final eligibility, rate, fees and
            approval depend on lender policy, bureau checks and verified
            documents.
          </p>
        </div>
      </section>
    </main>
  );
}

function EligibilityCalculator() {
  const [loanType, setLoanType] =
    useState<keyof typeof loanPresets>("personal");
  const [income, setIncome] = useState("75,000");
  const [existingEmi, setExistingEmi] = useState("10,000");
  const [rate, setRate] = useState<string>(loanPresets.personal.rate);
  const [tenure, setTenure] = useState<string>(loanPresets.personal.tenure);
  const preset = loanPresets[loanType];

  const result = useMemo(() => {
    const monthlyIncome = numberValue(income);
    const obligations = numberValue(existingEmi);
    const maxMonthlyDebt = monthlyIncome * (preset.foir / 100);
    const availableEmi = Math.max(0, maxMonthlyDebt - obligations);
    const months = Math.max(1, numberValue(tenure) * 12);
    const eligibility = principalFromEmi(
      availableEmi,
      numberValue(rate),
      months,
    );
    return { monthlyIncome, obligations, availableEmi, eligibility };
  }, [existingEmi, income, preset.foir, rate, tenure]);

  const handleLoanChange = (value: keyof typeof loanPresets) => {
    const next = loanPresets[value];
    setLoanType(value);
    setRate(next.rate);
    setTenure(next.tenure);
  };

  return (
    <CalculatorLayout
      eyebrow="Eligibility estimate"
      title="How much loan could you qualify for?"
      text="Uses an indicative fixed-obligation-to-income ratio for a quick estimate."
      fields={
        <>
          <SelectField
            label="Loan Type"
            value={loanType}
            onChange={(value) =>
              handleLoanChange(value as keyof typeof loanPresets)
            }
            options={Object.entries(loanPresets).map(([value, item]) => ({
              value,
              label: item.label,
            }))}
          />
          <MoneyField
            label="Monthly Net Income"
            value={income}
            onChange={setIncome}
          />
          <MoneyField
            label="Existing Monthly EMIs"
            value={existingEmi}
            onChange={setExistingEmi}
          />
          <NumberField
            label="Expected Interest Rate"
            value={rate}
            suffix="% p.a."
            onChange={setRate}
          />
          <NumberField
            label="Preferred Tenure"
            value={tenure}
            suffix="years"
            onChange={setTenure}
          />
        </>
      }
      result={
        <>
          <ResultHero
            label="Estimated Loan Eligibility"
            value={formatINR(result.eligibility)}
          />
          <ResultRow
            label="Affordable monthly EMI"
            value={formatINR(result.availableEmi)}
          />
          <ResultRow label="Indicative FOIR used" value={`${preset.foir}%`} />
          <ResultRow
            label="Income after existing EMIs"
            value={formatINR(
              Math.max(0, result.monthlyIncome - result.obligations),
            )}
          />
          <Link
            href={`/products/${loanType === "vehicle" ? "vehicle-loan" : `${loanType}-loan`}`}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#12a957] px-5 text-[12px] font-extrabold text-white no-underline hover:bg-[#0e914a]"
          >
            Explore {preset.label}s <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      }
    />
  );
}

function EmiCalculator() {
  const [amount, setAmount] = useState("10,00,000");
  const [rate, setRate] = useState("10.5");
  const [months, setMonths] = useState("60");
  const result = useMemo(() => {
    const principal = numberValue(amount);
    const tenureMonths = Math.max(1, numberValue(months));
    const emi = emiFromPrincipal(principal, numberValue(rate), tenureMonths);
    const total = emi * tenureMonths;
    return { emi, total, interest: Math.max(0, total - principal) };
  }, [amount, months, rate]);

  return (
    <CalculatorLayout
      eyebrow="Repayment planner"
      title="Calculate your monthly EMI"
      text="Enter any amount, expected rate and repayment period."
      fields={
        <>
          <MoneyField label="Loan Amount" value={amount} onChange={setAmount} />
          <NumberField
            label="Annual Interest Rate"
            value={rate}
            suffix="% p.a."
            onChange={setRate}
          />
          <NumberField
            label="Repayment Period"
            value={months}
            suffix="months"
            onChange={setMonths}
            integer
          />
        </>
      }
      result={
        <>
          <ResultHero label="Monthly EMI" value={formatINR(result.emi)} />
          <ResultRow
            label="Principal amount"
            value={formatINR(numberValue(amount))}
          />
          <ResultRow
            label="Total interest"
            value={formatINR(result.interest)}
          />
          <ResultRow label="Total repayment" value={formatINR(result.total)} />
        </>
      }
    />
  );
}

function UtilisationCalculator() {
  const [limit, setLimit] = useState("2,00,000");
  const [outstanding, setOutstanding] = useState("45,000");
  const totalLimit = numberValue(limit);
  const balance = numberValue(outstanding);
  const utilisation = totalLimit ? (balance / totalLimit) * 100 : 0;
  const status =
    utilisation <= 30
      ? { label: "Healthy", color: "text-emerald-700", bg: "bg-emerald-500" }
      : utilisation <= 50
        ? {
            label: "Needs attention",
            color: "text-amber-700",
            bg: "bg-amber-500",
          }
        : {
            label: "High utilisation",
            color: "text-red-700",
            bg: "bg-red-500",
          };
  const targetOutstanding = totalLimit * 0.3;

  return (
    <CalculatorLayout
      eyebrow="Credit health"
      title="Check your credit utilisation ratio"
      text="A lower ratio generally supports healthier credit management."
      fields={
        <>
          <MoneyField
            label="Total Credit Limit"
            value={limit}
            onChange={setLimit}
          />
          <MoneyField
            label="Current Outstanding"
            value={outstanding}
            onChange={setOutstanding}
          />
        </>
      }
      result={
        <>
          <ResultHero
            label="Credit Utilisation"
            value={`${Math.max(0, utilisation).toFixed(1)}%`}
          />
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#e6edf2]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${status.bg}`}
              style={{ width: `${Math.min(100, Math.max(0, utilisation))}%` }}
            />
          </div>
          <p className={`mt-2 text-[12px] font-extrabold ${status.color}`}>
            {status.label}
          </p>
          <ResultRow
            label="30% target balance"
            value={formatINR(targetOutstanding)}
          />
          <ResultRow
            label="Amount above 30% target"
            value={formatINR(Math.max(0, balance - targetOutstanding))}
          />
          <Link
            href="/cibil-score"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#bcd9ee] bg-[#f4faff] px-5 text-[12px] font-extrabold text-[#075cab] no-underline hover:bg-[#eaf5ff]"
          >
            Check CIBIL score <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      }
    />
  );
}

function CalculatorLayout({
  eyebrow,
  title,
  text,
  fields,
  result,
}: {
  eyebrow: string;
  title: string;
  text: string;
  fields: React.ReactNode;
  result: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr] lg:items-stretch">
      <div className="p-1 sm:p-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1686df]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[24px] font-extrabold leading-tight text-[#102c45] sm:text-[28px]">
          {title}
        </h2>
        <p className="mt-2 text-[12px] font-medium leading-5 text-[#718596]">
          {text}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">{fields}</div>
      </div>
      <aside className="rounded-2xl bg-linear-to-br from-[#0c426d] to-[#075cab] p-5 text-white sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/70">
          <Landmark className="h-4 w-4" />
          Indicative result
        </div>
        {result}
      </aside>
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-extrabold text-[#526b7d]">{label}</span>
      <span className="relative">
        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#075cab]" />
        <input
          value={value}
          inputMode="numeric"
          onChange={(event) => onChange(formatNumberInput(event.target.value))}
          className="h-11 w-full rounded-xl border border-[#d8e4ed] bg-[#fbfdff] pl-9 pr-3 text-[13px] font-extrabold text-[#17354d] outline-none focus:border-[#1686df] focus:ring-2 focus:ring-[#e6f3ff]"
        />
      </span>
    </label>
  );
}

function NumberField({
  label,
  value,
  suffix,
  onChange,
  integer = false,
}: {
  label: string;
  value: string;
  suffix: string;
  onChange: (value: string) => void;
  integer?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-extrabold text-[#526b7d]">{label}</span>
      <span className="relative">
        <input
          value={value}
          inputMode="decimal"
          onChange={(event) => {
            const clean = event.target.value
              .replace(integer ? /\D/g : /[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1")
              .slice(0, 6);
            onChange(clean);
          }}
          className="h-11 w-full rounded-xl border border-[#d8e4ed] bg-[#fbfdff] px-3 pr-18 text-[13px] font-extrabold text-[#17354d] outline-none focus:border-[#1686df] focus:ring-2 focus:ring-[#e6f3ff]"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8294a2]">
          {suffix}
        </span>
      </span>
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-extrabold text-[#526b7d]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-[#d8e4ed] bg-[#fbfdff] px-3 text-[13px] font-extrabold text-[#17354d] outline-none focus:border-[#1686df] focus:ring-2 focus:ring-[#e6f3ff]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultHero({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 border-b border-white/15 pb-5">
      <p className="text-[11px] font-semibold text-white/70">{label}</p>
      <p className="mt-1 text-[30px] font-extrabold tracking-[-0.03em] text-white sm:text-[34px]">
        {value}
      </p>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3 text-[12px]">
      <span className="font-medium text-white/68">{label}</span>
      <span className="text-right font-extrabold text-white">{value}</span>
    </div>
  );
}
