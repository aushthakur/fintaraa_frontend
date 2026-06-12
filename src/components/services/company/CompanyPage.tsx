import { AppDownloadBanner } from "@/components/common/layout/Footer";
import {
  ServiceStatusCard,
  ServiceTimeline,
} from "@/components/services/shared/ServiceShared";
import { DsaWhyChoose } from "@/components/dsa/DsaWhyChoose";
import { CompanyHero } from "./CompanyHero";

function ApplicationDetails() {
  return (
    <section className="px-4 pb-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#d7dfe8] bg-white p-9">
        <h2 className="text-[24px] font-black text-[#2a2f36]">
          Your Application Details
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            ["Application ID", "A124DHA324HUD"],
            ["Assigned Expert", "Puneet"],
            ["Current Status", "Document In Process"],
            ["Last Update", "24 May, 2026"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[12px] font-semibold text-[#a0a7b2]">
                {label}
              </p>
              <p className="mt-2 text-[14px] font-black text-[#111827]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyPage() {
  return (
    <main className="bg-white">
      <CompanyHero />
      <DsaWhyChoose />
      <ServiceStatusCard
        title="Track Your Inquiry Status"
        idLabel="Inquiry ID"
      />
      <ApplicationDetails />
      <ServiceTimeline title="Track Your Application Status" />
      <AppDownloadBanner />
    </main>
  );
}
