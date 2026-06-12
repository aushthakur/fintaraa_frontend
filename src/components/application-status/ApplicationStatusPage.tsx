import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { ApplicationDetailCard } from "./ApplicationDetailCard";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { StatusHero } from "./StatusHero";

export function ApplicationStatusPage() {
  return (
    <main className="bg-white">
      <StatusHero />
      <ApplicationDetailCard />
      <ApplicationTimeline />
      <AppDownloadBanner />
    </main>
  );
}
