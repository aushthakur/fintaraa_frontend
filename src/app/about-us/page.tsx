import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { AboutPage } from "@/components/about/AboutPage";

const fallbackMetadata: Metadata = {
  title: "About Fintaraa",
  description:
    "Learn about Fintaraa, our vision, and how we help customers compare financial products.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/about-us", fallbackMetadata);
}

export default function Page() {
  return <AboutPage />;
}
