import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountProfilePage } from "@/components/account/AccountProfilePage";
import { accountItemBySlug } from "@/data/accountProfile";

type PageProps = {
  params: Promise<{ section: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section } = await params;
  const item = accountItemBySlug[section];
  if (!item || item.action === "logout") {
    return {};
  }

  return {
    title: `${item.label} | Profile & Settings`,
    description: item.description,
  };
}

export async function generateStaticParams() {
  return Object.values(accountItemBySlug)
    .filter((item) => item.action !== "logout")
    .map((item) => ({ section: item.slug }));
}

export default async function AccountSectionPage({ params }: PageProps) {
  const { section } = await params;
  const item = accountItemBySlug[section];

  if (!item || item.action === "logout") {
    notFound();
  }

  return <AccountProfilePage activeSlug={section} />;
}
