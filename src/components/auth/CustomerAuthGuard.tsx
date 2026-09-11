"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { isUserLoggedIn } from "@/hooks/authStorage";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";

const subscribeToAuth = (onStoreChange: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

export function CustomerAuthGuard({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo: string;
}) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(
    subscribeToAuth,
    isUserLoggedIn,
    () => false,
  );

  useEffect(() => {
    // During hydration the server snapshot is unauthenticated. Re-check the
    // browser session before redirecting so a valid local session is not sent
    // through a login loop on a direct visit to a protected route.
    if (!authenticated && !isUserLoggedIn()) {
      router.replace(buildLoginRedirectHref({ redirectTo }));
    }
  }, [authenticated, redirectTo, router]);

  if (!authenticated) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#f5f8fc] px-4">
        <div
          role="status"
          className="flex max-w-sm flex-col items-center rounded-3xl border border-[#dce7f1] bg-white px-8 py-9 text-center shadow-[0_18px_50px_rgba(16,44,69,0.08)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#5b21b6]">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[17px] font-extrabold text-[#3b0764]">
            Secure account area
          </p>
          <p className="mt-2 text-[13px] font-medium leading-6 text-[#667b8f]">
            Redirecting you to login before opening your profile.
          </p>
          <Loader2 className="mt-4 h-5 w-5 animate-spin text-[#5b21b6]" />
        </div>
      </main>
    );
  }

  return children;
}
