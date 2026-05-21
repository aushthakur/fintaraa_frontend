import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
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

export default function LoginRoute() {
  return <LoginPage />;
}
