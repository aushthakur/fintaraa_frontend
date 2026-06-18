import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accountItemBySlug } from "@/data/accountProfile";
import { AccountProfilePage } from "@/components/account/AccountProfilePage";
import { getPageSeoMetadata } from "@/services/seoMetadata";

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

  return getPageSeoMetadata(`/account/profile/${section}`, {
    title: `${item.label} | Profile & Settings`,
    description: item.description,
  });
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
