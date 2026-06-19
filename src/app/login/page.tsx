import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";

const fallbackMetadata: Metadata = {
  title: "Login or Create Account",
  description:
    "Login or create your Fintaraa account with secure OTP verification to manage your profile, applications, offers, documents, statements, and support tickets.",
  alternates: { canonical: "/login" },
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

export default function LoginRoute({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const isLoggedIn = getAuthType() === "user" && Boolean(getAuthToken());
  const redirectParam =
    typeof searchParams?.redirect === "string"
      ? searchParams.redirect
      : undefined;

  const redirectFromRef =
    typeof searchParams?.ref === "string" ? searchParams.ref : undefined;

  const redirectFromReferrer =
    typeof searchParams?.referrer === "string"
      ? searchParams.referrer
      : undefined;

  const effectiveRedirect =
    redirectParam || redirectFromRef || redirectFromReferrer;

  // Logged-in users should not land on login without a valid redirect/referrer.
  if (isLoggedIn && !effectiveRedirect) {
    return <LoginPage redirectParam="/account/profile" />;
  }

  return <LoginPage redirectParam={effectiveRedirect} />;
}
