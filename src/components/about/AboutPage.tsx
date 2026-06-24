import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { AboutDetails } from "./AboutDetails";
import { AboutHero } from "./AboutHero";
import { AboutVision } from "./AboutVision";

export function AboutPage() {
  return (
    <main className="bg-white">
      <AboutHero />
      <AboutDetails />
      <AboutVision />
      <AppDownloadBanner />
    </main>
  );
}
