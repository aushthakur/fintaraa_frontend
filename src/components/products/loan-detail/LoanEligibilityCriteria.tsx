"use client";

import {
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  TrendingUp,
  Landmark,
  Scale,
  CreditCard,
  UserCheck,
} from "lucide-react";

export function LoanEligibilityCriteria() {
  return (
    <section
      id="eligibility"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-[#fafbfe] py-16 sm:py-24 border-b border-gray-100"
      aria-label="Comprehensive Personal Loan Eligibility Criteria"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            Personal Loan{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent">
              Eligibility Criteria
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            Lenders evaluate eligibility based on your income stability, employment classification, credit score, and existing debt obligations. Review the detailed parameters below to maximize your sanction amount up to ₹1 Crore.
          </p>
        </div>

        {/* 2-Column Editorial: Salaried vs Self-Employed Criteria (Borderless) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Salaried Criteria */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200/80 pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#6424C7]">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-normal text-gray-950">
                  For Salaried Professionals
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  Employees of MNCs, Listed Corporates, Private Ltd &amp; Govt
                </p>
              </div>
            </div>

            <div className="space-y-4 text-[14px] text-gray-700">
              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Age Limit
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  21 to 60 years at the time of loan maturity.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Minimum Net Monthly Salary
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  ₹25,000/month for Tier-1 metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune); ₹20,000/month for Tier-2 cities.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Work Experience
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  Minimum 1 year of total work experience, with at least 6 months completed at your current organization.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Employer Categorization Advantage
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  Employees of Category 1 companies (e.g. Genpact, TCS, Infosys, Wipro, Accenture, Reliance) enjoy pre-approved limits up to ₹1 Crore, priority 24-hr processing, and the lowest starting rates from 10.49%.
                </p>
              </div>

              <div>
                <span className="block font-normal text-gray-900 mb-0.5">
                  Salary Mode
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  Salary must be directly credited to a bank savings account via NEFT/RTGS/IMPS (cash salary profiles are not eligible).
                </p>
              </div>
            </div>
          </div>

          {/* Self-Employed Criteria */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200/80 pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-normal text-gray-950">
                  For Self-Employed Individuals
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  Business Owners, Traders, Doctors, CAs &amp; Consultants
                </p>
              </div>
            </div>

            <div className="space-y-4 text-[14px] text-gray-700">
              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Age Limit
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  23 to 65 years at the time of final loan repayment.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Minimum Annual Net Profit
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  Minimum ₹3.5 Lakhs annual profit after tax (PAT) verified via Income Tax Returns (ITR) for the last 2 consecutive assessment years.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Business Vintage &amp; Continuity
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  At least 2 to 3 years of verifiable continuous business operations in the same industry with active GST returns.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <span className="block font-normal text-gray-900 mb-0.5">
                  Banking Track Record
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  Healthy current account cash turnover with zero inward cheque bounces or ECS default returns over the last 6 months.
                </p>
              </div>

              <div>
                <span className="block font-normal text-gray-900 mb-0.5">
                  Professional Practice
                </span>
                <p className="text-gray-600 text-xs sm:text-[13.5px] font-normal">
                  Doctors, Chartered Accountants, and Architects qualify for preferential high-limit personal loans based on their professional degree and registration certificate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score (CIBIL) Tier Table (Borderless, High-Contrast) */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-200/80">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-normal text-gray-950">
              Credit Score (CIBIL) Impact on Your Loan Terms
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              Your 3-digit bureau score is the primary metric lenders use to determine your interest rate and eligible loan ceiling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-emerald-500 pl-4 py-1">
              <span className="text-2xl font-normal text-emerald-600">750+</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Excellent / Prime Tier</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                Instant approval, lowest rates from 10.49%, zero processing fee concessions, and maximum sanction up to ₹1 Crore.
              </p>
            </div>

            <div className="border-l-2 border-blue-500 pl-4 py-1">
              <span className="text-2xl font-normal text-blue-600">700 – 749</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Good Tier</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                High approval probability with leading private banks at standard interest rates from 11.49% to 13.50%.
              </p>
            </div>

            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <span className="text-2xl font-normal text-amber-600">650 – 699</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Average / Moderate</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                Approvals primarily through selective partner NBFCs and fintech lenders with rates starting around 13.50% to 16%.
              </p>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1">
              <span className="text-2xl font-normal text-red-500">&lt; 650</span>
              <h4 className="font-normal text-gray-900 text-sm mt-1">Poor / High Risk</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed font-normal">
                Unsecured loans are restricted. We recommend adding a creditworthy co-applicant or clearing overdue balances first.
              </p>
            </div>
          </div>
        </div>

        {/* FOIR Calculation Guide Callout */}
        <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#6424C7]">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-base sm:text-lg font-normal text-gray-950">
                Understanding FOIR (Fixed Obligation to Income Ratio)
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Banks calculate your FOIR to verify you can afford a new EMI without defaulting:
              </p>
              <div className="my-3 rounded-xl bg-slate-50 px-4 py-2.5 font-mono text-xs font-normal text-gray-800 inline-block">
                FOIR = (Total Current Monthly EMIs + Proposed New EMI) ÷ Net Monthly Income × 100
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Optimal Target: Keep your total FOIR below 50%. For applicants with monthly income above ₹1.5 Lakhs, select banks permit a FOIR up to 65%, enabling personal loans up to ₹1 Crore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
