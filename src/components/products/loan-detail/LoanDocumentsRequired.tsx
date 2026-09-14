"use client";

import {
  FileCheck2,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
} from "lucide-react";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

export function LoanDocumentsRequired({
  page,
  embedded = false,
}: {
  page: LoanSeoPageData;
  embedded?: boolean;
}) {
  return (
    <section
      id="documents"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Documents Required for <span className="text-[#5b21b6]">{page.loanType || "Personal Loan"}</span>
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Enjoy 100% paperless approval through DigiLocker and RBI-regulated Account Aggregators. Keep soft copies ready or verify instantly with Aadhaar OTP without branch visits.
        </p>
      </div>

      {/* Main Checklist: Salaried vs Self-Employed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Column 1: Salaried Individuals */}
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#5b21b6]">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">For Salaried Applicants</h3>
              <p className="text-xs text-slate-500 font-medium">MNCs, Listed Public Ltd, Pvt Ltd, and Government Employees</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Proof of Identity & Address (KYC)</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  PAN Card (mandatory) along with Aadhaar Card (linked to active mobile number for e-KYC), Passport, or Voter ID.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Proof of Income</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Latest 3 months salary slips reflecting employee name, basic pay, deductions, and employer name.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Salary Account Bank Statements</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Latest 3 to 6 months bank statement showing regular monthly salary credits. Easily authenticated in 10 seconds via Account Aggregator OTP.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                4
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Employment Verification</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Company ID card, official work email OTP verification, or Form 16 (Part A & B) for the recent assessment year.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Self-Employed & Professionals */}
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#5b21b6]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">For Self-Employed & Professionals</h3>
              <p className="text-xs text-slate-500 font-medium">Business Owners, Doctors, CAs, Architects & Consultants</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">KYC & Business Address Proof</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  PAN Card of the applicant/firm, Aadhaar Card, Passport, and registered office utility bill or lease agreement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Income Tax Returns (ITR)</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Last 2 assessment years filed ITR along with Computation of Income, verified balance sheet, and Profit & Loss account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Current & Savings Bank Statements</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Last 6 to 12 months operative bank statements showing consistent revenue turnover and healthy average monthly balance (AMB).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-bold mt-0.5">
                4
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Business Continuity & Proof</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  GST Registration Certificate, MSME Udyam Registration, Shop & Establishment Certificate, or Partnership Deed / MoA.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DigiLocker Instant Paperless Banner */}
      <div className="mt-16 pt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">DigiLocker Verification</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Connect your DigiLocker to auto-fetch verified Aadhaar and PAN documents in under 10 seconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Account Aggregator (AA)</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                RBI licensed network allows instant bank statement validation without uploading unencrypted PDF passwords.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">256-Bit Bank-Grade Privacy</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Your financial information is transmitted via encrypted bank tunnels and never stored on third-party servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Tips */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-y-3 gap-x-8 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Keep your Aadhaar linked to your active mobile number for OTP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Upload clear color PDF/JPEG scans without glare</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Name on PAN, Aadhaar, and Bank Account must match exactly</span>
        </div>
      </div>
    </section>
  );
}
