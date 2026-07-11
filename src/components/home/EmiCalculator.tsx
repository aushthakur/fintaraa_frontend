"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Calculator,
  Download,
  Landmark,
  LockKeyhole,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { LoanExpertButton } from "./LoanExpertPopup";

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
  repaymentPrincipal?: number;
  extraMetrics?: Array<{
    label: string;
    value: number;
    type?: "currency" | "number";
  }>;
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

type EmiCalculatorProps = {
  defaultLoanType?: string;
  displayLoanLabel?: string;
  lockedLoanType?: boolean;
  applyHrefOverride?: string;
  applyProductSlug?: string;
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

const formatDecimalIndian = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Math.max(0, Number(num || 0)));

const formatCurrencyPdf = (num: number) =>
  `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, Number(num || 0)))}`;

const escapePdfText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

type AmortizationRow = {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interest: number;
  closingBalance: number;
  cumulativeInterest: number;
};

type PdfDetail = {
  label: string;
  value: string;
};

type LoanBreakupPdfData = {
  productLabel: string;
  description: string;
  generatedAt: string;
  inputs: PdfDetail[];
  summary: PdfDetail[];
  extras: PdfDetail[];
  schedule: AmortizationRow[];
};

const buildAmortizationSchedule = (
  principal: number,
  annualRate: number,
  months: number,
  monthlyPayment: number,
): AmortizationRow[] => {
  const safeMonths = Math.max(1, Math.round(months || 1));
  const monthlyRate = Math.max(0, annualRate || 0) / 12 / 100;
  let balance = roundMoney(Math.max(0, principal || 0));
  let cumulativeInterest = 0;
  const rows: AmortizationRow[] = [];

  for (let month = 1; month <= safeMonths && balance > 0.005; month += 1) {
    const openingBalance = balance;
    const interest = roundMoney(openingBalance * monthlyRate);
    let principalPaid = roundMoney(Math.max(0, monthlyPayment - interest));

    if (month === safeMonths || principalPaid >= openingBalance) {
      principalPaid = openingBalance;
    }

    const emi = roundMoney(principalPaid + interest);
    const closingBalance = roundMoney(
      Math.max(0, openingBalance - principalPaid),
    );
    cumulativeInterest = roundMoney(cumulativeInterest + interest);

    rows.push({
      month,
      openingBalance,
      emi,
      principalPaid,
      interest,
      closingBalance,
      cumulativeInterest,
    });

    balance = closingBalance;
  }

  return rows;
};

const pdfNumber = (value: number) =>
  Number.isFinite(value) ? Number(value.toFixed(2)).toString() : "0";

const pdfColor = (hex: string) => {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16) / 255;
  const green = parseInt(value.slice(2, 4), 16) / 255;
  const blue = parseInt(value.slice(4, 6), 16) / 255;
  return `${pdfNumber(red)} ${pdfNumber(green)} ${pdfNumber(blue)}`;
};

const textWidthEstimate = (value: string, fontSize: number) =>
  value.length * fontSize * 0.48;

const pdfText = (
  value: string,
  x: number,
  y: number,
  options: {
    size?: number;
    bold?: boolean;
    color?: string;
    align?: "left" | "center" | "right";
  } = {},
) => {
  const size = options.size || 10;
  const align = options.align || "left";
  const offset =
    align === "right"
      ? textWidthEstimate(value, size)
      : align === "center"
        ? textWidthEstimate(value, size) / 2
        : 0;

  return [
    "q",
    `${pdfColor(options.color || "#111827")} rg`,
    "BT",
    `/${options.bold ? "F2" : "F1"} ${size} Tf`,
    `${pdfNumber(x - offset)} ${pdfNumber(y)} Td`,
    `(${escapePdfText(value)}) Tj`,
    "ET",
    "Q",
  ].join("\n");
};

const pdfRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
) =>
  [
    "q",
    `${pdfColor(fill)} rg`,
    `${pdfNumber(x)} ${pdfNumber(y)} ${pdfNumber(width)} ${pdfNumber(height)} re`,
    "f",
    "Q",
  ].join("\n");

const pdfLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = "#E5EAF2",
) =>
  [
    "q",
    `${pdfColor(color)} RG`,
    "0.6 w",
    `${pdfNumber(x1)} ${pdfNumber(y1)} m`,
    `${pdfNumber(x2)} ${pdfNumber(y2)} l`,
    "S",
    "Q",
  ].join("\n");

const drawDetailGrid = (
  commands: string[],
  title: string,
  details: PdfDetail[],
  startY: number,
) => {
  commands.push(pdfText(title, 42, startY, { size: 13, bold: true }));
  const cardWidth = 252;
  const cardHeight = 36;
  const rowGap = 44;
  const gap = 18;

  details.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 42 + column * (cardWidth + gap);
    const y = startY - 48 - row * rowGap;

    commands.push(pdfRect(x, y, cardWidth, cardHeight, "#F7FAFF"));
    commands.push(
      pdfText(item.label.toUpperCase(), x + 12, y + 21, {
        size: 7.5,
        bold: true,
        color: "#64748B",
      }),
    );
    commands.push(
      pdfText(item.value, x + 12, y + 7, {
        size: 10.5,
        bold: true,
        color: "#111827",
      }),
    );
  });

  return startY - 48 - Math.ceil(details.length / 2) * rowGap;
};

const scheduleColumns = [
  { label: "Month", x: 42, width: 38, align: "left" as const },
  { label: "Opening", x: 84, width: 78, align: "right" as const },
  { label: "EMI", x: 166, width: 70, align: "right" as const },
  { label: "Principal", x: 240, width: 76, align: "right" as const },
  { label: "Interest", x: 320, width: 70, align: "right" as const },
  { label: "Closing", x: 394, width: 80, align: "right" as const },
  { label: "Cum. Int.", x: 478, width: 90, align: "right" as const },
];

const scheduleValue = (row: AmortizationRow, column: string) => {
  switch (column) {
    case "Month":
      return String(row.month);
    case "Opening":
      return formatCurrencyPdf(row.openingBalance);
    case "EMI":
      return formatCurrencyPdf(row.emi);
    case "Principal":
      return formatCurrencyPdf(row.principalPaid);
    case "Interest":
      return formatCurrencyPdf(row.interest);
    case "Closing":
      return formatCurrencyPdf(row.closingBalance);
    default:
      return formatCurrencyPdf(row.cumulativeInterest);
  }
};

const buildLoanBreakupPdf = (data: LoanBreakupPdfData) => {
  const pages: string[] = [];
  const firstPage: string[] = [];

  firstPage.push(pdfRect(0, 726, 612, 66, "#1F2D44"));
  firstPage.push(
    pdfText("FINTARAA", 42, 766, {
      size: 9,
      bold: true,
      color: "#D9FBE8",
    }),
  );
  firstPage.push(
    pdfText("Loan Breakup Report", 42, 743, {
      size: 22,
      bold: true,
      color: "#FFFFFF",
    }),
  );
  firstPage.push(
    pdfText(data.generatedAt, 568, 750, {
      size: 8.5,
      color: "#D7E0EC",
      align: "right",
    }),
  );

  firstPage.push(
    pdfText(`${data.productLabel} Calculator`, 42, 696, {
      size: 16,
      bold: true,
      color: "#0F172A",
    }),
  );
  firstPage.push(
    pdfText(data.description, 42, 677, {
      size: 9.5,
      color: "#64748B",
    }),
  );

  let nextY = drawDetailGrid(firstPage, "Breakdown Summary", data.summary, 642);
  nextY = drawDetailGrid(firstPage, "Input Parameters", data.inputs, nextY - 8);

  if (data.extras.length) {
    nextY = drawDetailGrid(
      firstPage,
      "Additional Details",
      data.extras,
      nextY - 8,
    );
  }

  firstPage.push(pdfRect(42, Math.max(86, nextY - 28), 528, 42, "#F0FDF4"));
  firstPage.push(
    pdfText(
      `Full month-wise schedule attached: ${data.schedule.length} repayment rows.`,
      56,
      Math.max(104, nextY - 4),
      { size: 10.5, bold: true, color: "#14532D" },
    ),
  );
  firstPage.push(
    pdfText(
      "This report is indicative. Final EMI, fees, rate and approval depend on lender policy, credit profile and document verification.",
      56,
      Math.max(90, nextY - 18),
      { size: 7.7, color: "#64748B" },
    ),
  );
  firstPage.push(
    pdfText("Page 1", 568, 34, { size: 8, color: "#94A3B8", align: "right" }),
  );
  pages.push(firstPage.join("\n"));

  const rowsPerPage = 28;
  for (let index = 0; index < data.schedule.length; index += rowsPerPage) {
    const pageRows = data.schedule.slice(index, index + rowsPerPage);
    const pageNumber = pages.length + 1;
    const page: string[] = [];

    page.push(
      pdfText("Loan Amortization Schedule", 42, 750, { size: 15, bold: true }),
    );
    page.push(
      pdfText(data.productLabel, 42, 732, {
        size: 9,
        color: "#64748B",
      }),
    );
    page.push(
      pdfText(`Page ${pageNumber}`, 568, 742, {
        size: 8,
        color: "#94A3B8",
        align: "right",
      }),
    );
    page.push(pdfRect(42, 700, 528, 24, "#EAF2FF"));

    scheduleColumns.forEach((column) => {
      page.push(
        pdfText(
          column.label,
          column.align === "right" ? column.x + column.width : column.x,
          709,
          {
            size: 7.5,
            bold: true,
            color: "#334155",
            align: column.align,
          },
        ),
      );
    });

    pageRows.forEach((row, rowIndex) => {
      const y = 681 - rowIndex * 21;
      if (rowIndex % 2 === 0) {
        page.push(pdfRect(42, y - 7, 528, 19, "#FAFCFF"));
      }
      page.push(pdfLine(42, y - 10, 570, y - 10));

      scheduleColumns.forEach((column) => {
        page.push(
          pdfText(
            scheduleValue(row, column.label),
            column.align === "right" ? column.x + column.width : column.x,
            y,
            {
              size: 7.2,
              color: column.label === "Interest" ? "#A34747" : "#334155",
              align: column.align,
            },
          ),
        );
      });
    });

    page.push(
      pdfText(
        "Interest is calculated on reducing monthly outstanding balance. Last EMI is adjusted for rounding.",
        42,
        34,
        { size: 7.5, color: "#94A3B8" },
      ),
    );
    pages.push(page.join("\n"));
  }

  const pageObjectIds = pages.map((_, index) => 5 + index * 2);
  const contentObjectIds = pages.map((_, index) => 6 + index * 2);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageObjectIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    ...pages.flatMap((content, index) => [
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ]),
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
    description:
      "Calculate EMI using property value, down payment, rate and tenure.",
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
        repaymentPrincipal: repayablePrincipal,
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

const calculatorAliases: Record<string, CalculatorKey> = {
  "vehicle-loan": "car-loan",
  "used-car-loan": "car-loan",
  "two-wheeler-loan": "car-loan",
  "instant-loan": "personal-loan",
  "top-up-loan": "personal-loan",
  "balance-transfer-loan": "personal-loan",
  "renovation-loan": "home-loan",
  "working-capital-loan": "business-loan",
  "machinery-loan": "business-loan",
  "industrial-loan": "business-loan",
  "commercial-purchases-loan": "business-loan",
  "dod-loan": "business-loan",
  "od-loan": "business-loan",
  "agriculture-loan": "business-loan",
  "loan-against-car": "car-loan",
  "loan-against-car-value": "car-loan",
  "loan-against-security": "loan-against-property",
};

const normalizeCalculatorSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const resolveCalculatorKey = (
  value: string | undefined,
  fallback: CalculatorKey,
): CalculatorKey => {
  if (!value) return fallback;

  const slug = normalizeCalculatorSlug(value);
  const directConfig = calculatorConfigs.find((config) => config.key === slug);

  return directConfig?.key || calculatorAliases[slug] || fallback;
};

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
    <div className="rounded-xl border border-[#e2edf8] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#344054]">
            {title}
          </h4>
          {subtitle ? (
            <p className="mt-0.5 text-[12px] font-semibold text-[#8090a4]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex h-12 w-full min-w-0 items-center justify-between rounded-xl border border-[#d7e5f3] bg-[#fbfdff] px-3 sm:w-44">
          {prefix ? (
            <span className="text-[14px] font-bold text-[#07162d]">
              {prefix}
            </span>
          ) : null}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) =>
              onChange(clamp(Number(event.target.value), min, max))
            }
            className="w-full min-w-0 border-0 bg-transparent text-right text-[15px] font-bold text-[#07162d] outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix ? (
            <span className="ml-1 shrink-0 text-[13px] font-bold text-[#075cde]">
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
          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[#075cde]"
          style={{
            background: `linear-gradient(to right, #075cde 0%, #075cde ${percentageTrack}%, #e5e7eb ${percentageTrack}%, #e5e7eb 100%)`,
          }}
        />
        <div className="mt-3 flex justify-between gap-3 text-[12px] font-bold text-[#8090a4]">
          <span>{minLabel}</span>
          <span className="text-right">{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function EmiCalculator({
  defaultLoanType,
  displayLoanLabel,
  lockedLoanType = false,
  applyHrefOverride,
  applyProductSlug,
}: EmiCalculatorProps = {}) {
  const fallbackActiveKey: CalculatorKey = defaultLoanType
    ? "personal-loan"
    : "home-loan";
  const defaultActiveKey = resolveCalculatorKey(defaultLoanType, fallbackActiveKey);
  const [activeKey, setActiveKey] = useState<CalculatorKey>(defaultActiveKey);
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
  const activeLoanLabel = displayLoanLabel || activeConfig.label;
  const applyHref = applyHrefOverride || activeConfig.applyHref;

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
    const inputs = activeConfig.fields.map((field) => {
      const value = activeValues[field.key];
      const formattedValue = field.prefix
        ? `${formatCurrencyPdf(value)}${field.suffix ? ` ${field.suffix}` : ""}`
        : `${formatDecimalIndian(value)}${field.suffix ? ` ${field.suffix}` : ""}`;

      return {
        label: field.title,
        value: formattedValue,
      };
    });
    const repaymentPrincipal =
      computedMetrics.repaymentPrincipal || computedMetrics.principal;
    const schedule = buildAmortizationSchedule(
      repaymentPrincipal,
      activeValues.interestRate,
      computedMetrics.months,
      computedMetrics.emi,
    );
    const firstMonthInterest = schedule[0]?.interest || 0;
    const monthlyRate = (activeValues.interestRate || 0) / 12;
    const extraDetails: PdfDetail[] = [
      ...(computedMetrics.repaymentPrincipal &&
      Math.abs(computedMetrics.repaymentPrincipal - computedMetrics.principal) >
        0.5
        ? [
            {
              label: "Repayment Principal",
              value: formatCurrencyPdf(computedMetrics.repaymentPrincipal),
            },
          ]
        : []),
      ...(computedMetrics.extraMetrics || []).map((metric) => ({
        label: metric.label,
        value:
          metric.type === "number"
            ? formatDecimalIndian(metric.value)
            : formatCurrencyPdf(metric.value),
      })),
    ];
    const pdf = buildLoanBreakupPdf({
      productLabel: activeLoanLabel,
      description: activeConfig.description,
      generatedAt: `Generated on ${new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      inputs,
      summary: [
        { label: "Product", value: activeLoanLabel },
        {
          label: computedMetrics.principalLabel,
          value: formatCurrencyPdf(computedMetrics.principal),
        },
        { label: "Monthly EMI", value: formatCurrencyPdf(computedMetrics.emi) },
        {
          label: "Annual Rate",
          value: `${formatDecimalIndian(activeValues.interestRate)}%`,
        },
        {
          label: "Monthly Rate",
          value: `${formatDecimalIndian(monthlyRate)}%`,
        },
        {
          label: "First Month Interest",
          value: formatCurrencyPdf(firstMonthInterest),
        },
        {
          label: "Total Interest",
          value: formatCurrencyPdf(computedMetrics.totalInterest),
        },
        {
          label: "Total Payable",
          value: formatCurrencyPdf(computedMetrics.totalPayable),
        },
        { label: "Tenure", value: `${computedMetrics.months} months` },
      ],
      extras: extraDetails,
      schedule,
    });
    const fileName = `fintaraa-${applyProductSlug || activeConfig.key}-breakup.pdf`;
    downloadPdf(fileName, pdf);
  };

  const applyButtonClasses =
    "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#075cde] text-[15px] font-semibold text-white no-underline transition hover:bg-[#064cb8]";

  return (
    <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl overflow-hidden rounded-2xl bg-[#f7fbff] p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 border-b border-[#dce9f4] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-[#075cde]">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              EMI planning
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.16] text-[#07162d] sm:text-[34px]">
              Calculate Your{" "}
              <span className="text-[#075cde]">{activeLoanLabel}</span> EMI
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] font-medium leading-6 text-[#61748f] sm:text-[15px]">
              {activeConfig.description} Review the projected monthly payment,
              total interest and repayment schedule before applying.
            </p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-[#075cde]">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {computedMetrics.months}-month projection
          </span>
        </div>

        {!lockedLoanType ? (
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
            {calculatorConfigs.map((config) => {
              const isSelected = activeKey === config.key;
              return (
                <motion.button
                  key={config.key}
                  type="button"
                  onClick={() => setActiveKey(config.key)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`shrink-0 rounded-lg border px-5 py-2.5 text-[13px] font-semibold transition-all ${
                    isSelected
                      ? "border-[#075cde] bg-white text-[#075cde]"
                      : "border-[#dceaf7] bg-white text-[#52657d] hover:border-[#075cde]"
                  }`}
                >
                  {config.label}
                </motion.button>
              );
            })}
          </div>
        ) : null}

        {/* <div className="mt-4 rounded-xl bg-white px-5 py-4">
          <p className="text-[14px] font-bold text-[#07162d]">
            Adjust & Calculate
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-6 text-[#61748f]">
            {activeConfig.description}
          </p>
        </div> */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <motion.div
            key={activeConfig.key}
            initial={{ opacity: 0.96, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <div className="mb-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e7f1ff] text-[#075cde]">
                  <Landmark className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#075cde]">
                    Repayment assumptions
                  </p>
                  <h3 className="mt-1 text-[18px] font-bold leading-tight text-[#07162d]">
                    Structure your {activeLoanLabel}
                  </h3>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-[#71839a]">
                    Reducing-balance estimate based on the selected amount, rate
                    and repayment period.
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-3 border-y border-[#dce9f4] bg-white">
                {[
                  {
                    label: computedMetrics.principalLabel,
                    value: formatCurrencyIndian(computedMetrics.principal),
                    icon: Landmark,
                  },
                  {
                    label: "Interest rate",
                    value: `${formatDecimalIndian(activeValues.interestRate)}% p.a.`,
                    icon: Percent,
                  },
                  {
                    label: "Repayment period",
                    value: `${computedMetrics.months} months`,
                    icon: CalendarDays,
                  },
                ].map(({ label, value, icon: Icon }, index) => (
                  <div
                    key={label}
                    className={`min-w-0 px-2.5 py-3 sm:px-4 ${
                      index > 0 ? "border-l border-[#dce9f4]" : ""
                    }`}
                  >
                    <dt className="flex items-center gap-1.5 text-[9px] font-bold uppercase leading-4 text-[#8090a4] sm:text-[10px]">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#075cde]" aria-hidden="true" />
                      <span className="line-clamp-2">{label}</span>
                    </dt>
                    <dd className="mt-1.5 break-words text-[12px] font-bold leading-4 text-[#07162d] sm:text-[13px]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

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
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#dceaf7] bg-white text-[13px] font-semibold text-[#07162d] transition-colors hover:border-[#075cde] hover:bg-[#f2f7ff] sm:text-[14px]"
            >
              Download {activeLoanLabel} Breakup PDF
              <Download className="ml-1 h-4 w-4 text-[#075cde]" />
            </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0.96, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden rounded-xl border border-[#e2edf8] bg-white"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#eef4fb] bg-white px-6 py-4">
              <span className="text-[15px] font-bold text-[#07162d]">
                Your Loan Summary
              </span>
              <span className="text-[11px] font-semibold text-[#087443]">
                Save up to ₹6.2 Lakh
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
                    className={`rounded-lg p-3 text-center ${badge.bg}`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8090a4]">
                      {badge.label}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-[14px] font-bold tracking-tight text-[#07162d]">
                      {formatCurrencyIndian(badge.val)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-8 flex justify-center">
                <div
                  className="relative flex h-48 w-48 items-center justify-center rounded-full sm:h-52 sm:w-52"
                  style={{
                    background: `conic-gradient(#075cde 0% ${principalPercent}%, #12b76a ${principalPercent}% 100%)`,
                  }}
                >
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white text-center sm:h-38 sm:w-38">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8090a4]">
                      Total Amount
                    </span>
                    <p className="mt-0.5 text-[18px] font-bold tracking-tight text-[#07162d]">
                      {formatCurrencyIndian(computedMetrics.totalPayable)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-50 pt-5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#075cde]" />
                  <div>
                    <p className="text-[12px] font-bold text-[#8090a4]">
                      {computedMetrics.principalLabel}
                    </p>
                    <p className="text-[15px] font-bold text-[#07162d]">
                      {formatCurrencyIndian(computedMetrics.principal)}
                    </p>
                    <span className="text-[11px] font-bold text-[#075cde]">
                      ({principalPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-lime-500" />
                  <div>
                    <p className="text-[12px] font-bold text-[#8090a4]">
                      Total Interest
                    </p>
                    <p className="text-[15px] font-bold text-[#07162d]">
                      {formatCurrencyIndian(computedMetrics.totalInterest)}
                    </p>
                    <span className="text-[11px] font-bold text-[#0f7a4d]">
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
                      <span className="text-[#61748f]">{metric.label}</span>
                      <span className="text-[#07162d]">
                        {metric.type === "number"
                          ? formatNumberIndian(metric.value)
                          : formatCurrencyIndian(metric.value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              {applyProductSlug ? (
                <AuthRedirectLink
                  href={applyHref}
                  productSlug={applyProductSlug}
                  className={applyButtonClasses}
                >
                  Apply For This Loan
                  <ArrowRight className="h-4 w-4" />
                </AuthRedirectLink>
              ) : (
                <Link href={applyHref} className={applyButtonClasses}>
                  Apply For This Loan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <LoanExpertButton className="mt-3 h-12 w-full" />

              <div className="mt-4 grid gap-2 text-[11px] font-bold text-[#61748f] sm:grid-cols-3">
                {[
                  ["Safe & Secure", ShieldCheck],
                  ["No Hidden Charges", LockKeyhole],
                  ["Trusted by 2M+ Indians", BadgeCheck],
                ].map(([label, Icon]) => {
                  const SafeIcon = Icon as typeof ShieldCheck;
                  return (
                    <span
                      key={label as string}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2"
                    >
                      <SafeIcon className="h-3.5 w-3.5 text-[#075cde]" />
                      {label as string}
                    </span>
                  );
                })}
              </div>

              <p className="mt-3 text-center text-[10px] font-semibold italic leading-normal text-[#98a2b3]">
                *EMI shown is indicative. Final rates may vary based on credit
                assessment and lender policy.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
