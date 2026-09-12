"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/layout/Navbar";
import Footer from "@/components/common/layout/Footer";
import { SiteBreadcrumbs } from "@/components/common/layout/SiteBreadcrumbs";
import { MobileActionBar } from "@/components/common/layout/MobileActionBar";
import { ResponsiveTableEnhancer } from "@/components/common/layout/ResponsiveTableEnhancer";
import { PageSeoSchema } from "@/components/seo/PageSeoSchema";
import { PersonalLoanRateTicker } from "@/components/common/layout/PersonalLoanRateTicker";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/account/profile" ||
    pathname.startsWith("/account/profile/") ||
    pathname === "/partner/profile" ||
    pathname.startsWith("/partner/profile/");
  const stickyServicePages = new Set([
    "/gst-registration",
    "/itr-filing",
    "/company-registration",
    "/annual-compliance",
    "/tax-compliance",
    "/msme-registration",
    "/project-report",
  ]);
  const allowStickyContent =
    pathname.startsWith("/products/") ||
    pathname.startsWith("/credit-card/") ||
    pathname.startsWith("/credit-cards/") ||
    stickyServicePages.has(pathname);

  return (
    <>
      <Navbar />
      <SiteBreadcrumbs />
      <ResponsiveTableEnhancer />
      <PageSeoSchema />
      <div>
        <div
          className={
            hideFooter
              ? "flex-1 overflow-hidden"
              : allowStickyContent
                ? "min-h-screen"
                : "min-h-screen overflow-hidden"
          }
        >
          {children}
        </div>
        {!hideFooter && <Footer />}
      </div>
      <PersonalLoanRateTicker />
      {!hideFooter && <MobileActionBar />}
    </>
  );
}
