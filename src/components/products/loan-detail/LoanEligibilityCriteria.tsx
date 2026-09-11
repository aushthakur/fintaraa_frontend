import {
  BadgeCheck,
  CircleCheck,
  Landmark,
  MapPin,
  WalletCards,
} from "lucide-react";

const eligibilityItems = [
  {
    title: "Age",
    description: "Age should generally be 21 years or above.",
    icon: BadgeCheck,
  },
  {
    title: "Income",
    description: "Stable monthly income or business cash flow is required.",
    icon: WalletCards,
  },
  {
    title: "KYC match",
    description:
      "PAN, Aadhaar, mobile number, and address details should match.",
    icon: CircleCheck,
  },
  {
    title: "Credit history",
    description: "Credit score and repayment history can influence approval.",
    icon: Landmark,
  },
  {
    title: "Location fit",
    description: "Serviceability may vary by state, city, pincode, and area.",
    icon: MapPin,
  },
];

export function LoanEligibilityCriteria({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  return (
    <section
      className={
        embedded
          ? ""
          : "rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs"
      }
    >
      {!embedded ? (
        <div className="max-w-3xl mb-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5b21b6]">
            Applicant fit
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900">
            Eligibility <span className="text-[#5b21b6]">Criteria</span>
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            Eligibility depends on profile quality, income, documents, credit
            history, and partner policy.
          </p>
        </div>
      ) : null}

      <div className={`${embedded ? "" : "mt-6"} grid gap-3.5 sm:grid-cols-2`}>
        {eligibilityItems.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-all hover:border-purple-200 hover:shadow-xs"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5b21b6] border border-purple-100/60">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] font-medium leading-relaxed text-slate-500">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
