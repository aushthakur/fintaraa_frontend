"use client";

import {
  BookOpen,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Percent,
  ReceiptText,
  Building,
  CheckCircle2,
  ChevronRight,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

interface LoanSeoKnowledgeSectionProps {
  productName?: string;
  productSlug?: string;
  applyHref: string;
}

export function LoanSeoKnowledgeSection({
  productName = "Personal Loan",
  productSlug = "personal-loan",
  applyHref,
}: LoanSeoKnowledgeSectionProps) {
  return (
    <section
      id="seo-guide"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
          Everything You Need to Know About{" "}
          <span className="text-[#5b21b6]">{productName}s</span> in India
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
          Comprehensive financial insights answering the most searched Google queries on personal loans. Learn how interest rates are calculated, tax deduction rules, CIBIL score requirements, and smart borrowing strategies.
        </p>
      </div>

      {/* Editorial Content Blocks - Magazine Style */}
      <div className="space-y-16 font-normal">
        
        {/* Article 1: CIBIL Score & Eligibility */}
        <article className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-[#5b21b6]">
            <span>Search Query #1</span>
            <span>•</span>
            <span>Credit Bureau Analysis</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-slate-900">
            What is the Minimum CIBIL Score Required for a Personal Loan?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            In India, most top Scheduled Commercial Banks (such as HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, and Kotak Mahindra Bank) prefer an applicant with a CIBIL score of 750 or higher for unsecured personal loans. However, a score between 700 and 749 is still widely accepted with slightly higher interest rates or nominal processing fees.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 font-normal">
            <div className="p-4 bg-slate-50/70 rounded-2xl">
              <span className="text-xs font-normal text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                750 – 900
              </span>
              <h4 className="font-normal text-slate-900 text-sm mt-2">Prime / Super Score</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Instant pre-approved offers, lowest interest rates from 10.49%* p.a., maximum loan amounts up to ₹1 Crore, zero negotiation hurdles.
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl">
              <span className="text-xs font-normal text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                700 – 749
              </span>
              <h4 className="font-normal text-slate-900 text-sm mt-2">Good / Moderate Score</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                High approval probability at 11.50% – 14.50% p.a. Standard income verification and KYC documents required.
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl">
              <span className="text-xs font-normal text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
                650 – 699
              </span>
              <h4 className="font-normal text-slate-900 text-sm mt-2">Average Score</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Sanctioned predominantly by leading NBFCs or fintech lenders. Higher interest rate (15% to 20% p.a.) and lower sanctioned limits.
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl">
              <span className="text-xs font-normal text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-md">
                Below 650
              </span>
              <h4 className="font-normal text-slate-900 text-sm mt-2">High Risk / Sub-prime</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Direct personal loan approvals are challenging. Borrowers can improve approval odds by adding an earning co-applicant or opting for a secured loan.
              </p>
            </div>
          </div>
        </article>

        {/* Article 2: How to Get Loan up to 1 Crore */}
        <article className="space-y-4 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-[#5b21b6]">
            <span>Search Query #2</span>
            <span>•</span>
            <span>High-Value Financing</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-slate-900">
            How to Get a Personal Loan up to ₹1 Crore in India?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            While standard instant digital apps cap loans at ₹5 Lakh to ₹10 Lakh, Fintaraa partners with leading institutional private banks and NBFCs that sanction high-value personal loans up to ₹1 Crore (₹1,00,00,000) with zero collateral.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-normal">
            <div>
              <h4 className="font-normal text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                1. Monthly Net In-Hand Income
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
                Applicants usually require a minimum net monthly salary of ₹1.5 Lakh to ₹2.5 Lakh for tickets above ₹50 Lakh. For self-employed individuals, a minimum annual ITR of ₹20 Lakh+ is standard.
              </p>
            </div>

            <div>
              <h4 className="font-normal text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                2. FOIR Under 40%
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
                Fixed Obligation to Income Ratio (FOIR) must be conservative. Your existing credit card and loan payments plus the new EMI should ideally not exceed 40% to 50% of your disposable income.
              </p>
            </div>

            <div>
              <h4 className="font-normal text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                3. Employer Categorization
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
                Working with Fortune 500 multinationals, listed blue-chips, top Indian IT/FMCG giants, or public sector enterprises triggers premier underwriting limits and preferred pricing.
              </p>
            </div>
          </div>
        </article>

        {/* Article 3: Company Categorization Impact */}
        <article className="space-y-4 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-[#5b21b6]">
            <span>Search Query #3</span>
            <span>•</span>
            <span>Bank Underwriting Norms</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-slate-900">
            Why Does Your Company Category (Super Cat A, Cat A, Cat B, Cat C) Decide Your Interest Rate?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Every major Indian lender maintains an internal master database known as the Company Categorization List. When you input your employer name (e.g., Google, TCS, Genpact, or a local partnership firm), the bank’s algorithmic risk engine checks its classification to determine your credit risk profile:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-normal">
            <div className="p-5 bg-purple-50/40 rounded-2xl">
              <h4 className="font-normal text-slate-900 text-sm flex items-center gap-2 text-[#5b21b6]">
                <Building className="h-4 w-4 text-[#5b21b6]" />
                Super Category A &amp; Category A Companies
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                Includes Fortune 500 MNCs, Tier-1 IT conglomerates (Infosys, Wipro, TCS), central government ministries, top PSU banks, and established listed giants. Employees enjoy prime rates (starting at 10.49%* p.a.), pre-approved fast-track sanctions up to ₹1 Crore, zero processing fee promotions, and instant verification via official work email.
              </p>
            </div>

            <div className="p-5 bg-slate-50/70 rounded-2xl">
              <h4 className="font-normal text-slate-900 text-sm flex items-center gap-2 text-slate-800">
                <Building className="h-4 w-4 text-slate-600" />
                Category B, Category C &amp; Unlisted Employers
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                Includes mid-sized private limited firms, regional enterprises, and startups. While still eligible across dozens of partner lenders on Fintaraa, approvals may require 6 months bank statements, physical office verification, and interest rates starting from 12.50% to 16.00% depending on individual income stability.
              </p>
            </div>
          </div>
        </article>

        {/* Article 4: Tax Benefits on Personal Loan */}
        <article className="space-y-4 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-[#5b21b6]">
            <span>Search Query #4</span>
            <span>•</span>
            <span>Income Tax Act Exemptions</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-slate-900">
            Can You Claim Income Tax Deductions on a Personal Loan in India?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            By default, a personal loan has no direct tax exemption because it is an unsecured borrowing with unrestricted end-use. However, if the loan proceeds are utilized for specific legitimate purposes, Indian income tax laws allow you to claim substantial tax rebates:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-normal">
            <div className="border-l-2 border-[#5b21b6] pl-4">
              <span className="text-xs font-normal text-[#5b21b6]">Section 24(b)</span>
              <h4 className="font-normal text-slate-900 text-sm mt-1">Home Renovation &amp; Repairs</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                If the personal loan is used to renovate, repair, or extend a residential property, the interest paid can be deducted from income up to ₹30,000 per financial year (for self-occupied) or up to ₹2,00,000 for rented property.
              </p>
            </div>

            <div className="border-l-2 border-[#5b21b6] pl-4">
              <span className="text-xs font-normal text-[#5b21b6]">Section 80E</span>
              <h4 className="font-normal text-slate-900 text-sm mt-1">Higher Education Expenses</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                When personal loan funds pay for higher education tuition fees for yourself, spouse, or children, the interest component is eligible for deduction without any maximum cap for up to 8 consecutive assessment years.
              </p>
            </div>

            <div className="border-l-2 border-[#5b21b6] pl-4">
              <span className="text-xs font-normal text-[#5b21b6]">Section 37(1)</span>
              <h4 className="font-normal text-slate-900 text-sm mt-1">Business Expansion</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                If invested into working capital, inventory, equipment, or business operations, the entire interest paid qualifies as a deductible business expense, reducing taxable net business profits.
              </p>
            </div>
          </div>
        </article>

        {/* Article 5: RBI Rules on Foreclosure & Penal Charges */}
        <article className="space-y-4 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-[#5b21b6]">
            <span>Search Query #5</span>
            <span>•</span>
            <span>Regulatory Consumer Protection</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-slate-900">
            RBI Rules on Personal Loan Foreclosure and Pre-payment Penalties
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            The Reserve Bank of India (RBI) has issued critical directives to shield retail borrowers from predatory lending practices and non-transparent penalty levies:
          </p>

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600 font-normal">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="font-normal">
                Zero Foreclosure Charges on Floating Rate Loans: As per RBI guidelines, banks and NBFCs are strictly prohibited from charging any foreclosure or pre-payment penalty on floating-rate individual loans for personal purposes.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="font-normal">
                Fair Lending Practice on Penal Interest (2024 Rule): RBI circular directs that lenders cannot charge compounding or capitalised penal interest on overdue EMIs. Overdue penalties must be treated solely as simple penal charges and disclosed upfront in the Key Fact Statement (KFS).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="font-normal">
                Mandatory Key Fact Statement (KFS): All regulated lenders must furnish a standardized 1-page KFS with total APR, breakdown of processing fees, and all associated costs prior to the execution of any loan contract.
              </p>
            </div>
          </div>
        </article>

        {/* Article 6: Comparison vs Credit Card & Gold Loan */}
        <article className="space-y-4 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-[#5b21b6]">
            <span>Search Query #6</span>
            <span>•</span>
            <span>Comparative Financial Analysis</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-slate-900">
            Personal Loan vs Credit Card EMI vs Gold Loan: Which Should You Choose?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            When you need quick funds, understanding the true cost and collateral implications between these 3 financing avenues can save you tens of thousands of rupees:
          </p>

          <div className="w-full overflow-x-auto pt-2 font-normal">
            <table className="w-full min-w-[650px] text-left border-collapse text-xs sm:text-sm font-normal">
              <thead>
                <tr className="border-b-2 border-slate-200 font-normal text-slate-500 uppercase tracking-wider">
                  <th className="py-3 pr-4 font-normal">Feature</th>
                  <th className="py-3 pr-4 text-[#5b21b6] font-normal">Personal Loan</th>
                  <th className="py-3 pr-4 font-normal">Credit Card EMI</th>
                  <th className="py-3 font-normal">Gold Loan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                <tr>
                  <td className="py-3 pr-4 font-normal text-slate-900">Typical Interest Rate</td>
                  <td className="py-3 pr-4 font-normal text-[#5b21b6]">10.49% – 18.00% p.a.</td>
                  <td className="py-3 pr-4 font-normal">16.00% – 36.00% p.a.</td>
                  <td className="py-3 font-normal">9.00% – 16.00% p.a.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-normal text-slate-900">Max Sanction Limit</td>
                  <td className="py-3 pr-4 font-normal text-[#5b21b6]">Up to ₹1 Crore</td>
                  <td className="py-3 pr-4 font-normal">Up to credit limit (~₹5L)</td>
                  <td className="py-3 font-normal">75% of gold valuation</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-normal text-slate-900">Collateral / Security</td>
                  <td className="py-3 pr-4 font-normal text-[#5b21b6]">Zero (100% Unsecured)</td>
                  <td className="py-3 pr-4 font-normal">Zero (Unsecured)</td>
                  <td className="py-3 font-normal">Physical Gold Jewellery</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-normal text-slate-900">Repayment Tenure</td>
                  <td className="py-3 pr-4 font-normal text-[#5b21b6]">Up to 7 Years (84 Mo)</td>
                  <td className="py-3 pr-4 font-normal">Up to 24-36 Months</td>
                  <td className="py-3 font-normal">Up to 12-36 Months</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-normal text-slate-900">Best Suited For</td>
                  <td className="py-3 pr-4 font-normal text-[#5b21b6]">Large life milestones &amp; consolidations</td>
                  <td className="py-3 pr-4 font-normal">Small e-commerce purchases</td>
                  <td className="py-3 font-normal">Emergency cash with low credit score</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 font-normal">
        <div>
          <h4 className="text-lg font-normal text-slate-900">Ready to check your personalized offers?</h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Compare quotes from 50+ RBI-licensed banks without hurting your CIBIL score.
          </p>
        </div>
        <AuthRedirectLink
          href={applyHref}
          productSlug={productSlug}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#5b21b6] px-6 py-3 text-sm font-normal text-white shadow-md transition-all hover:bg-[#4c1d95] active:scale-[0.98] whitespace-nowrap"
        >
          <span>Check Free Eligibility</span>
          <ChevronRight className="h-4 w-4" />
        </AuthRedirectLink>
      </div>

    </section>
  );
}
