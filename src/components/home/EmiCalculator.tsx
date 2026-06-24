"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Download } from "lucide-react";

type CalculatorKey =
  | "home-loan"
  | "car-loan"
  | "personal-loan"
  | "loan-against-property"
  | "business-loan"
  | "education-loan"
  | "gold-loan";

type CalculatorValues = Record<string, number>;

type CalculatorField = {
  key: string;
  title: string;
  subtitle?: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  minLabel: string;
  maxLabel: string;
};

type CalculatorResult = {
  principal: number;
  principalLabel: string;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  months: number;
  extraMetrics?: Array<{ label: string; value: number; type?: "currency" | "number" }>;
};

type CalculatorConfig = {
  key: CalculatorKey;
  label: string;
  description: string;
  applyHref: string;
  defaultValues: CalculatorValues;
  fields: CalculatorField[];
  calculate: (values: CalculatorValues) => CalculatorResult;
};

interface CalculatorCardProps extends Omit<CalculatorField, "key"> {
  value: number;
  onChange: (val: number) => void;
}

const formatCurrencyIndian = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(num || 0)));

const formatNumberIndian = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(num || 0)));

const formatCurrencyPdf = (num: number) =>
  `Rs ${formatNumberIndian(Math.max(0, Math.round(num || 0)))}`;

const escapePdfText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const buildLoanBreakupPdf = (lines: string[]) => {
  const content = [
    "BT",
    "/F1 18 Tf",
    "54 742 Td",
    "(Fintaraa Loan Breakup) Tj",
    "0 -30 Td",
    "/F1 11 Tf",
    ...lines.flatMap((line) => [`(${escapePdfText(line)}) Tj`, "0 -18 Td"]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
};

const downloadPdf = (fileName: string, pdf: string) => {
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

const calculateReducingEmi = (
  principal: number,
  annualRate: number,
  months: number,
) => {
  const safePrincipal = Math.max(0, principal);
  const safeMonths = Math.max(1, Math.round(months));
  const monthlyInterestRate = Math.max(0, annualRate) / 12 / 100;
  const emi =
    monthlyInterestRate > 0
      ? (safePrincipal *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, safeMonths)) /
        (Math.pow(1 + monthlyInterestRate, safeMonths) - 1)
      : safePrincipal / safeMonths;
  const totalPayable = emi * safeMonths;

  return {
    emi,
    totalPayable,
    totalInterest: Math.max(0, totalPayable - safePrincipal),
    months: safeMonths,
  };
};

const calculatorConfigs: CalculatorConfig[] = [
  {
    key: "home-loan",
    label: "Home Loan",
    description: "Calculate EMI using property value, down payment, rate and tenure.",
    applyHref: "/products/home-loan",
    defaultValues: {
      propertyValue: 7500000,
      downPayment: 1500000,
      interestRate: 8.75,
      tenureYears: 20,
    },
    fields: [
      {
        key: "propertyValue",
        title: "Property Value",
        subtitle: "Estimated home purchase value",
        min: 500000,
        max: 50000000,
        step: 50000,
        prefix: "₹",
        minLabel: "₹5 Lakh",
        maxLabel: "₹5 Cr",
      },
      {
        key: "downPayment",
        title: "Down Payment",
        subtitle: "Amount paid upfront",
        min: 0,
        max: 20000000,
        step: 25000,
        prefix: "₹",
        minLabel: "₹0",
        maxLabel: "₹2 Cr",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected home loan rate",
        min: 6,
        max: 18,
        step: 0.05,
        suffix: "%",
        minLabel: "6%",
        maxLabel: "18%",
      },
      {
        key: "tenureYears",
        title: "Loan Tenure",
        subtitle: "Repayment period in years",
        min: 1,
        max: 30,
        step: 1,
        suffix: "Years",
        minLabel: "1 Year",
        maxLabel: "30 Years",
      },
    ],
    calculate: (values) => {
      const propertyValue = values.propertyValue;
      const downPayment = Math.min(values.downPayment, propertyValue);
      const principal = Math.max(0, propertyValue - downPayment);
      const emi = calculateReducingEmi(
        principal,
        values.interestRate,
        values.tenureYears * 12,
      );
      return {
        ...emi,
        principal,
        principalLabel: "Loan Amount",
        extraMetrics: [
          { label: "Property Value", value: propertyValue },
          { label: "Down Payment", value: downPayment },
        ],
      };
    },
  },
  {
    key: "car-loan",
    label: "Car Loan",
    description: "Estimate vehicle loan EMI after down payment.",
    applyHref: "/products/car-loan",
    defaultValues: {
      vehiclePrice: 1200000,
      downPayment: 200000,
      interestRate: 9.5,
      tenureYears: 5,
    },
    fields: [
      {
        key: "vehiclePrice",
        title: "Vehicle Price",
        subtitle: "On-road vehicle value",
        min: 200000,
        max: 10000000,
        step: 25000,
        prefix: "₹",
        minLabel: "₹2 Lakh",
        maxLabel: "₹1 Cr",
      },
      {
        key: "downPayment",
        title: "Down Payment",
        subtitle: "Amount paid upfront",
        min: 0,
        max: 5000000,
        step: 10000,
        prefix: "₹",
        minLabel: "₹0",
        maxLabel: "₹50 Lakh",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected car loan rate",
        min: 7,
        max: 24,
        step: 0.05,
        suffix: "%",
        minLabel: "7%",
        maxLabel: "24%",
      },
      {
        key: "tenureYears",
        title: "Loan Tenure",
        subtitle: "Repayment period in years",
        min: 1,
        max: 8,
        step: 1,
        suffix: "Years",
        minLabel: "1 Year",
        maxLabel: "8 Years",
      },
    ],
    calculate: (values) => {
      const downPayment = Math.min(values.downPayment, values.vehiclePrice);
      const principal = Math.max(0, values.vehiclePrice - downPayment);
      const emi = calculateReducingEmi(
        principal,
        values.interestRate,
        values.tenureYears * 12,
      );
      return {
        ...emi,
        principal,
        principalLabel: "Loan Amount",
        extraMetrics: [
          { label: "Vehicle Price", value: values.vehiclePrice },
          { label: "Down Payment", value: downPayment },
        ],
      };
    },
  },
  {
    key: "personal-loan",
    label: "Personal Loan",
    description: "Calculate EMI and processing fee for unsecured loans.",
    applyHref: "/products/personal-loan",
    defaultValues: {
      loanAmount: 500000,
      interestRate: 12.5,
      tenureYears: 4,
      processingFee: 1.5,
    },
    fields: [
      {
        key: "loanAmount",
        title: "Loan Amount",
        subtitle: "Amount you want to borrow",
        min: 50000,
        max: 4000000,
        step: 25000,
        prefix: "₹",
        minLabel: "₹50,000",
        maxLabel: "₹40 Lakh",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected personal loan rate",
        min: 9,
        max: 36,
        step: 0.05,
        suffix: "%",
        minLabel: "9%",
        maxLabel: "36%",
      },
      {
        key: "tenureYears",
        title: "Loan Tenure",
        subtitle: "Repayment period in years",
        min: 1,
        max: 7,
        step: 1,
        suffix: "Years",
        minLabel: "1 Year",
        maxLabel: "7 Years",
      },
      {
        key: "processingFee",
        title: "Processing Fee",
        subtitle: "One-time bank fee estimate",
        min: 0,
        max: 5,
        step: 0.1,
        suffix: "%",
        minLabel: "0%",
        maxLabel: "5%",
      },
    ],
    calculate: (values) => {
      const principal = values.loanAmount;
      const base = calculateReducingEmi(
        principal,
        values.interestRate,
        values.tenureYears * 12,
      );
      const fee = (principal * values.processingFee) / 100;
      return {
        ...base,
        principal,
        principalLabel: "Loan Amount",
        totalPayable: base.totalPayable + fee,
        extraMetrics: [{ label: "Processing Fee", value: fee }],
      };
    },
  },
  {
    key: "loan-against-property",
    label: "Loan Against Property",
    description: "Estimate loan eligibility using property value and LTV.",
    applyHref: "/products/loan-against-property",
    defaultValues: {
      propertyValue: 10000000,
      ltvPercent: 55,
      interestRate: 10.5,
      tenureYears: 12,
    },
    fields: [
      {
        key: "propertyValue",
        title: "Property Value",
        subtitle: "Market value of pledged property",
        min: 1000000,
        max: 100000000,
        step: 100000,
        prefix: "₹",
        minLabel: "₹10 Lakh",
        maxLabel: "₹10 Cr",
      },
      {
        key: "ltvPercent",
        title: "Loan-to-Value",
        subtitle: "Eligible loan as % of property value",
        min: 20,
        max: 75,
        step: 1,
        suffix: "%",
        minLabel: "20%",
        maxLabel: "75%",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected LAP rate",
        min: 8,
        max: 24,
        step: 0.05,
        suffix: "%",
        minLabel: "8%",
        maxLabel: "24%",
      },
      {
        key: "tenureYears",
        title: "Loan Tenure",
        subtitle: "Repayment period in years",
        min: 1,
        max: 20,
        step: 1,
        suffix: "Years",
        minLabel: "1 Year",
        maxLabel: "20 Years",
      },
    ],
    calculate: (values) => {
      const principal = (values.propertyValue * values.ltvPercent) / 100;
      const emi = calculateReducingEmi(
        principal,
        values.interestRate,
        values.tenureYears * 12,
      );
      return {
        ...emi,
        principal,
        principalLabel: "Eligible Loan",
        extraMetrics: [
          { label: "Property Value", value: values.propertyValue },
          { label: "LTV Amount", value: principal },
        ],
      };
    },
  },
  {
    key: "business-loan",
    label: "Business Loan",
    description: "Calculate EMI, fee and total repayment for business funding.",
    applyHref: "/products/business-loan",
    defaultValues: {
      loanAmount: 1500000,
      interestRate: 14,
      tenureYears: 3,
      processingFee: 2,
    },
    fields: [
      {
        key: "loanAmount",
        title: "Loan Amount",
        subtitle: "Working capital or expansion requirement",
        min: 100000,
        max: 10000000,
        step: 50000,
        prefix: "₹",
        minLabel: "₹1 Lakh",
        maxLabel: "₹1 Cr",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected business loan rate",
        min: 10,
        max: 36,
        step: 0.05,
        suffix: "%",
        minLabel: "10%",
        maxLabel: "36%",
      },
      {
        key: "tenureYears",
        title: "Loan Tenure",
        subtitle: "Repayment period in years",
        min: 1,
        max: 7,
        step: 1,
        suffix: "Years",
        minLabel: "1 Year",
        maxLabel: "7 Years",
      },
      {
        key: "processingFee",
        title: "Processing Fee",
        subtitle: "One-time lender fee estimate",
        min: 0,
        max: 5,
        step: 0.1,
        suffix: "%",
        minLabel: "0%",
        maxLabel: "5%",
      },
    ],
    calculate: (values) => {
      const principal = values.loanAmount;
      const base = calculateReducingEmi(
        principal,
        values.interestRate,
        values.tenureYears * 12,
      );
      const fee = (principal * values.processingFee) / 100;
      return {
        ...base,
        principal,
        principalLabel: "Loan Amount",
        totalPayable: base.totalPayable + fee,
        extraMetrics: [
          { label: "Processing Fee", value: fee },
          { label: "Net Disbursal", value: Math.max(0, principal - fee) },
        ],
      };
    },
  },
  {
    key: "education-loan",
    label: "Education Loan",
    description: "Include course cost, margin and moratorium interest.",
    applyHref: "/products/education-loan",
    defaultValues: {
      courseCost: 2000000,
      marginPercent: 10,
      interestRate: 10.75,
      moratoriumYears: 1,
      repaymentYears: 8,
    },
    fields: [
      {
        key: "courseCost",
        title: "Course Cost",
        subtitle: "Tuition and eligible education expenses",
        min: 100000,
        max: 10000000,
        step: 50000,
        prefix: "₹",
        minLabel: "₹1 Lakh",
        maxLabel: "₹1 Cr",
      },
      {
        key: "marginPercent",
        title: "Student Margin",
        subtitle: "Contribution from applicant side",
        min: 0,
        max: 25,
        step: 1,
        suffix: "%",
        minLabel: "0%",
        maxLabel: "25%",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected education loan rate",
        min: 7,
        max: 18,
        step: 0.05,
        suffix: "%",
        minLabel: "7%",
        maxLabel: "18%",
      },
      {
        key: "moratoriumYears",
        title: "Moratorium",
        subtitle: "Study period before repayment starts",
        min: 0,
        max: 5,
        step: 1,
        suffix: "Years",
        minLabel: "0 Year",
        maxLabel: "5 Years",
      },
      {
        key: "repaymentYears",
        title: "Repayment Tenure",
        subtitle: "EMI period after moratorium",
        min: 1,
        max: 15,
        step: 1,
        suffix: "Years",
        minLabel: "1 Year",
        maxLabel: "15 Years",
      },
    ],
    calculate: (values) => {
      const principal = values.courseCost * (1 - values.marginPercent / 100);
      const moratoriumInterest =
        principal * (values.interestRate / 100) * values.moratoriumYears;
      const repayablePrincipal = principal + moratoriumInterest;
      const base = calculateReducingEmi(
        repayablePrincipal,
        values.interestRate,
        values.repaymentYears * 12,
      );
      return {
        ...base,
        principal,
        principalLabel: "Loan Amount",
        totalInterest: Math.max(0, base.totalPayable - principal),
        totalPayable: base.totalPayable,
        extraMetrics: [
          { label: "Course Cost", value: values.courseCost },
          { label: "Moratorium Interest", value: moratoriumInterest },
        ],
      };
    },
  },
  {
    key: "gold-loan",
    label: "Gold Loan",
    description: "Estimate loan value from gold weight, rate and LTV.",
    applyHref: "/products/gold-loan",
    defaultValues: {
      goldWeight: 100,
      goldRate: 6500,
      ltvPercent: 75,
      interestRate: 12,
      tenureMonths: 12,
    },
    fields: [
      {
        key: "goldWeight",
        title: "Gold Weight",
        subtitle: "Approximate eligible gold weight",
        min: 5,
        max: 1000,
        step: 1,
        suffix: "g",
        minLabel: "5g",
        maxLabel: "1000g",
      },
      {
        key: "goldRate",
        title: "Gold Rate",
        subtitle: "Estimated value per gram",
        min: 3000,
        max: 10000,
        step: 100,
        prefix: "₹",
        suffix: "/g",
        minLabel: "₹3,000/g",
        maxLabel: "₹10,000/g",
      },
      {
        key: "ltvPercent",
        title: "Loan-to-Value",
        subtitle: "Loan against gold value",
        min: 40,
        max: 80,
        step: 1,
        suffix: "%",
        minLabel: "40%",
        maxLabel: "80%",
      },
      {
        key: "interestRate",
        title: "Interest Rate (P.A.)",
        subtitle: "Expected gold loan rate",
        min: 7,
        max: 30,
        step: 0.05,
        suffix: "%",
        minLabel: "7%",
        maxLabel: "30%",
      },
      {
        key: "tenureMonths",
        title: "Loan Tenure",
        subtitle: "Repayment period in months",
        min: 3,
        max: 36,
        step: 1,
        suffix: "Months",
        minLabel: "3 Months",
        maxLabel: "36 Months",
      },
    ],
    calculate: (values) => {
      const goldValue = values.goldWeight * values.goldRate;
      const principal = (goldValue * values.ltvPercent) / 100;
      const emi = calculateReducingEmi(
        principal,
        values.interestRate,
        values.tenureMonths,
      );
      return {
        ...emi,
        principal,
        principalLabel: "Eligible Loan",
        extraMetrics: [
          { label: "Gold Value", value: goldValue },
          { label: "Gold Weight", value: values.goldWeight, type: "number" },
        ],
      };
    },
  },
];

const initialValues = calculatorConfigs.reduce(
  (acc, config) => ({ ...acc, [config.key]: config.defaultValues }),
  {} as Record<CalculatorKey, CalculatorValues>,
);

function SliderCard({
  title,
  subtitle,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  minLabel,
  maxLabel,
  onChange,
}: CalculatorCardProps) {
  const percentageTrack = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-400">
            {title}
          </h4>
          {subtitle ? (
            <p className="mt-0.5 text-[12px] font-medium text-gray-400">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex h-11 w-full min-w-0 items-center justify-between rounded-lg border border-gray-100 bg-white px-3 sm:w-40">
          {prefix ? (
            <span className="text-[14px] font-bold text-gray-700">{prefix}</span>
          ) : null}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
            className="w-full min-w-0 border-0 bg-transparent text-right text-[15px] font-bold text-gray-800 outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix ? (
            <span className="ml-1 shrink-0 text-[13px] font-bold text-blue-500">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-blue-500"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentageTrack}%, #e5e7eb ${percentageTrack}%, #e5e7eb 100%)`,
          }}
        />
        <div className="mt-3 flex justify-between gap-3 text-[12px] font-medium text-gray-400">
          <span>{minLabel}</span>
          <span className="text-right">{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function EmiCalculator() {
  const [activeKey, setActiveKey] = useState<CalculatorKey>("home-loan");
  const [valuesByCalculator, setValuesByCalculator] =
    useState<Record<CalculatorKey, CalculatorValues>>(initialValues);

  const activeConfig = useMemo(
    () =>
      calculatorConfigs.find((config) => config.key === activeKey) ||
      calculatorConfigs[0],
    [activeKey],
  );
  const activeValues = valuesByCalculator[activeConfig.key];

  const computedMetrics = useMemo(
    () => activeConfig.calculate(activeValues),
    [activeConfig, activeValues],
  );

  const totalPayable = Math.max(computedMetrics.totalPayable, 1);
  const principalPercent = Math.min(
    100,
    Math.max(0, (computedMetrics.principal / totalPayable) * 100),
  );
  const interestPercent = Math.min(
    100,
    Math.max(0, (computedMetrics.totalInterest / totalPayable) * 100),
  );

  const updateField = (fieldKey: string, value: number) => {
    setValuesByCalculator((current) => ({
      ...current,
      [activeConfig.key]: {
        ...current[activeConfig.key],
        [fieldKey]: value,
      },
    }));
  };

  const handleDownloadBreakup = () => {
    const inputLines = activeConfig.fields.map((field) => {
      const value = activeValues[field.key];
      const formattedValue = field.prefix
        ? formatCurrencyPdf(value)
        : `${formatNumberIndian(value)}${field.suffix ? ` ${field.suffix}` : ""}`;
      return `${field.title}: ${formattedValue}`;
    });
    const metricLines = [
      `Product: ${activeConfig.label}`,
      `${computedMetrics.principalLabel}: ${formatCurrencyPdf(computedMetrics.principal)}`,
      `Monthly EMI: ${formatCurrencyPdf(computedMetrics.emi)}`,
      `Total Interest: ${formatCurrencyPdf(computedMetrics.totalInterest)}`,
      `Total Payable: ${formatCurrencyPdf(computedMetrics.totalPayable)}`,
      `Tenure: ${computedMetrics.months} months`,
      "",
      "Inputs",
      ...inputLines,
      "",
      "Note: This is an indicative calculation. Final offers depend on lender policy, credit profile and document verification.",
    ];
    const fileName = `fintaraa-${activeConfig.key}-breakup.pdf`;
    downloadPdf(fileName, buildLoanBreakupPdf(metricLines));
  };

  return (
    <section className="bg-[#fafbfc] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-gray-900 sm:text-[24px]">
              EMI Calculator
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] font-semibold leading-6 text-gray-500 sm:text-[14px]">
              Select a product and adjust fields to estimate monthly EMI,
              interest and total repayment.
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#005ca8] shadow-xs">
            {computedMetrics.months} month schedule
          </span>
        </div>

        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
          {calculatorConfigs.map((config) => {
            const isSelected = activeKey === config.key;
            return (
              <button
                key={config.key}
                type="button"
                onClick={() => setActiveKey(config.key)}
                className={`shrink-0 rounded-xl border px-5 py-2.5 text-[13px] font-semibold transition-all ${
                  isSelected
                    ? "border-[#12b76a] bg-[#12b76a] text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-[#e6edf5] bg-white px-5 py-4">
          <p className="text-[13px] font-bold text-[#0b192c]">
            {activeConfig.label} Calculator
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-6 text-gray-500">
            {activeConfig.description}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid gap-4">
            {activeConfig.fields.map(({ key: fieldKey, ...field }) => (
              <SliderCard
                key={fieldKey}
                {...field}
                value={activeValues[fieldKey]}
                onChange={(value) => updateField(fieldKey, value)}
              />
            ))}

            <button
              type="button"
              onClick={handleDownloadBreakup}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-white text-[13px] font-bold text-gray-700 transition-colors hover:bg-emerald-50/40 sm:text-[14px]"
            >
              Download Loan Breakup PDF
              <Download className="ml-1 h-4 w-4 text-gray-400" />
            </button>
          </div>

          <aside className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xs">
            <div className="border-b border-gray-50 bg-[#f8fafc] px-6 py-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Breakdown Summary
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {[
                  {
                    id: "emi",
                    label: "Monthly EMI",
                    val: computedMetrics.emi,
                    bg: "bg-blue-50/40",
                  },
                  {
                    id: "int",
                    label: "Total Interest",
                    val: computedMetrics.totalInterest,
                    bg: "bg-emerald-50/30",
                  },
                  {
                    id: "tot",
                    label: "Total Amount",
                    val: computedMetrics.totalPayable,
                    bg: "bg-blue-50/40",
                  },
                ].map((badge) => (
                  <div
                    key={badge.id}
                    className={`rounded-xl border border-blue-50/60 p-3 text-center ${badge.bg}`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {badge.label}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-[14px] font-bold tracking-tight text-gray-800">
                      {formatCurrencyIndian(badge.val)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-8 flex justify-center">
                <div
                  className="relative flex h-52 w-52 items-center justify-center rounded-full shadow-inner"
                  style={{
                    background: `conic-gradient(#2563eb 0% ${principalPercent}%, #84cc16 ${principalPercent}% 100%)`,
                  }}
                >
                  <div className="flex h-38 w-38 flex-col items-center justify-center rounded-full bg-white text-center shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Total Amount
                    </span>
                    <p className="mt-0.5 text-[18px] font-extrabold tracking-tight text-gray-800">
                      {formatCurrencyIndian(computedMetrics.totalPayable)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-50 pt-5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-[12px] font-medium text-gray-400">
                      {computedMetrics.principalLabel}
                    </p>
                    <p className="text-[15px] font-bold text-gray-800">
                      {formatCurrencyIndian(computedMetrics.principal)}
                    </p>
                    <span className="text-[11px] font-bold text-blue-600">
                      ({principalPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-lime-500" />
                  <div>
                    <p className="text-[12px] font-medium text-gray-400">
                      Total Interest
                    </p>
                    <p className="text-[15px] font-bold text-gray-800">
                      {formatCurrencyIndian(computedMetrics.totalInterest)}
                    </p>
                    <span className="text-[11px] font-bold text-lime-600">
                      ({interestPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {computedMetrics.extraMetrics?.length ? (
                <div className="mt-5 grid gap-2 rounded-xl bg-[#f8fbff] p-4">
                  {computedMetrics.extraMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between gap-4 text-[12px] font-bold"
                    >
                      <span className="text-gray-500">{metric.label}</span>
                      <span className="text-gray-900">
                        {metric.type === "number"
                          ? formatNumberIndian(metric.value)
                          : formatCurrencyIndian(metric.value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              <Link
                href={activeConfig.applyHref}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#12b76a] text-[15px] font-bold text-white no-underline transition-transform hover:-translate-y-0.5"
              >
                Apply For This Loan
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-[13px] text-emerald-500">Secure</span>
                </span>
                <span>|</span>
                <span>No hidden charges</span>
              </div>

              <p className="mt-3 text-center text-[10px] font-medium italic leading-normal text-gray-300">
                *EMI shown is indicative. Final rates may vary based on credit
                assessment and lender policy.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
