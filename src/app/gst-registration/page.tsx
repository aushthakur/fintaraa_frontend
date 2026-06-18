import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { GstPage } from "@/components/services/gst/GstPage";

const fallbackMetadata: Metadata = {
  title: "GST Registration & GST Filing | Fintaraa",
  description:
    "Get GST registration, GST filing, amendment, cancellation, reconciliation and compliance support with Fintaraa.",
  alternates: { canonical: "/gst-registration" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/gst-registration", fallbackMetadata);
}

export default function Page() {
  return <GstPage />;
}
