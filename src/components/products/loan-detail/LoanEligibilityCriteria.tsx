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
          : "border border-[#e2edf8] bg-[#fbfdff] p-5 sm:p-6"
      }
    >
      {!embedded ? (
        <div className="max-w-3xl">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#00529b]">
          Applicant fit
        </p>
        <h2 className="mt-2 text-[24px] font-extrabold text-[#111827]">
          Eligibility <span className="text-[#13a653]">Criteria</span>
        </h2>
        <p className="mt-3 text-[14px] font-semibold leading-7 text-[#2f3744]">
          Eligibility depends on profile quality, income, documents, credit
          history, and partner policy.
        </p>
        </div>
      ) : null}

      <div className={`${embedded ? "" : "mt-5"} grid gap-3 md:grid-cols-2`}>
        {eligibilityItems.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="flex gap-3 rounded-2xl border border-[#dfe8ef] bg-white p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f6ff] text-[#00529b]">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <h3 className="text-[14px] font-extrabold text-[#111827]">
                {title}
              </h3>
              <p className="mt-1 text-[13px] font-semibold leading-6 text-[#596579]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
