"use client";

import { useState } from "react";
import {
  Info,
  Check,
  UserRound,
  HandCoins,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

const productOptions = [
  { label: "Loan", icon: HandCoins },
  { label: "Insurance", icon: ShieldCheck },
  { label: "Credit Card", icon: CreditCard },
];

const amountOptions = [
  { label: "Rs 2L", value: 200000 },
  { label: "Rs 5L", value: 500000 },
  { label: "Rs 10L", value: 1000000 },
  { label: "Rs 20L", value: 2000000 },
  { label: "Rs 30L", value: 3000000 },
];

const stepperItems = [
  { step: "01", title: "Select", text: "Choose product" },
  { step: "02", title: "Amount", text: "Set requirement" },
  { step: "03", title: "Details", text: "Basic info" },
  { step: "04", title: "Offers", text: "Matched results" },
];

const purposeOptions = ["Personal", "Home renovation", "Business", "Education"];
const tenureOptions = ["5 Years", "3 Years", "7 Years", "10 Years"];

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

function BottomInput({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="group relative block pt-2">
      <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#667085] transition-colors duration-300 group-focus-within:text-[#195585]">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          type={type}
          className="peer h-11 w-full border-0 border-b border-[#cfddea] bg-transparent px-0 text-[15px] font-semibold text-[#07162d] outline-none transition-all duration-300 placeholder:text-[#98a2b3] placeholder:font-semibold focus:placeholder:text-[#c8d5e1]"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-[#195585] via-[#12b76a] to-[#1375de] transition-transform duration-300 ease-out peer-focus:scale-x-100" />
      </div>
    </label>
  );
}

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
      <span className="text-[16px] font-medium text-[#2c2c2c]">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`mt-1 flex h-11 w-full items-center gap-3 border bg-white px-3 text-left text-[14px] font-semibold transition ${
          open
            ? "border-[#075596] shadow-[0_8px_18px_rgba(7,85,150,0.08)]"
            : "border-[#ccd1d8] hover:border-[#075596]"
        }`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#075596]">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[#2f3a4a]">{value}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#667085] transition duration-300 ${
            open ? "rotate-180 text-[#075596]" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#dce7f3] bg-white p-1 shadow-[0_18px_42px_rgba(7,22,45,0.16)]">
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
                    ? "bg-[#eef8ff] text-[#075596]"
                    : "text-[#344054] hover:bg-[#f8fcff] hover:text-[#075596]"
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
  const [purpose, setPurpose] = useState(purposeOptions[0]);
  const [tenure, setTenure] = useState(tenureOptions[0]);
  const activeStep = amount ? 2 : selectedProduct ? 1 : 0;

  return (
    <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="lg:pl-2">
          <span className="inline-flex h-8 items-center rounded-full border border-[#aeb6c3] px-4 text-[12px] font-semibold text-[#475467]">
            Quick Apply
          </span>

          <h2 className="mt-8 max-w-2xl text-[42px] font-black leading-[1.18] tracking-[-0.02em] text-black md:text-[48px]">
            Check Your Eligibility in{" "}
            <span className="text-[#195585]">30 Seconds</span>
          </h2>

          <p className="mt-8 max-w-xl text-[18px] font-medium leading-7 text-[#666]">
            Answer a few quick questions to see offers that match your needs.
            <br />
            No impact on your CIBIL Score.
          </p>

          <div className="mt-14 max-w-xl rounded-md border border-[#baf4dc] bg-[#ddffeb] px-5 py-5 text-[#22312b]">
            <h3 className="text-[22px] font-semibold">How it works</h3>
            <ol className="mt-7 grid gap-3 text-[17px] font-medium leading-5">
              <li>1. Choose your Product</li>
              <li>2. Select Amount</li>
              <li>3. Enter mobile number</li>
              <li>4. View eligible offers</li>
            </ol>
          </div>
        </div>

        <div className="relative mx-auto w-full lg:pr-4">
          <div className="absolute -left-5 -top-5 h-[calc(100%+2.5rem)] w-[72%] rounded-3xl bg-[#075596]" />

          <div className="relative rounded-[14px] border border-[#d6dbe3] bg-white p-6 md:px-10 md:py-8">
            <div className="w-full">
              <div className="relative">
                <div className="absolute left-0 right-0 top-5 hidden h-1 rounded-full bg-[#e4edf5] sm:block" />
                <div
                  className="absolute left-0 top-5 hidden h-1 rounded-full bg-linear-to-r from-[#195585] to-[#22c55e] transition-all duration-700 ease-out sm:block"
                  style={{
                    width: `${(activeStep / (stepperItems.length - 1)) * 100}%`,
                  }}
                />

                <div className="relative grid gap-3 sm:grid-cols-4">
                  {stepperItems.map((item, index) => {
                    const completed = index < activeStep;
                    const active = index === activeStep;
                    return (
                      <div
                        key={item.step}
                        className={`rounded-2xl border bg-white p-3 transition-all duration-500 sm:border-0 sm:bg-transparent sm:p-0 ${
                          active
                            ? "border-[#195585] shadow-[0_10px_24px_rgba(25,85,133,0.12)] sm:shadow-none"
                            : "border-[#e4edf5]"
                        }`}
                      >
                        <div
                          className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border-4 text-[13px] font-black transition-all duration-500 ${
                            completed
                              ? "border-[#22c55e] bg-[#22c55e] text-white"
                              : active
                                ? "border-[#d9ebff] bg-[#195585] text-white shadow-[0_0_0_6px_rgba(25,85,133,0.08)]"
                                : "border-[#e4edf5] bg-white text-[#98a2b3]"
                          }`}
                        >
                          {completed ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            item.step
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <p
                            className={`text-[13px] font-black ${
                              active || completed
                                ? "text-[#07162d]"
                                : "text-[#98a2b3]"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-[#667085]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <form className="mt-10 grid gap-8">
              <div>
                <p className="text-[18px] font-semibold text-[#262626]">
                  What do you need?
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {productOptions.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedProduct(label)}
                      className={`inline-flex h-12 items-center gap-3 rounded-[10px] border px-4 text-left text-[14px] font-semibold transition ${
                        selectedProduct === label
                          ? "border-[#075596] text-[#075596] shadow-[0_0_0_1px_rgba(7,85,150,0.08)]"
                          : "border-[#bfc5ce] text-[#262626] hover:border-[#075596]"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[18px] font-semibold text-[#262626]">
                  Select Loan Amount
                </p>
                <p className="mt-4 text-center text-[34px] font-black text-[#383838]">
                  Rs{formatAmount(amount)}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {amountOptions.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAmount(item.value)}
                      className={`group relative h-13 overflow-hidden rounded-xl border px-3 text-[14px] font-black transition duration-300 ${
                        amount === item.value
                          ? "border-[#075596] bg-[#075596] text-white shadow-[0_12px_24px_rgba(7,85,150,0.22)]"
                          : "border-[#d8dee7] bg-[#fbfdff] text-[#313131] shadow-[0_6px_14px_rgba(16,24,40,0.05)] hover:-translate-y-0.5 hover:border-[#075596] hover:text-[#075596] hover:shadow-[0_12px_22px_rgba(16,24,40,0.08)]"
                      }`}
                    >
                      <span
                        className={`absolute inset-x-3 top-0 h-0.5 rounded-full transition ${
                          amount === item.value
                            ? "bg-[#7ee3a2]"
                            : "bg-transparent group-hover:bg-[#075596]"
                        }`}
                      />
                      <span className="relative flex h-full items-center justify-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-6 h-2 w-full accent-[#075596]"
                />
                <div className="mt-1 flex justify-between text-[14px] font-semibold text-[#8a8f98]">
                  <span>Rs 50,000</span>
                  <span>Rs 50,00,000</span>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <PremiumSelect
                  label="Purpose of Loan"
                  value={purpose}
                  options={purposeOptions}
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

              <div className="grid gap-5 sm:grid-cols-2">
                <BottomInput
                  label="Mobile number"
                  placeholder="+91 98765 43210"
                />
                <BottomInput label="Your city" placeholder="Delhi NCR" />
              </div>

              <div className="flex items-center gap-3 bg-[#eafff2] px-4 py-3 text-[12px] font-medium text-[#315746]">
                <Info className="h-4 w-4 shrink-0 text-[#5e7d6c]" />
                Higher loan amount or longer tenure may increase your EMI
              </div>

              <button
                type="button"
                className="ml-auto inline-flex h-11 min-w-44 items-center justify-center gap-8 rounded-full bg-[#20bf55] px-6 text-[14px] font-black text-white shadow-[0_8px_18px_rgba(32,191,85,0.26)] transition hover:-translate-y-0.5 hover:bg-[#12a946]"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
