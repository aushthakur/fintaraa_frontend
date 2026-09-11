import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { PartnerLeadForm } from "@/components/services/shared/PartnerLeadForm";
import { franchiseBenefits, partnerBenefits } from "./franchiseData";

export function FranchiseBenefits() {
  return (
    <section className="px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        {/* Section heading */}
        <h2 className="text-[22px] font-bold text-[#222222]">
          What You Get with Fintaraa Franchise
        </h2>

        {/* 8 benefit cards – 4 per row on desktop */}
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {franchiseBenefits.map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-[#d9e2ec] bg-white p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ff] text-[#4c1d95]">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[13px] font-extrabold text-[#111827]">
                  {title}
                </span>
                <span className="mt-1 block text-[11px] font-semibold leading-5 text-[#667085]">
                  {text}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Registration form + Benefits sidebar */}
        <div
          id="franchise-form"
          className="mt-8 grid gap-6 rounded-2xl border border-[#d9e2ec] bg-white p-6 shadow-[0_12px_35px_rgba(16,24,40,0.06)] lg:grid-cols-[1fr_22rem]"
        >
          {/* Form */}
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827]">
              Request Franchise Information
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#667085]">
              Fill the form below and our partnership team will contact you
              shortly.
            </p>

            <div className="mt-5">
              <PartnerLeadForm
                serviceType="franchise_partner"
                source="website_franchise_page"
                submitLabel="Apply For Franchise"
                successTitle="Thank you! Your franchise request has been submitted."
                successMessage="We have generated your franchise query ID. Our partnership team will review your location and contact you."
                primarySelectLabel="Investment Range"
                primarySelectPlaceholder="Select investment range"
                primaryOptions={[
                  "Below ₹2 lakh",
                  "₹2 lakh - ₹5 lakh",
                  "₹5 lakh - ₹10 lakh",
                  "Above ₹10 lakh",
                ]}
                secondarySelectLabel="Preferred Setup"
                secondarySelectPlaceholder="Select preferred setup"
                secondaryOptions={[
                  "Existing office",
                  "New office",
                  "Retail shop",
                  "Co-working space",
                  "Need guidance",
                ]}
              />
            </div>
          </div>

          {/* Benefits aside */}
          <aside className="rounded-xl bg-[#e8f4ff] p-5">
            <h3 className="text-[18px] font-extrabold text-[#111827]">
              Benefits You Get
            </h3>
            <div className="mt-4 grid gap-3">
              {partnerBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-[13px] font-semibold text-[#344054]"
                >
                  <CircleCheck className="h-4 w-4 shrink-0 text-[#4c1d95]" />
                  {benefit}
                </div>
              ))}
            </div>
            <div className="relative mt-6 min-h-44">
              <Image
                src="/assets/images/handshake.png"
                alt="Franchise partnership"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
