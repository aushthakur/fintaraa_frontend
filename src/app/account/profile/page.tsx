import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Profile & Settings",
  description:
    "Manage your Fintaraa profile, applications, offers, documents, and preferences.",
  robots: noIndexRobots,
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/account/profile", fallbackMetadata);
}

export default function ProfilePage() {
  redirect("/account/profile/overview");
}
