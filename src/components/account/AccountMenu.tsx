"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { clearAuthSession } from "@/hooks/authStorage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { accountMenuSections } from "@/data/accountProfile";
import { LogoutConfirmationModal } from "@/components/account/LogoutConfirmationModal";

export function AccountMenu({
  activeSlug,
  onNavigate,
}: {
  activeSlug?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { profile } = useCurrentUser();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    setConfirmLogoutOpen(false);
    router.replace("/");
  };

  return (
    <div className="grid gap-4">
      {accountMenuSections.map((section) => (
        <section key={section.title} className="bg-white/92 p-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#3b0764]">
            {section.title}
          </h2>
          <div className="mt-3 divide-y divide-[#edf2f7]">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = activeSlug === item.slug;
              const description =
                item.slug === "edit-profile"
                  ? `Profile completion: ${profile.completion.percent}%`
                  : item.description;
              const content = (
                <div
                  className={`group flex items-center gap-4 py-4 ${
                    active ? "text-[#3b0764]" : "text-[#07162d]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      item.action === "logout"
                        ? "bg-[#fff1f2] text-[#b91c1c]"
                        : active
                          ? "bg-[#3b0764] text-white"
                          : "bg-[#eef8ff] text-[#3b0764]"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[15px] font-extrabold ${
                        item.action === "logout" ? "text-[#b91c1c]" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[12px] font-medium leading-5 text-[#667085]">
                      {description}
                    </span>
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 ${
                      item.action === "logout"
                        ? "text-[#fecaca]"
                        : "text-[#98a2b3] group-hover:text-[#3b0764]"
                    }`}
                  />
                </div>
              );

              return item.action === "logout" ? (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setConfirmLogoutOpen(true)}
                  className="w-full text-left"
                >
                  {content}
                </button>
              ) : (
                <Link
                  key={item.slug}
                  href={`/account/profile/${item.slug}`}
                  onClick={onNavigate}
                  className="block no-underline"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
      <LogoutConfirmationModal
        open={confirmLogoutOpen}
        onClose={() => setConfirmLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
