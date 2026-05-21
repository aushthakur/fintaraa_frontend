"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  CalendarRange,
  Calculator,
  ChevronDown,
  Download,
  IndianRupee,
  Landmark,
  Percent,
  Save,
  ShieldCheck,
} from "lucide-react";

const amountPresets = [
  { label: "5L", value: 500000 },
  { label: "10L", value: 1000000 },
  { label: "25L", value: 2500000 },
  { label: "50L", value: 5000000 },
];

const tenurePresets = [
  { label: "5y", value: 5 },
  { label: "10y", value: 10 },
  { label: "15y", value: 15 },
  { label: "20y", value: 20 },
  { label: "30y", value: 30 },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.round(value));

function RangeCard({
  min,
  max,
  unit,
  hint,
  step,
  value,
  title,
  display,
  helper,
  presets,
  minLabel,
  maxLabel,
  onChange,
  icon: Icon,
}: {
  min: number;
  max: number;
  hint: string;
  helper: string;
  step: number;
  title: string;
  unit?: string;
  value: number;
  display: string;
  minLabel: string;
  maxLabel: string;
  icon: typeof Calculator;
  onChange: (value: number) => void;
  presets?: Array<{ label: string; value: number }>;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="group rounded-2xl border border-[#e7eef6] bg-linear-to-br from-white to-[#fbfdff] p-5 shadow-[0_10px_28px_rgba(16,24,40,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cfe3f5] hover:shadow-[0_18px_40px_rgba(25,85,133,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#195585] ring-1 ring-[#d7ebfb] transition group-hover:bg-[#195585] group-hover:text-white">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#5d6878]">
              {title}
            </p>
            <p className="mt-1 text-[13px] font-semibold leading-5 text-[#667085]">
              {hint}
            </p>
            <p className="mt-2 text-[12px] font-medium leading-5 text-[#98a2b3]">
              {helper}
            </p>
          </div>
        </div>

        <div className="relative flex h-13 min-w-44 items-center border-b border-[#cfddea] bg-white text-[#07162d] transition focus-within:border-[#195585]">
          {unit === "percent" ? null : (
            <IndianRupee className="mr-2 h-4 w-4 text-[#3b7eb3]" />
          )}
          <input
            value={Math.round(value)}
            onChange={(event) => onChange(Number(event.target.value) || min)}
            className="h-full w-full border-0 bg-transparent text-[16px] font-extrabold outline-none"
            aria-label={title}
          />
          {unit ? (
            <span className="ml-2 text-[16px] font-extrabold text-[#3b7eb3]">
              {unit === "percent" ? "%" : unit}
            </span>
          ) : null}
          <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 group-focus-within:scale-x-100" />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#98a2b3]">
            Slide to adjust
          </span>
          <span className="rounded-full bg-[#eef8ff] px-3 py-1 text-[12px] font-extrabold text-[#195585]">
            {display}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-2 w-full appearance-none rounded-full bg-[#eef3f8] accent-[#3b7eb3]"
          style={{
            background: `linear-gradient(to right, #3b7eb3 0%, #3b7eb3 ${progress}%, #eef3f8 ${progress}%, #eef3f8 100%)`,
          }}
        />
        <div className="mt-5 flex items-center justify-between text-[13px] font-semibold text-[#5d6878]">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>

      {presets ? (
        <div className="mt-7 flex flex-wrap gap-2 border-t border-[#edf2f7] pt-5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`h-9 rounded-lg border px-4 text-[13px] font-semibold transition ${
                value === preset.value
                  ? "border-[#3b7eb3] bg-[#eef8ff] text-[#195585] shadow-[0_8px_18px_rgba(25,85,133,0.08)]"
                  : "border-[#edf2f7] bg-white text-[#111827] hover:border-[#3b7eb3] hover:text-[#195585]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only">{display}</p>
    </div>
  );
}

export function EmiCalculator() {
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(8.75);
  const [years, setYears] = useState(15);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const monthlyEmi = Number.isFinite(emi) ? emi : amount / months;
    const total = monthlyEmi * months;
    const interest = total - amount;
    const principalPercent = (amount / total) * 100;
    const interestPercent = (interest / total) * 100;

    const rows = Array.from({ length: 5 }, (_, index) => {
      const previousBalance =
        monthlyRate > 0
          ? amount * Math.pow(1 + monthlyRate, index) -
            monthlyEmi * ((Math.pow(1 + monthlyRate, index) - 1) / monthlyRate)
          : amount - monthlyEmi * index;
      const interestPart = previousBalance * monthlyRate;
      const principalPart = monthlyEmi - interestPart;
      const balance = Math.max(0, previousBalance - principalPart);
      return {
        month: index + 1,
        principal: principalPart,
        interest: interestPart,
        emi: monthlyEmi,
        balance,
      };
    });

    return {
      emi: monthlyEmi,
      total,
      interest,
      principalPercent,
      interestPercent,
      rows,
      months,
    };
  }, [amount, rate, years]);

  return (
    <section className="bg-white px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-10 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f7fd] text-[#3b7eb3]">
            <Calculator className="h-6 w-6" />
          </span>
          <h2 className="text-[26px] font-extrabold text-[#171b24]">
            EMI Calculator
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div className="grid h-fit gap-6 lg:sticky lg:top-28">
            <RangeCard
              min={50000}
              step={50000}
              max={10000000}
              value={amount}
              icon={Landmark}
              title="Loan Amount"
              onChange={setAmount}
              minLabel="Rs 50,000"
              presets={amountPresets}
              maxLabel="Rs 1,00,00,000"
              display={formatMoney(amount)}
              hint="Adjust your desired borrowing limit"
              helper="Choose the amount you plan to borrow before comparing EMI comfort."
            />

            <RangeCard
              min={6}
              max={36}
              step={0.25}
              value={rate}
              minLabel="6%"
              unit="percent"
              maxLabel="36%"
              onChange={setRate}
              icon={BadgePercent}
              display={`${rate}%`}
              title="Interest Rate (P.A)"
              hint={`Estimated APR hint: ${(rate + 0.17).toFixed(2)}%`}
              helper="Use the expected annual rate quoted by your lender or partner."
            />

            <RangeCard
              value={years}
              title="Loan Tenure"
              icon={CalendarRange}
              display={`${years} Years`}
              hint="Select period in years"
              min={1}
              max={30}
              step={1}
              unit="Years"
              minLabel="1 Year"
              maxLabel="30 Years"
              onChange={setYears}
              presets={tenurePresets}
              helper="Longer tenure lowers monthly EMI but can increase total interest."
            />
          </div>

          <aside className="overflow-hidden rounded-2xl border border-[#edf2f7] bg-white">
            <div className="bg-[#f1f6fb] px-7 py-5">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#3b7eb3]">
                Breakdown Summary
              </p>
            </div>

            <div className="p-7">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    CalendarDays,
                    "Monthly EMI",
                    formatMoney(result.emi),
                    "#f1f6fb",
                    "#3b7eb3",
                  ],
                  [
                    Percent,
                    "Total Interest",
                    formatMoney(result.interest),
                    "#f1faeb",
                    "#7bd24d",
                  ],
                  [
                    IndianRupee,
                    "Total Amount",
                    formatMoney(result.total),
                    "#f3f8fd",
                    "#3b7eb3",
                  ],
                ].map(([Icon, label, value, bg, color]) => {
                  const SummaryIcon = Icon as typeof Calculator;
                  return (
                    <div
                      key={String(label)}
                      className="rounded-2xl border border-[#d9e7f2] px-4 py-5 text-center"
                      style={{ backgroundColor: String(bg) }}
                    >
                      <SummaryIcon
                        className="mx-auto h-5 w-5"
                        style={{ color: String(color) }}
                      />
                      <p className="mt-4 text-[10px] font-extrabold uppercase text-[#596475]">
                        {String(label)}
                      </p>
                      <p className="mt-2 text-[18px] font-extrabold text-[#111827]">
                        {String(value)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div
                className="mx-auto mt-12 flex h-64 w-64 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#3b7eb3 0 ${result.principalPercent}%, #83d252 ${result.principalPercent}% 100%)`,
                }}
              >
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase text-[#596475]">
                      Total Amount
                    </p>
                    <p className="mt-1 text-[25px] font-extrabold text-[#111827]">
                      {formatMoney(result.total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-[#edf2f7] pt-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-4 w-4 rounded-full bg-[#3b7eb3]" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#596475]">
                        Principal Amount
                      </p>
                      <p className="text-[17px] font-extrabold text-[#111827]">
                        {formatMoney(amount)}
                      </p>
                      <p className="text-[11px] font-extrabold text-[#3b7eb3]">
                        ({result.principalPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-4 w-4 rounded-full bg-[#83d252]" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#596475]">
                        Total Interest
                      </p>
                      <p className="text-[17px] font-extrabold text-[#111827]">
                        {formatMoney(result.interest)}
                      </p>
                      <p className="text-[11px] font-extrabold text-[#62bd31]">
                        ({result.interestPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-10 inline-flex h-14 w-full items-center justify-center gap-5 rounded-xl bg-[#48d879] text-[18px] font-extrabold text-[#063824] shadow-[0_12px_24px_rgba(72,216,121,0.28)] transition hover:-translate-y-0.5 hover:bg-[#34c969]">
                  Apply for this Loan
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button className="mx-auto mt-7 flex items-center gap-3 text-[14px] font-semibold text-[#596475]">
                  <Save className="h-4 w-4" />
                  Save Estimate
                </button>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px] font-semibold text-[#667085]">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#48d879]" />
                    100% Secure
                  </span>
                  <span>No hidden charges</span>
                </div>
                <p className="mt-5 text-center text-[11px] font-medium italic text-[#98a2b3]">
                  *EMI shown is indicative. Final rates may vary based on credit
                  assessment.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-4 rounded-2xl border border-[#d8e0ea] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.05)]">
          <button
            type="button"
            onClick={() => setScheduleOpen((open) => !open)}
            className="flex w-full flex-col gap-4 p-6 text-left sm:flex-row sm:items-center sm:justify-between"
            aria-expanded={scheduleOpen}
          >
            <span className="flex items-center gap-4">
              <CalendarDays className="h-5 w-5 text-[#3b7eb3]" />
              <span className="text-[18px] font-extrabold text-[#171b24]">
                View Amortization Schedule{" "}
                <span className="font-medium text-[#667085]">
                  (Month-wise Breakup)
                </span>
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 text-[#111827] transition duration-300 ${
                scheduleOpen ? "rotate-180 text-[#3b7eb3]" : ""
              }`}
            />
          </button>

          {scheduleOpen ? (
            <div className="border-t border-[#edf2f7] p-6">
              <div className="mb-6 flex flex-wrap justify-end gap-2">
                <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8e0ea] px-4 text-[12px] font-semibold text-[#111827]">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8e0ea] px-4 text-[12px] font-semibold text-[#111827]">
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#d8e0ea]">
                <table className="w-full min-w-190 border-collapse text-left">
                  <thead className="bg-[#f1f6fb] text-[13px] font-extrabold text-[#596475]">
                    <tr>
                      <th className="px-5 py-4">Month</th>
                      <th className="px-5 py-4 text-right">Principal (A)</th>
                      <th className="px-5 py-4 text-right">Interest (B)</th>
                      <th className="px-5 py-4 text-right">Total EMI (A+B)</th>
                      <th className="px-5 py-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8e0ea] text-[14px] font-semibold text-[#111827]">
                    {result.rows.map((row) => (
                      <tr key={row.month}>
                        <td className="px-5 py-4">{row.month}</td>
                        <td className="px-5 py-4 text-right">
                          {formatMoney(row.principal)}
                        </td>
                        <td className="px-5 py-4 text-right text-[#6fcf4a]">
                          {formatMoney(row.interest)}
                        </td>
                        <td className="px-5 py-4 text-right font-extrabold">
                          {formatMoney(row.emi)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {formatMoney(row.balance)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-4 text-center text-[13px] font-semibold italic text-[#667085]"
                      >
                        ... and {Math.max(0, result.months - 5)} more months
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
