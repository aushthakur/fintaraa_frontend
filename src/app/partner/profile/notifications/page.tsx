import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { noIndexRobots } from "@/services/seoConfig";

export const metadata: Metadata = {
  title: "Partner Notifications",
  description: "Review partner lead, payout, document, and account alerts.",
  robots: noIndexRobots,
};

export default function PartnerNotificationsPage() {
  return (
    <main className="min-h-[70vh] bg-[#f4f7fa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto mb-4 max-w-5xl">
        <Link
          href="/partner/profile"
          className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#195585] no-underline hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to partner dashboard
        </Link>
      </div>
      <NotificationsPanel accountType="partner" />
    </main>
  );
}
