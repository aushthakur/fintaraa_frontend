"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Sparkles,
  Calculator,
  User,
  ShieldCheck,
} from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";

import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { useAuthModal } from "@/context/AuthModalContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openAuthModal } = useAuthModal();

  // Hide on full-screen account profile / edit screens or wizard forms if needed
  const isExcluded =
    pathname.startsWith("/apply/") ||
    pathname.startsWith("/partner/onboarding");

  if (isExcluded) return null;

  const isAuthenticated = Boolean(getAuthToken() && getAuthType() === "user");

  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      id: "products",
      label: "Products",
      href: "/products",
      icon: Layers,
      isActive:
        pathname.startsWith("/products") ||
        pathname.startsWith("/credit-cards") ||
        pathname.startsWith("/insurance"),
    },
    {
      id: "apply",
      label: "Apply",
      href: "/apply",
      icon: Sparkles,
      isCenter: true,
      isActive: pathname === "/apply",
    },
    {
      id: "calculators",
      label: "Calculate",
      href: "/calculators",
      icon: Calculator,
      isActive: pathname.startsWith("/calculators"),
    },
    {
      id: "account",
      label: "Account",
      href: "/account/profile",
      icon: User,
      isActive: pathname.startsWith("/account") || pathname.startsWith("/application-status"),
      requiresAuth: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100 shadow-[0_-4px_24px_rgba(91,33,182,0.08)] pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] pt-1.5 px-2"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative -mt-5 flex flex-col items-center justify-center no-underline"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B21B6] via-[#7C3AED] to-[#9333EA] text-white shadow-[0_6px_20px_rgba(91,33,182,0.40)] transition-transform duration-200 group-hover:scale-105 active:scale-95 border-2 border-white">
                  <Icon className="h-5 w-5 animate-pulse" />
                </div>
                <span className="mt-1 text-[10px] font-semibold text-[#5B21B6]">
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.requiresAuth && !isAuthenticated) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openAuthModal("user", "/account/profile")}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors duration-150 ${
                  item.isActive
                    ? "text-[#5B21B6]"
                    : "text-slate-500 hover:text-slate-900 active:text-[#5B21B6]"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`h-5 w-5 transition-transform ${
                      item.isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.6]"
                    }`}
                  />
                  {item.isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#5B21B6]" />
                  )}
                </div>
                <span
                  className={`mt-1 text-[10.5px] leading-tight ${
                    item.isActive ? "font-semibold text-[#5B21B6]" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors duration-150 no-underline ${
                item.isActive
                  ? "text-[#5B21B6]"
                  : "text-slate-500 hover:text-slate-900 active:text-[#5B21B6]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    item.isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.6]"
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#5B21B6]" />
                )}
              </div>
              <span
                className={`mt-1 text-[10.5px] leading-tight ${
                  item.isActive ? "font-semibold text-[#5B21B6]" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
