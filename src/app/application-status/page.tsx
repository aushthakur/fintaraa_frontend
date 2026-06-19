import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { ApplicationStatusPage } from "@/components/application-status/ApplicationStatusPage";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "My Application Status",
  description:
    "Track loan, insurance, and credit card application status with Fintaraa.",
  robots: noIndexRobots,
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/application-status", fallbackMetadata);
}

export default function Page() {
  return <ApplicationStatusPage />;
}
