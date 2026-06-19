import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Login or Create Account",
  description:
    "Login or create your Fintaraa account with secure OTP verification to manage your profile, applications, offers, documents, statements, and support tickets.",
  alternates: { canonical: "/login" },
  robots: noIndexRobots,
  openGraph: {
    title: "Login or Create Account | Fintaraa",
    description:
      "Secure OTP-based access to your Fintaraa financial marketplace account.",
    url: "/login",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/login", fallbackMetadata);
}

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function LoginRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const redirectParam =
    firstParam(params.redirect) ||
    firstParam(params.referrer) ||
    firstParam(params.returnTo);

  return <LoginPage redirectParam={redirectParam} />;
}
