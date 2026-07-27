import type { Metadata } from "next";
import { PartnerLoginPage } from "@/components/partner/PartnerLoginPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Channel Partner Login",
  description:
    "Login or register for the Fintaraa partner workspace with secure OTP verification.",
  alternates: { canonical: "/partner/login" },
  robots: noIndexRobots,
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/partner/login", fallbackMetadata);
}

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PartnerLoginRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const redirectParam =
    firstParam(params.redirect) ||
    firstParam(params.referrer) ||
    firstParam(params.returnTo);

  return <PartnerLoginPage redirectParam={redirectParam} />;
}
