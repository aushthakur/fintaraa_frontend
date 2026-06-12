import type { Metadata } from "next";
import { ApplicationStatusPage } from "@/components/application-status/ApplicationStatusPage";

export const metadata: Metadata = {
  title: "My Application Status",
  description:
    "Track loan, insurance, and credit card application status with Fintaraa.",
};

export default function Page() {
  return <ApplicationStatusPage />;
}
