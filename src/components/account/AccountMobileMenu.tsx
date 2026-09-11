"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { accountItemBySlug } from "@/data/accountProfile";
import { AccountMenu } from "./AccountMenu";
import { ProfileSummary } from "./ProfileSummary";

export function AccountMobileMenu({ activeSlug }: { activeSlug?: string }) {
  const [open, setOpen] = useState(false);
  const activeLabel = accountItemBySlug[activeSlug || ""]?.label || "My Account";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="bg-white px-4 py-3 xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="account-mobile-navigation"
        aria-label={`Open account menu. Current section: ${activeLabel}`}
        className="flex w-full items-center gap-3 rounded-xl border border-[#dce7ef] bg-[#f7fbff] p-3 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3b0764] text-white">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#718397]">
            Account menu
          </span>
          <span className="mt-0.5 block truncate text-[14px] font-extrabold text-[#07162d]">
            {activeLabel}
          </span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#3b0764]">
          Open
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>

      {open ? (
        <div
          id="account-mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Account navigation"
          className="fixed inset-0 z-[80] xl:hidden"
        >
          <button
            type="button"
            aria-label="Close account navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#07162d]/50 backdrop-blur-[2px]"
          />
          <aside className="absolute inset-y-0 left-0 w-[min(90vw,24rem)] overflow-y-auto bg-white shadow-[18px_0_48px_rgba(7,22,45,0.2)] scrollbar-thin">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e4edf5] bg-white/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#718397]">
                  Fintaraa account
                </p>
                <p className="mt-0.5 text-[17px] font-extrabold text-[#07162d]">
                  Navigation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close account menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef8ff] text-[#3b0764]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ProfileSummary />
            <div className="pb-5">
              <AccountMenu
                activeSlug={activeSlug}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
