import type { Metadata } from "next";
import { AccountProfilePage } from "@/components/account/AccountProfilePage";

export const metadata: Metadata = {
  title: "Profile & Settings",
  description:
    "Manage your Fintaraa profile, applications, offers, agents, documents, preferences, support, and legal policies.",
};

export default function ProfilePage() {
  return <AccountProfilePage />;
}
