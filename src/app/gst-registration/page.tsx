import type { Metadata } from "next";
import { GstPage } from "@/components/services/gst/GstPage";

export const metadata: Metadata = {
  title: "GST Registration & GST Filing | Fintaraa",
  description:
    "Get GST registration, GST filing, amendment, cancellation, reconciliation and compliance support with Fintaraa.",
  alternates: { canonical: "/gst-registration" },
};

export default function Page() {
  return <GstPage />;
}
