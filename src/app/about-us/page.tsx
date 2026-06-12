import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About Fintaraa",
  description:
    "Learn about Fintaraa, our vision, and how we help customers compare financial products.",
};

export default function Page() {
  return <AboutPage />;
}
