"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/layout/Navbar";
import Footer from "@/components/common/layout/Footer";
import { SiteBreadcrumbs } from "@/components/common/layout/SiteBreadcrumbs";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/account/profile" || pathname.startsWith("/account/profile/");
  const allowStickyContent = pathname.startsWith("/products/");

  return (
    <>
      <Navbar />
      <SiteBreadcrumbs />
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
    </>
  );
}
