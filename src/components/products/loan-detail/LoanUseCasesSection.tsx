"use client";

import Link from "next/link";
import Image from "next/image";
import {
  HeartPulse,
  Sparkles,
  Home,
  CreditCard,
  Plane,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Percent,
} from "lucide-react";

interface LoanUseCasesSectionProps {
  productSlug?: string;
  applyHref?: string;
}

const useCasesDetailed = [
  {
    id: "wedding",
    title: "Weddings & Family Celebrations",
    headline: "Finance Your Dream Wedding Without Depleting Family Investments",
    icon: Sparkles,
    badge: "Preserve Long-Term Savings",
    accent: "#8b5cf6",
    image: "/assets/personal-loan/usecase-wedding.jpg",
    alt: "Grand Indian wedding celebration and joyful couple",
    amount: "Up to ₹1 Crore",
    tenure: "1 to 7 Years (Up to 84 Mos)",
    rate: "From 10.49%* p.a.",
    desc: "A wedding is one of life's most cherished milestones, but venue reservations, bespoke designer jewelry, banquet hospitality, and destination accommodations can strain household liquidity. Instead of breaking high-yield mutual funds, fixed deposits, or retirement reserves, a high-ticket unsecured personal loan provides immediate funding with comfortable repayment over up to 7 years.",
    benefits: [
      "Zero collateral or gold hypothecation required",
      "Flexible multi-year EMI tenure keeps monthly obligations predictable",
      "Direct bank credit within 24 hours to pay caterers, decorators, and venues",
      "Part-payment options allow you to reduce principal with wedding gifts or bonuses",
    ],
    smartTip:
      "Select a 4 to 5 year tenure during the initial year of marriage to keep EMIs light, then make prepayments once dual household finances stabilize.",
  },
  {
    id: "medical",
    title: "Medical Emergencies & Planned Surgeries",
    headline: "Instant Financial Shield for Emergency Healthcare & Specialised Surgeries",
    icon: HeartPulse,
    badge: "Instant 24-Hr Emergency Disbursal",
    accent: "#ef4444",
    image: "/assets/personal-loan/usecase-medical.jpg",
    alt: "Compassionate healthcare doctor and patient consultation",
    amount: "Up to ₹50 Lakhs",
    tenure: "1 to 5 Years",
    rate: "From 10.49%* p.a.",
    desc: "Healthcare crises happen without warning. Even comprehensive family health insurance policies frequently enforce room-rent sub-limits, non-payable surgical consumables, or exclusions for advanced robotic procedures and organ transplants. An emergency personal medical loan delivers fast, unrestricted cash liquidity straight to your savings account, ensuring your family receives world-class treatment without bureaucratic delays.",
    benefits: [
      "Fast-tracked 24-hour approval with priority digital verification",
      "No restriction on choice of hospital, specialist doctors, or medication",
      "Covers pre-operative tests, ICU admission deposits, and post-discharge rehabilitation",
      "Soft bureau check ensures immediate quotes with zero CIBIL impact",
    ],
    smartTip:
      "Borrow the upfront hospital deposit amount digitally, and use insurance claim reimbursement settlements to prepay the loan early with minimal charges.",
  },
  {
    id: "renovation",
    title: "Home Renovation & Modern Interior Makeover",
    headline: "Transform Your Living Space into a Premium Sanctuary",
    icon: Home,
    badge: "Tax Benefits Under Sec 24(b)",
    accent: "#0ea5e9",
    image: "/assets/personal-loan/usecase-home.jpg",
    alt: "Modern luxury living room interior with contemporary decor",
    amount: "Up to ₹1 Crore",
    tenure: "1 to 7 Years",
    rate: "From 10.49%* p.a.",
    desc: "Upgrading your apartment with a modular kitchen, acoustic home office, luxury bathroom fittings, or rooftop solar panels significantly enhances your family's daily comfort and boosts property resale valuation. Unlike tedious home improvement loans that mandate architect estimates and title deeds verification, a personal loan gives you 100% spending autonomy to pay contractors, interior designers, and material suppliers directly.",
    benefits: [
      "Instant capital without property mortgage, valuation delays, or legal vetting",
      "Interest paid is tax-deductible up to ₹30,000 to ₹2,00,000 under Section 24(b)",
      "High sanction limits up to ₹1 Crore accommodate end-to-end luxury turnkey projects",
      "Flexible part-payments let you settle balances after seasonal work bonuses",
    ],
    smartTip:
      "Maintain formal GST invoices from your interior designer and contractor to claim income tax deduction on the interest component under Section 24(b).",
  },
  {
    id: "consolidation",
    title: "Debt Consolidation & Credit Card Payoff",
    headline: "Consolidate High-Interest Dues into One Low 10.49% Single Monthly EMI",
    icon: CreditCard,
    badge: "Save Up to 70% in Interest Charges",
    accent: "#10b981",
    image: "/assets/personal-loan/usecase-debt.jpg",
    alt: "Relaxed professional reviewing financial savings on laptop",
    amount: "Up to ₹1 Crore",
    tenure: "1 to 7 Years",
    rate: "From 10.49%* p.a.",
    desc: "Revolving credit card balances charge punitive annualized interest rates between 36% and 42% (3% to 3.5% monthly), creating a compounding debt trap where minimum payments only service finance charges. Consolidating multiple fragmented card balances and short-term micro-loans into a single prime personal loan immediately slashes your interest outflow by up to 70%, unifies your repayment schedule into a single date, and fast-tracks your CIBIL score recovery.",
    benefits: [
      "Replace 36%-42% credit card APR with structured 10.49% reducing interest",
      "One single monthly installment eliminates multiple due dates and late penalties",
      "Substantially drops your credit utilization ratio (CUR), triggering rapid CIBIL score recovery",
      "Fixed amortization timeline ensures your debt is completely paid off within your chosen tenure",
    ],
    smartTip:
      "After consolidating, keep your credit card accounts open but maintain credit utilization under 30% to maximize your credit rating within 90 to 120 days.",
  },
  {
    id: "education",
    title: "Higher Education & Executive Certifications",
    headline: "Invest in Global Degrees, Executive MBAs & Career-Defining Skills",
    icon: GraduationCap,
    badge: "Zero Collateral Student Financing",
    accent: "#6424C7",
    image: "/assets/personal-loan/usecase-education.jpg",
    alt: "Determined young Indian scholar preparing for international university",
    amount: "Up to ₹50 Lakhs",
    tenure: "1 to 7 Years",
    rate: "From 10.49%* p.a.",
    desc: "Accelerate your professional earning power by enrolling in prestigious executive management programs (ISB, INSEAD, IIMs), artificial intelligence certifications, commercial pilot licenses, or international university semester tuition. Bypass protracted traditional education loan mortgage requirements and third-party guarantor demands with a streamlined digital personal loan.",
    benefits: [
      "No property mortgage, collateral hypothecation, or parental guarantee required",
      "Covers tuition fees, laptop/hardware, overseas visa deposits, and initial living expenses",
      "Disbursal directly to applicant's account allows flexible multi-currency payments",
      "Repayment tenures up to 7 years keep monthly installments manageable while working",
    ],
    smartTip:
      "Working executives can leverage annual performance bonuses and appraisal salary hikes to prepay principal without lock-in penalties after 12 months.",
  },
  {
    id: "travel",
    title: "International Vacations & Milestone Travel",
    headline: "Explore Bucket-List Destinations Without Postponing Life's Adventures",
    icon: Plane,
    badge: "Quick In-Principle Sanction",
    accent: "#f59e0b",
    image: "/assets/personal-loan/usecase-travel.jpg",
    alt: "Happy Indian traveler enjoying scenic mountain vacation",
    amount: "Up to ₹25 Lakhs",
    tenure: "1 to 3 Years",
    rate: "From 10.49%* p.a.",
    desc: "Whether booking a European summer holiday across Switzerland and France, embarking on an Alaskan cruise, or planning a luxury honeymoon in the Maldives, travel expenses add up quickly. A tailored personal travel loan covers advance flight reservations, visa proof of funds, luxury boutique stays, and foreign currency travel cards with transparent, fixed monthly installments.",
    benefits: [
      "Quick digital sanction ensures you never miss early-bird flight and hotel discounts",
      "Keeps emergency funds and liquid investments intact for unexpected family needs",
      "Shorter 1 to 3 year tenures ensure your vacation is fully paid before your next holiday",
      "Transparent fee structure with zero currency exchange markups or hidden clauses",
    ],
    smartTip:
      "Book flights and international accommodation 90 days in advance using your personal loan disbursal to save up to 35% on peak holiday travel rates.",
  },
];

export function LoanUseCasesSection({
  productSlug = "personal-loan",
  applyHref = "/eligibility-results?product=loan&loanType=personal-loan",
}: LoanUseCasesSectionProps) {
  return (
    <section
      id="life-goals"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="relative w-full bg-white py-16 sm:py-24 border-b border-gray-100"
      aria-label="Personal Loan for Every Life Goal"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-gray-950 leading-[1.15]">
            Personal Loan for Every{" "}
            <span className="bg-gradient-to-r from-[#6424C7] to-purple-600 bg-clip-text text-transparent font-normal">
              Life Goal
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-gray-600 font-normal leading-relaxed">
            Borrow with complete freedom. Unlike restrictive car or home purchase loans, Fintaraa personal loans carry zero end-use restrictions, allowing you to fund celebrations, emergencies, home upgrades, or career growth effortlessly up to ₹1 Crore.
          </p>
        </div>

        {/* Detailed One-by-One Presentation with High-Res Imagery (No Boxy Borders) */}
        <div className="space-y-20 sm:space-y-28">
          {useCasesDetailed.map((uc, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={uc.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-stretch ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Image Column (Equally aligned to textual content) */}
                <div
                  className={`lg:col-span-6 relative flex ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] overflow-hidden rounded-3xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.14)] bg-gray-100">
                    <Image
                      src={uc.image}
                      alt={uc.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    {/* Subtle aesthetic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

                    {/* Floating quick specs strip on image bottom */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white select-none">
                      <div>
                        <span className="block text-[10px] uppercase font-normal text-white/70 tracking-wider">
                          Max Amount
                        </span>
                        <span className="text-sm sm:text-base font-normal text-white">
                          {uc.amount}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-normal text-white/70 tracking-wider">
                          Starting Rate
                        </span>
                        <span className="text-sm sm:text-base font-normal text-yellow-300">
                          {uc.rate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial Content Column (Clean typography, detailed narrative, zero box borders) */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-center py-2 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-normal uppercase tracking-widest text-[#6424C7]">
                    <span>Life Goal {index + 1} of {useCasesDetailed.length}</span>
                    <span>•</span>
                    <span>{uc.title}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-gray-950 leading-snug">
                    {uc.headline}
                  </h3>

                  <p className="mt-4 text-[14.5px] sm:text-[15.5px] leading-relaxed text-gray-600 font-normal">
                    {uc.desc}
                  </p>

                  {/* Bulleted Advantages */}
                  <div className="mt-6 space-y-2.5">
                    {uc.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[13.5px] sm:text-[14px] text-gray-700 font-normal">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Link (Compact & elegant) */}
                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`${applyHref}&usecase=${uc.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6424C7] hover:bg-[#521eb0] text-white font-normal text-xs px-4 py-2.5 shadow-sm transition-all active:scale-98"
                    >
                      <span>Check Eligibility</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="text-xs text-gray-500 font-normal">
                      Instant Sanction in 24 Hrs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
