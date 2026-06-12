import type { Metadata } from "next";
import { CibilScorePage } from "@/components/cibil/CibilScorePage";

export const metadata: Metadata = {
  title: "Free CIBIL Score & Report",
  description:
    "Check your free credit score and CIBIL report with Fintaraa.",
};

export default function Page() {
  return <CibilScorePage />;
}
