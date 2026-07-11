import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { AboutPage } from "@/components/about/AboutPage";

const fallbackMetadata: Metadata = {
  title: "About Fintaraa",
  description:
    "Learn about Fintaraa, a unit of Xpertserve Services Pvt. Ltd., founded in 2016 to simplify loans with transparent, fast and personalised financial support.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/about-us", fallbackMetadata);
}

export default function Page() {
  return <AboutPage />;
}
