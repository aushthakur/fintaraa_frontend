"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, PhoneCall } from "lucide-react";
import { isUserLoggedIn } from "@/hooks/authStorage";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import { CALL_PHONE, WHATSAPP_PHONE } from "@/data/company";

const subscribeToAuth = (onStoreChange: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

export function MobileActionBar() {
  const pathname = usePathname();
  const userLoggedIn = useSyncExternalStore(
    subscribeToAuth,
    isUserLoggedIn,
    () => true,
  );
  const isAccountProfile =
    pathname === "/account/profile" ||
    pathname.startsWith("/account/profile/");
  const hasCardApplyBar =
    pathname.startsWith("/credit-card/") ||
    pathname.startsWith("/credit-cards/");

  if (isAccountProfile && userLoggedIn) return null;

  return (
    <nav
      aria-label="Quick contact actions"
      className={`pointer-events-none fixed inset-x-0 z-50 flex items-end justify-between px-4 sm:px-8 ${
        hasCardApplyBar ? "bottom-20 lg:bottom-8" : "bottom-5 sm:bottom-8"
      }`}
    >
      <a
        href={CALL_PHONE.href}
        aria-label="Call Fintaraa"
        className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(135deg,#075cde_0%,#063e99_100%)] text-white no-underline shadow-[0_12px_34px_rgba(7,92,222,0.38)] transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075cde] sm:h-auto sm:w-auto sm:gap-3 sm:px-5 sm:py-2.5"
      >
        <span className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-[#075cde]/35 blur-[2px] motion-reduce:animate-none" />
        <PhoneCall className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="hidden text-left text-[13px] font-bold leading-tight sm:block">
          Call us
          <span className="block text-[11px] font-semibold text-white/82">
            Talk to an expert
          </span>
        </span>
      </a>

      <a
        href={`${WHATSAPP_PHONE.href}?text=Hi%20Fintaraa%20team!%20I%20need%20help%20choosing%20a%20financial%20product.`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Fintaraa on WhatsApp"
        className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(135deg,#25D366_0%,#128C4B_100%)] text-white no-underline shadow-[0_12px_34px_rgba(18,140,75,0.38)] transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ebe5a] sm:h-auto sm:w-auto sm:gap-3 sm:px-5 sm:py-2.5"
      >
        <span className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-[#25D366]/35 blur-[2px] motion-reduce:animate-none" />
        <MessageCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="hidden text-left text-[13px] font-bold leading-tight sm:block">
          WhatsApp
          <span className="block text-[11px] font-semibold text-white/82">
            Chat with us
          </span>
        </span>
      </a>
    </nav>
  );
}
