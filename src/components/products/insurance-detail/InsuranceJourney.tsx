import { CircleCheck, HeartPulse } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";

interface InsuranceJourneyProps {
  insuranceTypeSlug: string;
}

const journeySteps = [
  "Check Premium",
  "Choose Plan",
  "Fill Personal Details",
  "Upload Documents",
  "Review Selection",
  "Policy Issuance",
];

export function InsuranceJourney({ insuranceTypeSlug }: InsuranceJourneyProps) {
  const applyHref = getApplyHref({
    category: "insurance",
    productSlug: insuranceTypeSlug,
    referrer: `/products/${insuranceTypeSlug}`,
  });

  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-8 bg-[#edf6ff] p-8 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <h2 className="text-[24px] font-extrabold text-[#4c1d95]">
            Your Journey to
            <span className="block text-[#111827]">Financial Protection</span>
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-[#344054]">
            Compare, choose, and continue your insurance enquiry through a
            guided digital flow.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {journeySteps.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 text-[12px] font-extrabold text-[#4c1d95]"
              >
                <CircleCheck className="h-4 w-4" />
                {item}
              </span>
            ))}
          </div>
          <AuthRedirectLink
            href={applyHref}
            productSlug={insuranceTypeSlug}
            className="mt-6 inline-flex h-10 items-center justify-center bg-[#4c1d95] px-5 text-[12px] font-extrabold text-white no-underline"
          >
            Start Your Application Now
          </AuthRedirectLink>
        </div>
        <div className="rounded bg-white p-5 shadow-[0_18px_40px_rgba(0,92,168,0.12)]">
          <div className="mb-4 flex items-center gap-2 text-[12px] font-extrabold text-[#4c1d95]">
            <HeartPulse className="h-5 w-5" />
            Medical Details
          </div>
          <div className="grid gap-3">
            <div className="h-12 rounded bg-[#f1f5f9]" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded bg-[#f1f5f9]" />
              <div className="h-16 rounded bg-[#f1f5f9]" />
            </div>
            <div className="h-10 rounded bg-[#4c1d95]" />
          </div>
        </div>
      </div>
    </section>
  );
}
