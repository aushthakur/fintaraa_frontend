"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  X,
  ArrowRight,
  Download,
  TrendingDown,
} from "lucide-react";

export type CalcTab = "emi" | "home" | "personal" | "eligibility";

const tabs: { id: CalcTab; label: string }[] = [
  { id: "emi", label: "EMI Calculator" },
  { id: "home", label: "Home Loan" },
  { id: "personal", label: "Personal Loan" },
  { id: "eligibility", label: "Eligibility" },
];

const tabDefaults: Record<
  CalcTab,
  {
    amount: number;
    minAmount: number;
    maxAmount: number;
    step: number;
    rate: number;
    minRate: number;
    maxRate: number;
    tenureYears: number;
    minTenure: number;
    maxTenure: number;
    loanTypeSlug: string;
    label: string;
  }
> = {
  emi: {
    amount: 1000000,
    minAmount: 100000,
    maxAmount: 20000000,
    step: 50000,
    rate: 10.5,
    minRate: 7,
    maxRate: 24,
    tenureYears: 5,
    minTenure: 1,
    maxTenure: 30,
    loanTypeSlug: "personal-loan",
    label: "EMI Calculator",
  },
  home: {
    amount: 5000000,
    minAmount: 500000,
    maxAmount: 50000000,
    step: 100000,
    rate: 7.15,
    minRate: 6.8,
    maxRate: 15,
    tenureYears: 20,
    minTenure: 1,
    maxTenure: 30,
    loanTypeSlug: "home-loan",
    label: "Home Loan EMI",
  },
  personal: {
    amount: 500000,
    minAmount: 50000,
    maxAmount: 4000000,
    step: 25000,
    rate: 10.75,
    minRate: 9.5,
    maxRate: 24,
    tenureYears: 3,
    minTenure: 1,
    maxTenure: 7,
    loanTypeSlug: "personal-loan",
    label: "Personal Loan EMI",
  },
  eligibility: {
    amount: 2500000,
    minAmount: 200000,
    maxAmount: 15000000,
    step: 50000,
    rate: 8.75,
    minRate: 7,
    maxRate: 18,
    tenureYears: 10,
    minTenure: 1,
    maxTenure: 25,
    loanTypeSlug: "personal-loan",
    label: "Loan Eligibility",
  },
};

const fmt = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Math.max(0, Math.round(num || 0)));

const fmtShort = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
};

function DonutRing({
  principal,
  interest,
  size = 150,
}: {
  principal: number;
  interest: number;
  size?: number;
}) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const principalDash = (principal / 100) * circumference;
  const interestDash = (interest / 100) * circumference;
  const gap = 3;
  const sw = size * 0.1;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8e3f7" strokeWidth={sw} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#ffffff"
        strokeWidth={sw}
        strokeDasharray={`${Math.max(0, interestDash - gap)} ${circumference - interestDash + gap}`}
        strokeDashoffset={-principalDash + gap / 2}
        strokeLinecap="round"
        style={{
          transform: `rotate(-90deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: "stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)",
        }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#6424C7"
        strokeWidth={sw}
        strokeDasharray={`${Math.max(0, principalDash - gap)} ${circumference - principalDash + gap}`}
        strokeDashoffset={gap / 2}
        strokeLinecap="round"
        style={{
          transform: `rotate(-90deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: "stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </svg>
  );
}

export function FloatingCalculatorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CalcTab>("emi");

  const config = tabDefaults[activeTab];
  const [amount, setAmount] = useState<number>(config.amount);
  const [rate, setRate] = useState<number>(config.rate);
  const [tenureYears, setTenureYears] = useState<number>(config.tenureYears);
  const [downloading, setDownloading] = useState(false);

  const handleTabChange = (tab: CalcTab) => {
    setActiveTab(tab);
    setAmount(tabDefaults[tab].amount);
    setRate(tabDefaults[tab].rate);
    setTenureYears(tabDefaults[tab].tenureYears);
  };

  // Listen for custom trigger, click on #calculators link, or hash change
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const checkHash = () => {
      if (window.location.hash === "#calculators") {
        setIsOpen(true);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.getAttribute("href")?.includes("#calculators")) {
        setIsOpen(true);
      }
    };

    window.addEventListener("open-calculator-modal", handleOpen);
    window.addEventListener("hashchange", checkHash);
    document.addEventListener("click", handleClick);
    checkHash();

    return () => {
      window.removeEventListener("open-calculator-modal", handleOpen);
      window.removeEventListener("hashchange", checkHash);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Lock body scroll when modal is open & listen for Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const calc = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const totalMonths = tenureYears * 12;
    if (monthlyRate === 0) {
      const emi = amount / totalMonths;
      return {
        emi: Math.round(emi),
        interest: 0,
        total: amount,
        principalPct: 100,
        interestPct: 0,
      };
    }
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const total = emi * totalMonths;
    const interest = total - amount;
    const principalPct = Math.round((amount / total) * 100);
    return {
      emi: Math.round(emi),
      interest: Math.round(interest),
      total: Math.round(total),
      principalPct,
      interestPct: 100 - principalPct,
    };
  }, [amount, rate, tenureYears]);

  // Slider fill %
  const amtPct =
    ((amount - config.minAmount) / (config.maxAmount - config.minAmount)) * 100;
  const ratePct =
    ((rate - config.minRate) / (config.maxRate - config.minRate)) * 100;
  const tenurePct =
    ((tenureYears - config.minTenure) /
      (config.maxTenure - config.minTenure)) *
    100;

  const handleDownloadPDF = useCallback(() => {
    setDownloading(true);
    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Loan Summary — Fintaraa</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #0f172a; padding: 40px; max-width: 680px; margin: auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6424C7; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 22px; font-weight: 700; color: #6424C7; letter-spacing: -0.5px; }
    .logo span { color: #0f172a; }
    .date { font-size: 12px; color: #64748b; margin-top: 4px; }
    h1 { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #64748b; margin-bottom: 30px; }
    .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #7c3aed; font-weight: 600; margin-bottom: 14px; }
    .params { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 30px; }
    .param-card { background: #f8f5ff; border-radius: 12px; padding: 16px; border: 1px solid #ede9fe; }
    .param-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
    .param-value { font-size: 17px; font-weight: 600; color: #6424C7; }
    .results { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 30px; }
    .result-card { border-radius: 12px; padding: 18px; }
    .result-card.emi { background: linear-gradient(135deg, #6424C7, #9b5de5); color: #fff; }
    .result-card.interest { background: #ffffff; border: 1px solid #e2e8f0; }
    .result-card.total { background: #faf5ff; border: 1px solid #e9d5ff; }
    .result-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; opacity: 0.75; }
    .result-value { font-size: 20px; font-weight: 700; }
    .result-card.emi .result-label { color: rgba(255,255,255,0.8); }
    .result-card.emi .result-value { color: #fff; }
    .result-card.interest .result-label { color: #64748b; }
    .result-card.interest .result-value { color: #0f172a; }
    .result-card.total .result-label { color: #6424C7; }
    .result-card.total .result-value { color: #6424C7; }
    .bar-wrap { margin-bottom: 30px; }
    .bar-label { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 8px; }
    .bar { height: 10px; border-radius: 99px; overflow: hidden; background: #e5e7eb; display: flex; }
    .bar-p { background: #6424C7; border-radius: 99px 0 0 99px; transition: width 0.6s; }
    .bar-i { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 0 99px 99px 0; transition: width 0.6s; }
    .bar-legend { display: flex; gap: 20px; margin-top: 8px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 6px; vertical-align: middle; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    .disclaimer { font-size: 10.5px; color: #94a3b8; margin-bottom: 20px; line-height: 1.6; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #e2e8f0; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Fin<span>taraa</span></div>
      <div class="date">Generated on ${date}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:12px;color:#64748b">fintaraa.com</div>
    </div>
  </div>

  <h1>${config.label} — Loan Summary</h1>
  <p class="subtitle">Your personalised EMI breakdown based on the selected parameters.</p>

  <div class="section-title">Loan Parameters</div>
  <div class="params">
    <div class="param-card">
      <div class="param-label">Loan Amount</div>
      <div class="param-value">${fmt(amount)}</div>
    </div>
    <div class="param-card">
      <div class="param-label">Interest Rate</div>
      <div class="param-value">${rate.toFixed(2)}% p.a.</div>
    </div>
    <div class="param-card">
      <div class="param-label">Tenure</div>
      <div class="param-value">${tenureYears} Years</div>
    </div>
  </div>

  <div class="section-title">Your Results</div>
  <div class="results">
    <div class="result-card emi">
      <div class="result-label">Monthly EMI</div>
      <div class="result-value">${fmt(calc.emi)}</div>
    </div>
    <div class="result-card interest">
      <div class="result-label">Total Interest</div>
      <div class="result-value">${fmt(calc.interest)}</div>
    </div>
    <div class="result-card total">
      <div class="result-label">Total Payable</div>
      <div class="result-value">${fmt(calc.total)}</div>
    </div>
  </div>

  <div class="section-title">Loan Breakup</div>
  <div class="bar-wrap">
    <div class="bar-label">
      <span>Principal: ${calc.principalPct}%</span>
      <span>Interest: ${calc.interestPct}%</span>
    </div>
    <div class="bar">
      <div class="bar-p" style="width:${calc.principalPct}%"></div>
      <div class="bar-i" style="width:${calc.interestPct}%"></div>
    </div>
    <div class="bar-legend">
      <span><span class="legend-dot" style="background:#6424C7"></span>Principal — ${fmt(amount)}</span>
      <span><span class="legend-dot" style="background:#ffffff;border:1px solid #cbd5e1"></span>Interest — ${fmt(calc.interest)}</span>
    </div>
  </div>

  <div class="disclaimer">
    * This is an indicative estimate only. Actual EMI may vary based on the lender's processing fees, GST, and applicable charges. 
    Please consult a Fintaraa advisor for a personalised offer.
  </div>

  <div class="footer">
    <span>© ${new Date().getFullYear()} Fintaraa Financial Services Pvt. Ltd.</span>
    <span>www.fintaraa.com</span>
  </div>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=780,height=900");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
    setTimeout(() => setDownloading(false), 1500);
  }, [amount, rate, tenureYears, calc, config]);

  return (
    <>
      <style>{`
        @keyframes continuous-calculator-shine-vertical {
          0% {
            transform: translateY(-130%) skewY(-20deg);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          45% {
            opacity: 0.9;
          }
          60% {
            transform: translateY(260%) skewY(-20deg);
            opacity: 0;
          }
          100% {
            transform: translateY(260%) skewY(-20deg);
            opacity: 0;
          }
        }
        .calculator-shine-beam {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 45%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 15%,
            rgba(255, 255, 255, 0.85) 50%,
            rgba(255, 255, 255, 0.08) 85%,
            transparent 100%
          );
          animation: continuous-calculator-shine-vertical 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
        }
        .calc-modal-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 99px;
          outline: none;
          cursor: pointer;
        }
        .calc-modal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6424C7;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #6424C7, 0 2px 8px rgba(100,36,199,0.4);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .calc-modal-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 0 3px rgba(100,36,199,0.3), 0 4px 12px rgba(100,36,199,0.4);
        }
        .calc-modal-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6424C7;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #6424C7;
          cursor: pointer;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .calc-modal-spinning { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* ── 1. FLOATING SLIM VERTICAL TAB STUCK TO LEFT SIDE OF SCREEN ── */}
      <aside
        className="fixed left-0 top-[68%] sm:top-1/2 -translate-y-1/2 z-40 select-none"
        aria-label="Calculate your EMI Trigger"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Calculate your EMI"
          data-analytics-category="calculator"
          data-analytics-name="Floating Calculator Widget"
          data-analytics-placement="floating_left"
          className="group relative flex flex-col items-center overflow-hidden rounded-r-2xl border-y border-r border-purple-300/40 border-l-0 bg-gradient-to-b from-[#5b21b6] via-[#6d28d9] to-[#7c3aed] py-3 px-1.5 sm:py-3.5 sm:px-2 text-white shadow-[4px_10px_30px_rgba(76,29,149,0.38),0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-300 hover:translate-x-1 hover:shadow-[6px_14px_36px_rgba(76,29,149,0.52)] active:scale-95 cursor-pointer"
        >
          {/* Continuous Vertical Shine Effect */}
          <span className="calculator-shine-beam pointer-events-none" />

          {/* Calculator Icon Chip */}
          <span className="relative z-10 flex h-7 w-7 sm:h-7.5 sm:w-7.5 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs shadow-inner transition-transform duration-300 group-hover:scale-110">
            <Calculator className="h-4 w-4 text-white" />
          </span>

          {/* Divider */}
          <span className="relative z-10 my-2 h-px w-3.5 bg-white/30 shrink-0" />

          {/* Vertical Text: Calculate your EMI */}
          <span
            className="relative z-10 text-[11px] sm:text-[11.5px] font-extrabold text-white tracking-wider whitespace-nowrap select-none uppercase"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Calculate your EMI
          </span>
        </button>
      </aside>

      {/* ── 2. CALCULATOR MODAL DIALOG ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Calculate your EMI"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col w-full max-w-5xl max-h-[92vh] rounded-3xl bg-white shadow-[0_25px_70px_rgba(15,23,42,0.4)] border border-purple-100 overflow-hidden"
            >
              {/* Modal Top Header */}
              <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-7 sm:py-5 bg-gradient-to-r from-purple-50/50 via-white to-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5b21b6]">
                      Plan Smarter
                    </span>
                  </div>
                  <h2 className="mt-1 text-[19px] sm:text-[24px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
                    Calculate your EMI
                  </h2>
                  <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium">
                    Financial Tools &amp; Calculators — Estimate your EMI, total interest &amp; affordability in seconds.
                  </p>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close calculators modal"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-[#5b21b6] transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Calculator Tab Pills Bar */}
              <div className="border-b border-gray-100 px-5 py-2.5 sm:px-7 bg-white overflow-x-auto scrollbar-none">
                <div className="flex flex-nowrap gap-1.5 sm:gap-2">
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] sm:text-[12.5px] font-bold transition-all duration-200 cursor-pointer ${
                          active
                            ? "bg-[#6424C7] text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-[#6424C7]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Body: Sliders & Results */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid lg:grid-cols-12 min-h-full">
                  {/* LEFT: Sliders & Inputs (7 cols) */}
                  <div className="lg:col-span-7 p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 mb-5 uppercase tracking-widest">
                      {config.label} Parameters
                    </p>

                    <div className="space-y-6 sm:space-y-7">
                      {/* Loan Amount */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-bold text-gray-700">
                            Loan Amount
                          </span>
                          <span className="text-[16px] font-extrabold text-[#6424C7] tabular-nums">
                            {fmt(amount)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={config.minAmount}
                          max={config.maxAmount}
                          step={config.step}
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="calc-modal-slider"
                          style={{
                            background: `linear-gradient(to right, #6424C7 ${amtPct}%, #e2e8f0 ${amtPct}%)`,
                          }}
                          aria-label="Loan Amount"
                        />
                        <div className="flex justify-between mt-1.5 text-[10.5px] font-semibold text-gray-400">
                          <span>{fmtShort(config.minAmount)}</span>
                          <span>{fmtShort(config.maxAmount)}</span>
                        </div>
                      </div>

                      {/* Interest Rate */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-bold text-gray-700">
                            Interest Rate
                          </span>
                          <span className="text-[16px] font-extrabold text-[#6424C7] tabular-nums">
                            {rate.toFixed(2)}% p.a.
                          </span>
                        </div>
                        <input
                          type="range"
                          min={config.minRate}
                          max={config.maxRate}
                          step={0.05}
                          value={rate}
                          onChange={(e) => setRate(Number(e.target.value))}
                          className="calc-modal-slider"
                          style={{
                            background: `linear-gradient(to right, #6424C7 ${ratePct}%, #e2e8f0 ${ratePct}%)`,
                          }}
                          aria-label="Interest Rate"
                        />
                        <div className="flex justify-between mt-1.5 text-[10.5px] font-semibold text-gray-400">
                          <span>{config.minRate}%</span>
                          <span>{config.maxRate}%</span>
                        </div>
                      </div>

                      {/* Tenure */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-bold text-gray-700">
                            Loan Tenure
                          </span>
                          <span className="text-[16px] font-extrabold text-[#6424C7] tabular-nums">
                            {tenureYears} Yr ({tenureYears * 12} Mo)
                          </span>
                        </div>
                        <input
                          type="range"
                          min={config.minTenure}
                          max={config.maxTenure}
                          step={1}
                          value={tenureYears}
                          onChange={(e) => setTenureYears(Number(e.target.value))}
                          className="calc-modal-slider"
                          style={{
                            background: `linear-gradient(to right, #6424C7 ${tenurePct}%, #e2e8f0 ${tenurePct}%)`,
                          }}
                          aria-label="Loan Tenure"
                        />
                        <div className="flex justify-between mt-1.5 text-[10.5px] font-semibold text-gray-400">
                          <span>{config.minTenure} Yr</span>
                          <span>{config.maxTenure} Yr</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stat Pills */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        {
                          label: "Monthly EMI",
                          value: fmt(calc.emi),
                          color: "#6424C7",
                          bg: "#f5f3ff",
                        },
                        {
                          label: "Total Interest",
                          value: fmtShort(calc.interest),
                          color: "#334155",
                          bg: "#ffffff",
                        },
                        {
                          label: "Total Payable",
                          value: fmtShort(calc.total),
                          color: "#0f172a",
                          bg: "#f8fafc",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-gray-200 p-2.5 sm:p-3 text-center sm:text-left overflow-hidden shadow-2xs"
                          style={{ background: stat.bg }}
                        >
                          <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider truncate mb-0.5 font-bold">
                            {stat.label}
                          </p>
                          <p
                            className="text-[12.5px] sm:text-[14px] font-extrabold truncate"
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: Results & Visual Donut (5 cols) */}
                  <div
                    className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between gap-5"
                    style={{
                      background:
                        "linear-gradient(160deg, #faf5ff 0%, #f0f9ff 100%)",
                    }}
                  >
                    {/* Header: Monthly EMI */}
                    <div>
                      <p className="text-[10.5px] uppercase tracking-widest text-[#7c3aed] font-bold mb-0.5">
                        Your Monthly Installment
                      </p>
                      <p className="text-[32px] sm:text-[40px] font-black text-gray-900 leading-none tracking-tight tabular-nums">
                        {fmt(calc.emi)}
                        <span className="text-[13px] font-medium text-gray-400 ml-1.5">
                          /mo
                        </span>
                      </p>
                    </div>

                    {/* Donut Chart & Legend */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <DonutRing
                          principal={calc.principalPct}
                          interest={calc.interestPct}
                          size={145}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[9.5px] text-gray-400 leading-none mb-0.5 font-semibold">
                            split
                          </span>
                          <span className="text-[17px] font-extrabold text-[#6424C7]">
                            {calc.principalPct}%
                          </span>
                          <span className="text-[9.5px] text-gray-400 font-semibold">
                            principal
                          </span>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="mt-3.5 w-full space-y-2">
                        <div className="flex items-center justify-between text-[12px]">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#6424C7] shrink-0" />
                            <span className="font-semibold text-gray-600">
                              Principal Amount
                            </span>
                          </div>
                          <span className="font-bold text-gray-800 tabular-nums">
                            {fmt(amount)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[12px]">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-sm bg-white border border-gray-300 shadow-2xs shrink-0" />
                            <span className="font-semibold text-gray-600">
                              Total Interest
                            </span>
                          </div>
                          <span className="font-bold text-gray-800 tabular-nums">
                            {fmt(calc.interest)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-purple-200/60 text-[12px]">
                          <div className="flex items-center gap-1.5">
                            <TrendingDown className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-bold text-gray-700">
                              Total Payable
                            </span>
                          </div>
                          <span className="font-extrabold text-[#6424C7] tabular-nums">
                            {fmt(calc.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                      <Link
                        href={`/eligibility-results?product=loan&loanType=${config.loanTypeSlug}&amount=${amount}&tenureYears=${tenureYears}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold text-white transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-98"
                        style={{
                          background:
                            "linear-gradient(135deg, #6424C7 0%, #9b5de5 100%)",
                          boxShadow: "0 4px 16px rgba(100,36,199,0.3)",
                        }}
                      >
                        Apply for {fmtShort(amount)}
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-purple-50/70 hover:border-purple-300 hover:text-[#6424C7] transition-all cursor-pointer"
                      >
                        {downloading ? (
                          <>
                            <svg
                              className="calc-modal-spinning h-4 w-4 text-[#6424C7]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                            Preparing PDF…
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 text-[#6424C7]" />
                            Download Summary PDF
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
