"use client";

import { useState } from "react";
import {
  Info,
  Check,
  UserRound,
  HandCoins,
  CreditCard,
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
    <section className="bg-white px-4 py-28 md:px-6 lg:px-8 ">
      <div className="mx-auto grid max-w-9xl items-center gap-12 lg:grid-cols-2 ">
        <div className="lg:pl-2">
          {/* Quick Apply Badge - Perfectly matching light border and muted text */}
          <span className="inline-flex h-7 items-center rounded-full border border-gray-300 bg-white px-4 text.5 text-[12px] font-medium text-gray-500">
            Quick Apply
          </span>

          {/* Main Header - Sharp layout matching the linebreaks and deep blue text of image_bbade7.png */}
          <h2 className="mt-5 max-w-2xl text-[38px] font-extrabold leading-[1.2] tracking-tight text-gray-900 md:text-[44px]">
            Check Your Eligibility in{" "}
            <span className="block text-[#00529b] sm:inline">30 Seconds</span>
          </h2>

          {/* Description Text - Clean layout tracking with subtle muted text color */}
          <p className="mt-5 max-w-xl text-[15px] font-normal leading-relaxed text-[#55585d]">
            Answer a few quick questions to see offers that match your needs.
            <br />
            No impact on your CIBIL Score.
          </p>

          {/* How it works Info Box - Borderless soft mint layout matching the image exactly */}
          <div className="mt-10 max-w-xl rounded-xl bg-[#eafaf1] px-6 py-5">
            <h3 className="text-[17px] font-bold text-gray-800">
              How it works
            </h3>

            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] font-medium text-[#3b414a]">
              <li className="flex items-center">1. Choose your Product</li>
              <li className="flex items-center">2. Select Amount</li>
              <li className="flex items-center">3. Enter mobile number</li>
              <li className="flex items-center">4. View eligible offers</li>
            </ul>
          </div>
        </div>

        <div className="relative mx-auto w-full lg:pr-4">
          <div className="absolute -left-5 -top-5 h-[107%] w-[72%] rounded-3xl bg-[#075596]" />

          <div className="relative mr-auto  w-full lg:max-w-xl ">
            <div className="relative rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] md:p-8">
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
                            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border-4 text-[13px] font-extrabold transition-all duration-500 ${
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
                              className={`text-[13px] font-extrabold ${
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

              <form className="mt-6 flex flex-col gap-5">
                {/* Row 1: Select Product Type - Inline row to save space */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[16px] font-bold text-[#2d3142]">
                    Select Product
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {productOptions.map(({ label }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedProduct(label)}
                        className={`h-9 rounded-xl border px-5 text-[13px] font-semibold transition-all duration-150
                    ${
                      selectedProduct === label
                        ? "border-[#00529b] bg-[#00529b] text-white"
                        : "border-[#d1d5db] bg-white text-gray-700 hover:border-gray-400"
                    }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2: Select Loan Amount Title & Display Values Layout Line */}
                <div className="flex items-baseline justify-between pt-2">
                  <p className="text-[16px] font-bold text-[#2d3142]">
                    Select Loan Amount
                  </p>
                  <p className="text-[34px] font-bold tracking-tight text-[#2d3142]">
                    ₹{formatAmount(amount)}
                  </p>
                </div>

                {/* Quick Amount Suggestion Toggles Row */}
                <div className="grid grid-cols-5 gap-2.5">
                  {amountOptions.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAmount(item.value)}
                      className={`h-11 rounded-md border text-[13px] font-bold transition-all duration-150
                  ${
                    amount === item.value
                      ? "border-[#00529b] bg-[#00529b] text-white shadow-sm"
                      : "border-[#e2e8f0] bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                    >
                      ₹ {item.label}
                    </button>
                  ))}
                </div>

                {/* Range Slider Track */}
                <div className="relative w-full">
                  <input
                    type="range"
                    min={50000}
                    max={5000000}
                    step={50000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#00529b] accent-[#00529b]"
                    style={{
                      background: `linear-gradient(to right, #00529b 0%, #00529b ${((amount - 50000) / (5000000 - 50000)) * 100}%, #e2e8f0 ${((amount - 50000) / (5000000 - 50000)) * 100}%, #e2e8f0 100%)`,
                    }}
                  />
                  <div className="mt-1 flex justify-between text-[12px] font-medium text-gray-400">
                    <span>₹ 50,000</span>
                    <span>₹ 5,00,000</span>
                  </div>
                </div>

                {/* Core Input Selectors Split Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <PremiumSelect
                    label="Select Loan Type"
                    value={purpose}
                    options={purposeOptions}
                    icon={UserRound}
                    onChange={setPurpose}
                  />
                  <PremiumSelect
                    label="Select Tenure"
                    value={tenure}
                    options={tenureOptions}
                    icon={CalendarDays}
                    onChange={setTenure}
                  />
                </div>

                {/* Bottom Footer Elements: Tip + Button Side-by-Side to keep height minimal */}
                <div className="mt-2 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
                  {/* Warning Box */}
                  <div className="flex items-center gap-2 rounded-lg bg-[#effdf5] px-4 py-2.5 text-[12px] font-medium text-[#2f3e46] sm:max-w-xs md:max-w-sm">
                    <Info className="h-4 w-4 shrink-0 text-[#22c55e]" />
                    <p className="leading-tight">
                      Higher loan amount or longer tenure may increase your EMI
                    </p>
                  </div>

                  {/* Premium Pill Green Button */}
                  <button
                    type="button"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-[#12b76a] px-12 text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(18,183,106,0.15)] transition-all duration-200 hover:bg-[#0ea85f] sm:w-auto min-w-45"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
