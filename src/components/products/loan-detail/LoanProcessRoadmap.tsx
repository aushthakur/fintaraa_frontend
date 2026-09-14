"use client";

import Link from "next/link";
import {
  FileCheck,
  Scale,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  LockKeyhole,
  Building2,
  Smartphone,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface LoanProcessRoadmapProps {
  productName?: string;
  applyHref?: string;
}

const detailedSteps = [
  {
    step: "01",
    phase: "Step 1 • Discovery & Soft Check",
    title: "Check Pre-Approved Eligibility & Compare 50+ Lenders",
    duration: "Takes ~2 Minutes",
    accent: "#6424C7",
    headline: "Zero Bureau Impact • Instant Live Quotations",
    desc: "Start by entering your mobile number, PAN, employment details (Salaried company tier or Self-Employed profession), and requested loan amount up to ₹1 Crore. Our intelligent underwriting engine initiates a secure, zero-impact soft credit bureau assessment that evaluates your profile across 50+ leading RBI-regulated banks and NBFCs without registering any hard inquiries on your CIBIL record.",
    whatHappens: [
      "Real-time matching against underwriting criteria of HDFC, ICICI, SBI, Axis, Kotak & premier NBFCs",
      "Soft bureau check preserves your CIBIL score with zero score deductions",
      "Instant display of personalized pre-sanctioned credit limits, exact reducing interest rates, and fee structures",
      "Compare multiple matched lender options side-by-side before proceeding",
    ],
    proTip: "Ensure your mobile number is linked to your Aadhaar card to enable instant paperless OTP verification in the next stage.",
  },
  {
    step: "02",
    phase: "Step 2 • Digital Verification",
    title: "Complete 100% Paperless e-KYC & Income Verification",
    duration: "Takes ~3 Minutes",
    accent: "#0ea5e9",
    headline: "DigiLocker Integration • Account Aggregator Speed",
    desc: "Bypass physical document submissions, photocopies, and tedious branch visits. Verify your identity instantly using government-backed DigiLocker via Aadhaar OTP. Next, securely connect your primary salary or business bank account through the RBI-licensed Account Aggregator (AA) framework or encrypted NetBanking statement upload for real-time automated income verification.",
    whatHappens: [
      "Instant Aadhaar e-KYC verification in under 60 seconds with bank-grade 256-bit encryption",
      "Automated salary credit & cash-flow analysis via RBI-regulated Account Aggregator",
      "Zero physical paperwork, document couriers, or branch queues required",
      "Dedicated Fintaraa loan officer assigned to fast-track lender compliance and exceptions",
    ],
    proTip: "Submitting the bank account where your salary is credited (rather than secondary savings accounts) ensures the highest approved loan limit.",
  },
  {
    step: "03",
    phase: "Step 3 • e-Mandate & Disbursal",
    title: "Authorize e-Mandate & Receive Direct Disbursal in 24 Hours",
    duration: "Disbursal Within 24 Hours",
    accent: "#10b981",
    headline: "Direct NEFT/RTGS Transfer • Clear Repayment Schedule",
    desc: "Once your digital verification is verified, review your formal loan sanction agreement detailing the monthly EMI, repayment schedule, interest rate, and terms. Set up a one-click digital NACH e-Mandate using your debit card or net banking for automated, hassle-free monthly repayments. The approved loan amount up to ₹1 Crore is credited directly into your savings account via instant NEFT/RTGS within 24 hours.",
    whatHappens: [
      "Digital agreement sign-off via Aadhaar e-Sign with legally binding validity",
      "Hassle-free automated EMI auto-debit setup through NPCI e-Mandate",
      "Direct electronic fund transfer (NEFT/RTGS) into your designated bank account",
      "Immediate delivery of formal bank sanction letter, loan account number, and amortization schedule",
    ],
    proTip: "Keep a minimum buffer balance in your salary account on your designated EMI date to avoid ECS bounce charges and preserve your credit score.",
  },
];

export function LoanProcessRoadmap({
  productName = "Personal Loan",
  applyHref = "/eligibility-results?product=loan&loanType=personal-loan",
}: LoanProcessRoadmapProps) {
  return (
    <section
      id="steps-to-apply"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-[#fbfbfe] py-16 sm:py-24 border-b border-gray-100"
      aria-label="How to get a personal loan in 3 steps"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            Get Your {productName} in{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
              3 Simple Steps
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            Experience India&apos;s smoothest paperless borrowing process. Transparent terms, assisted digital e-KYC, and direct bank account disbursal up to ₹1 Crore within 24 hours.
          </p>
        </div>

        {/* Detailed 3-Step Walkthrough (Editorial, Borderless, No Box Containers) */}
        <div className="space-y-16 sm:space-y-20">
          {detailedSteps.map((stepItem, index) => {
            return (
              <div
                key={stepItem.step}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start"
              >
                {/* Step Indicator & Header Column */}
                <div className="lg:col-span-4 flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl text-xl sm:text-2xl font-normal text-white shadow-lg"
                      style={{
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #7c3aed 0%, #6424C7 100%)"
                            : index === 1
                            ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                            : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      }}
                    >
                      {stepItem.step}
                    </span>
                    <div>
                      <span className="block text-xs font-normal tracking-wider uppercase text-[#6424C7]">
                        {stepItem.phase}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-normal text-gray-500 mt-0.5">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {stepItem.duration}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-normal text-gray-950 leading-tight">
                    {stepItem.title}
                  </h3>

                  <div className="mt-2 text-xs font-normal text-[#6424C7] bg-purple-50 px-2.5 py-1 rounded-lg inline-block">
                    {stepItem.headline}
                  </div>
                </div>

                {/* Step Detailed Narrative Column */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <p className="text-[14.5px] sm:text-[16px] text-gray-600 leading-relaxed font-normal">
                    {stepItem.desc}
                  </p>

                  {/* Checklist of What Happens in this Step */}
                  <div className="mt-5 space-y-2.5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/90 shadow-2xs">
                    <h4 className="text-xs font-normal uppercase tracking-wider text-gray-400 mb-2">
                      Key Highlights &amp; Process Checklist
                    </h4>
                    {stepItem.whatHappens.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[13.5px] sm:text-[14px] text-gray-700 font-normal leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pro Tip Callout */}
                  <div className="mt-4 rounded-xl bg-slate-100/80 px-4 py-3 text-xs text-gray-600 font-normal">
                    <span className="font-normal text-gray-900 mr-1">Pro Tip:</span>
                    {stepItem.proTip}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-normal text-gray-950">
              Ready to Check Your Pre-Approved Personal Loan Offers?
            </h4>
            <p className="text-xs text-gray-500 font-normal mt-1">
              Takes only 2 minutes • 100% Free • Zero impact on your credit score
            </p>
          </div>
          <Link
            href={applyHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6424C7] hover:bg-[#521eb0] text-white font-normal text-[14px] px-8 py-3.5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-98 shrink-0 cursor-pointer"
          >
            <span>Start Your 2-Min Application</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
