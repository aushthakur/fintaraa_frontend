import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { LoginPage } from "@/components/auth/LoginPage";

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

export default function LoginRoute() {
  return <LoginPage />;
}
