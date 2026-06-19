import Image from "next/image";
import Link from "next/link";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { slugifyProduct } from "@/lib/productRouting";

const loanOffers = [
  {
    bankName: "HDFC Bank",
    subtitle: "Personal Loan",
    logo: "/assets/banks/hdfc.png",
    amount: "Up to ₹40 Lakh",
    interestRate: "10.49%",
  },
  {
    bankName: "ICICI Bank",
    subtitle: "Personal Loan",
    logo: "/assets/banks/icici.png",
    amount: "Up to ₹35 Lakh",
    interestRate: "10.65%",
  },
  {
    bankName: "Kotak",
    subtitle: "Personal Loan",
    logo: "/assets/banks/kotak.png",
    amount: "Up to ₹30 Lakh",
    interestRate: "11.25%",
  },
];

export function CibilEligibleOffers({ score = 782 }: { score?: number }) {
  return (
    <section className="bg-[#f7faff] px-4 py-10 md:px-6 lg:px-8  font-sans">
      <div className="mx-auto w-full max-w-9xl">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[28px] font-bold text-[#2d3142]">
              Loans You Are Eligible For
            </h2>
            <p className="mt-1 text-[15px] text-[#7c8293]">
              Based on your CIBIL Score of{" "}
              <span className="font-semibold text-[#4a5060]">{score}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-start sm:self-center">
           
            <div className="bg-white border border-[#e2e8f0] text-[#13a653] font-medium text-[13px] px-4 py-2 rounded-md shadow-sm">
              High Approval Chances
            </div>
          </div>
        </div>

        {/* Tab Navigation Headers */}
        <div className="mb-4 flex gap-8 border-b border-[#dce4ec] pb-0 overflow-x-auto md:gap-12">
          <button className="text-[#005ca8] font-bold text-[14px] md:text-[15px] pb-3 border-b-4 border-[#005ca8] whitespace-nowrap">
            Personal Loan
          </button>
          <button className="text-[#005ca8] font-medium text-[14px] md:text-[15px] pb-3 whitespace-nowrap opacity-80 hover:opacity-100">
            Home Loan
          </button>
          <button className="text-[#005ca8] font-medium text-[14px] md:text-[15px] pb-3 whitespace-nowrap opacity-80 hover:opacity-100">
            Car Loan
          </button>
          <button className="text-[#005ca8] font-medium text-[14px] md:text-[15px] pb-3 whitespace-nowrap opacity-80 hover:opacity-100">
            Credit Card
          </button>
        </div>

        {/* Offer Rows Container */}
        <div className="divide-y divide-[#e5eaf0] rounded-lg">
          {loanOffers.map((offer) => {
            const applyHref = getApplyHref({
              category: "loan",
              productSlug: "personal-loan",
              bankSlug: slugifyProduct(offer.bankName),
              referrer: "/cibil-score/report",
            });

            return (
            <div 
              key={offer.bankName} 
              className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 p-5 sm:p-6 text-left"
            >
              {/* Column 1: Bank Brand Identity */}
              <div className="flex flex-col gap-1">
                <div className="relative w-28 h-8">
                  <Image
                    src={offer.logo}
                    alt={offer.bankName}
                    fill
                    sizes="112px"
                    className="object-contain object-left"
                  />
                </div>
                <span className="text-[12px] text-[#7c8293] font-medium mt-0.5">
                  {offer.subtitle}
                </span>
              </div>

              {/* Column 2: Loan Value Limit */}
              <div className="text-[14px] font-bold text-[#2d3142] sm:text-left">
                {offer.amount}
              </div>

              {/* Column 3: Rate Info */}
              <div className="text-[13px] text-[#7c8293]">
                <div className="text-[12px] text-[#9099a8]">Interest Rate</div>
                <div>
                  <span className="font-bold text-[#2d3142] text-[14px]">{offer.interestRate}</span>
                  <span className="text-[12px] text-[#667085] ml-1">p.a. onwards</span>
                </div>
              </div>

              {/* Column 4: CTAs */}
              <div className="sm:text-right">
                <AuthRedirectLink
                  href={applyHref}
                  productSlug="personal-loan"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] hover:brightness-110 transition-all w-full sm:w-auto px-6 py-2.5 text-[13px] font-bold text-white tracking-wide whitespace-nowrap"
                >
                  Apply Now <span className="ml-2">→</span>
                </AuthRedirectLink>
              </div>
            </div>
            );
          })}
        </div>

        {/* View More Trigger */}
        <div className="mt-5 text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#005ca8] hover:underline"
          >
            View more loan offers 
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
              <path d="M1 1L5 5L9 1" stroke="#005ca8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Bottom Alert/Help Banner Section */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#d6e6f7] bg-[#eef6ff] p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            {/* Informational Blue Circle Icon */}
            <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full border border-[#005ca8] text-[#005ca8] flex items-center justify-center text-[10px] font-bold">
              i
            </div>
            <p className="text-[12px] md:text-[13px] text-[#42526e] leading-normal font-medium">
              You will receive SMS, WhatsApp & push notifications on your registered mobile number at every status update.
            </p>
          </div>
          <button className="shrink-0 bg-white border border-[#0fae5e] text-[#0fae5e] hover:bg-[#f3faf6] transition-colors font-medium text-[13px] px-5 py-2 rounded-full shadow-xs">
            Need help? Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}
