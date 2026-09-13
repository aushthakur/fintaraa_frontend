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
} from "lucide-react";

interface LoanUseCasesSectionProps {
  productSlug?: string;
  applyHref?: string;
}

const useCases = [
  {
    id: "medical",
    title: "Medical Emergencies",
    icon: HeartPulse,
    tag: "Instant 24-Hr Disbursal",
    accent: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    image: "/assets/personal-loan/usecase-medical.jpg",
    amount: "Up to ₹25 Lakhs",
    tenure: "1 to 5 Years",
    desc: "Unplanned hospitalizations, surgeries, or medical treatments covered with immediate collateral-free financing.",
  },
  {
    id: "wedding",
    title: "Weddings & Celebrations",
    icon: Sparkles,
    tag: "Preserve Savings",
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    image: "/assets/personal-loan/usecase-wedding.jpg",
    amount: "Up to ₹40 Lakhs",
    tenure: "1 to 7 Years",
    desc: "Fund your dream wedding venue, jewelry, and celebrations without exhausting your family emergency funds.",
  },
  {
    id: "renovation",
    title: "Home Renovation & Decor",
    icon: Home,
    tag: "Flexible EMIs",
    accent: "#0ea5e9",
    bg: "rgba(14,165,233,0.12)",
    image: "/assets/personal-loan/usecase-home.jpg",
    amount: "Up to ₹30 Lakhs",
    tenure: "1 to 5 Years",
    desc: "Upgrade interiors, modular kitchen, furniture, or essential repairs with convenient monthly installment options.",
  },
  {
    id: "consolidation",
    title: "Debt Consolidation",
    icon: CreditCard,
    tag: "Save on Interest",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    image: "/assets/personal-loan/usecase-debt.jpg",
    amount: "Up to ₹40 Lakhs",
    tenure: "1 to 7 Years",
    desc: "Merge multiple high-interest credit card dues and outstanding loans into a single low 10.49% manageable EMI.",
  },
  {
    id: "travel",
    title: "Travel & Vacations",
    icon: Plane,
    tag: "Quick Approval",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    image: "/assets/personal-loan/usecase-travel.jpg",
    amount: "Up to ₹10 Lakhs",
    tenure: "1 to 3 Years",
    desc: "Book international vacations, luxury honeymoons, and family getaways without postponing life's memorable moments.",
  },
  {
    id: "education",
    title: "Higher Studies & Upskilling",
    icon: GraduationCap,
    tag: "Career Growth",
    accent: "#6424C7",
    bg: "rgba(100,36,199,0.12)",
    image: "/assets/personal-loan/usecase-education.jpg",
    amount: "Up to ₹20 Lakhs",
    tenure: "1 to 5 Years",
    desc: "Finance certifications, coding bootcamps, executive MBAs, or overseas application fees with zero stress.",
  },
];

export function LoanUseCasesSection({
  productSlug = "personal-loan",
  applyHref = "/eligibility-results?product=loan&loanType=personal-loan",
}: LoanUseCasesSectionProps) {
  return (
    <section
      id="loan-use-cases"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#fafbfe] to-white py-14 sm:py-20"
      aria-label="Personal Loan Use Cases"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 xl:px-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-tight text-gray-900 leading-tight">
            Personal Loan for Every <span style={{ color: "#6424C7" }}>Life Goal</span>
          </h2>
          <p className="mt-3 text-[14.5px] sm:text-[16px] text-gray-500 font-normal max-w-xl mx-auto leading-relaxed">
            No end-use restrictions. Fast, collateral-free financial backing tailored for your milestone moments.
          </p>
        </div>

        {/* 6 Image-Based Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#6424C7]/40 hover:shadow-[0_20px_40px_-10px_rgba(100,36,199,0.18)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Photo Header with Floating Pill & Icon */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={uc.image}
                      alt={uc.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    {/* Subtle gradient vignette for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

                    {/* Tag badge on top-right */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white border border-white/20 shadow-sm">
                        {uc.tag}
                      </span>
                    </div>

                    {/* Circular Icon on bottom-left */}
                    <div className="absolute bottom-3.5 left-4 flex items-center gap-2.5">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 backdrop-blur-md shadow-md transition-transform duration-300 group-hover:scale-110"
                      >
                        <Icon className="h-5 w-5" style={{ color: uc.accent }} />
                      </div>
                      <span className="text-white font-bold text-[17px] tracking-tight drop-shadow-md">
                        {uc.title}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <p className="text-[13.5px] leading-relaxed text-gray-600 font-normal min-h-[42px]">
                      {uc.desc}
                    </p>

                    {/* Benchmarks strip */}
                    <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-gray-50/90 border border-gray-100 p-3 select-none">
                      <div>
                        <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Amount
                        </span>
                        <span className="text-[13.5px] font-bold text-gray-900">
                          {uc.amount}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Tenure
                        </span>
                        <span className="text-[13.5px] font-bold text-gray-900">
                          {uc.tenure}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                  <Link
                    href={`${applyHref}&usecase=${uc.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-[13px] font-semibold transition-all duration-200 border border-purple-200/90 bg-purple-50/50 text-[#6424C7] hover:bg-[#6424C7] hover:text-white hover:border-[#6424C7] shadow-2xs group-hover:shadow-md cursor-pointer"
                  >
                    <span>Apply for this Goal</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
