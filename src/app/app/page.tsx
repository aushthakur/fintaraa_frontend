import type { Metadata } from "next";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Download Fintaraa App",
  description:
    "Download the Fintaraa app to track applications, credit score, documents, offers, and financial services.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/app", fallbackMetadata);
}

export default function AppDownloadPage() {
  return (
    <main className="bg-white px-4 py-12 md:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl text-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#005ca8]">
          Mobile app
        </p>
        <h1 className="mt-4 text-[36px] font-extrabold tracking-[-0.02em] text-[#111827] md:text-[48px]">
          Manage your Fintaraa journey anywhere
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] font-semibold leading-8 text-[#667085]">
          Track your applications, documents, credit score, offers, and support
          from one place.
        </p>
      </section>
      <AppDownloadBanner />
    </main>
  );
}
