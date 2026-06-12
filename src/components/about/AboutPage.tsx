import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { AboutHero } from "./AboutHero";
import { AboutVision } from "./AboutVision";

export function AboutPage() {
  return (
    <main className="bg-white">
      <AboutHero />
      <AboutVision />
      <AppDownloadBanner />
    </main>
  );
}
