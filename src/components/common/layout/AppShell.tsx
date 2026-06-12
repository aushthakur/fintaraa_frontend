"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/layout/Navbar";
import Footer from "@/components/common/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/account/profile" || pathname.startsWith("/account/profile/");

  return (
    <>
      <Navbar />
      <div
        className={
          hideFooter ? "flex-1 overflow-hidden" : "min-h-screen overflow-hidden"
        }
      >
        {children}
      </div>
      {!hideFooter && <Footer />}
    </>
  );
}
