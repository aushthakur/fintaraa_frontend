"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const banks = [
  { name: "HDFC Bank", logo: "/assets/banks/HDFC-Bank.png", rate: "8.70", highlight: "Welcome benefit ₹3,000", maxLoan: "₹40 Lakh", slug: "hdfc-bank" },
  { name: "SBI", logo: "/assets/banks/State-Bank-of-India.png", rate: "8.50", highlight: "Foreclosure 0 charges", maxLoan: "₹30 Lakh", slug: "sbi" },
  { name: "ICICI Bank", logo: "/assets/banks/ICICI-Bank.png", rate: "8.90", highlight: "Instant approval", maxLoan: "₹35 Lakh", slug: "icici-bank" },
  { name: "Axis Bank", logo: "/assets/banks/axis-bank.png", rate: "8.75", highlight: "Cashback up to ₹2,000", maxLoan: "₹18 Lakh", slug: "axis-bank" },
  { name: "Kotak Bank", logo: "/assets/banks/Kotak-Mahindra-Bank.png", rate: "8.65", highlight: "eGift up to ₹2,500", maxLoan: "₹20 Lakh", slug: "kotak-mahindra-bank" },
  { name: "IndusInd Bank", logo: "/assets/banks/IndusInd-Bank.png", rate: "8.95", highlight: "Low document check", maxLoan: "₹15 Lakh", slug: "indusind-bank" },
  { name: "Yes Bank", logo: "/assets/banks/yes-bank.png", rate: "8.60", highlight: "Same-day disbursal", maxLoan: "₹22 Lakh", slug: "yes-bank" },
  { name: "Punjab National Bank", logo: "/assets/banks/Punjab-National-Bank.png", rate: "8.45", highlight: "Zero processing fee", maxLoan: "₹25 Lakh", slug: "pnb" },
  { name: "Bank of Baroda", logo: "/assets/banks/Bank-of-Baroda.png", rate: "8.40", highlight: "Flexible repayment", maxLoan: "₹20 Lakh", slug: "bank-of-baroda" },
  { name: "IDBI Bank", logo: "/assets/banks/IDBI-Bank.png", rate: "8.80", highlight: "Pre-approved offers", maxLoan: "₹12 Lakh", slug: "idbi-bank" },
  { name: "Federal Bank", logo: "/assets/banks/Federal-Bank.png", rate: "8.99", highlight: "Digital process", maxLoan: "₹10 Lakh", slug: "federal-bank" },
  { name: "Canara Bank", logo: "/assets/banks/canara-bank.png", rate: "8.35", highlight: "Govt. bank trust", maxLoan: "₹20 Lakh", slug: "canara-bank" },
  { name: "Bandhan Bank", logo: "/assets/banks/Bandhan-Bank.png", rate: "9.15", highlight: "Quick online process", maxLoan: "₹8 Lakh", slug: "bandhan-bank" },
  { name: "IDFC First", logo: "/assets/banks/idfc.png", rate: "9.00", highlight: "No hidden charges", maxLoan: "₹40 Lakh", slug: "idfc-first-bank" },
];

const row1 = [...banks, ...banks];

function BankPill({ bank }: { bank: typeof banks[0] }) {
  return (
    <Link
      href={`/lenders/${bank.slug}`}
      className="bank-pill mx-2 flex-none rounded-2xl border border-gray-100 bg-white px-5 py-4 block"
      style={{ minWidth: 240 }}
    >
      <div className="mb-3">
        <div className="h-14 w-44 relative flex items-center">
          <Image src={bank.logo} alt={bank.name} fill className="object-contain object-left" sizes="176px" />
        </div>
      </div>
      <p style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 2 }}>ROI Starts from</p>
      <p className="bank-pill-rate text-[20px] font-semibold text-gray-900 leading-none transition-colors duration-200">
        {bank.rate}%<span className="text-[11px] font-normal text-gray-400 ml-0.5"> p.a.</span>
      </p>
      <p className="text-[11px] text-gray-500 mt-2 truncate">✓ {bank.highlight}</p>
      <p className="text-[10.5px] text-gray-400 mt-0.5">Up to {bank.maxLoan}</p>
      <div className="bank-pill-apply">
        <span className="inline-flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11.5px] font-medium text-white" style={{ background: "linear-gradient(135deg, #6424C7, #9b5de5)" }}>
          Apply Now <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export function BankPartnersShowcase() {
  return (
    <section className="bg-white py-12 sm:py-16 overflow-hidden" aria-label="Our Bank Partners">
      <style>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .bank-marquee-left { animation: marquee-left 30s linear infinite; will-change: transform; }
        .bank-marquee-right { animation: marquee-right 36s linear infinite; will-change: transform; }
        .bank-rows-wrap:hover .bank-marquee-left,
        .bank-rows-wrap:hover .bank-marquee-right { animation-play-state: paused; }
        .bank-pill { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .bank-pill:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(100,36,199,0.13); border-color: #c4b5fd !important; }
        .bank-pill:hover .bank-pill-rate { color: #6424C7 !important; }
        .bank-pill:hover .bank-pill-apply { opacity: 1 !important; max-height: 36px !important; margin-top: 10px !important; }
        .bank-pill-apply { opacity: 0; max-height: 0; margin-top: 0; overflow: hidden; transition: all 0.25s ease; }
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.6); } }
        .live-dot { animation: pulse-dot 1.8s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c3aed", fontWeight: 500 }}>Live rates</p>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
              Get Instant Loan from <span style={{ color: "#6424C7" }}>50+ Trusted Banks</span> &amp; NBFCs
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 font-normal">Compare live rates. Apply in 5 minutes. No paperwork.</p>
            <div style={{ marginTop: 10, height: 1, background: "linear-gradient(90deg, #7c3aed, rgba(124,58,237,0))", width: 160 }} />
          </div>
          <Link href="/banks" className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[12.5px] font-medium text-gray-700 transition-all hover:border-[#6424C7] hover:text-[#6424C7] hover:shadow-sm">
            View All Banks <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="bank-rows-wrap">
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 sm:w-24" style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 sm:w-24" style={{ background: "linear-gradient(to left, white, transparent)" }} />
          <div className="flex bank-marquee-left" style={{ width: "max-content" }}>
            {row1.map((bank, i) => <BankPill key={`r1-${i}`} bank={bank} />)}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="rounded-2xl border border-gray-100 bg-[#faf5ff] px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "50+", label: "Partner Banks & NBFCs" },
            { value: "5 Min", label: "Loan Approval Time" },
            { value: "₹0", label: "Processing Fee (select banks)" },
            { value: "8.35%", label: "Starting Interest Rate" },
          ].map((stat, i) => (
            <div key={stat.label} className={`${i > 0 ? "pl-4 border-l border-gray-200" : ""}`}>
              <p className="text-[18px] sm:text-[22px] font-semibold text-[#6424C7]">{stat.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
