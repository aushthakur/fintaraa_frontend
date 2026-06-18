import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CareersPage } from "@/components/careers/CareersPage";

const fallbackMetadata: Metadata = {
  title: "Careers",
  description:
    "Explore open roles and career opportunities at Fintaraa.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/careers", fallbackMetadata);
}

export default function Page() {
  return <CareersPage />;
}
