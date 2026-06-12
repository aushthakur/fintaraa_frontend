import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore open roles and career opportunities at Fintaraa.",
};

export default function Page() {
  return <CareersPage />;
}
