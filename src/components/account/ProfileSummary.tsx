"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AlertCircle, Camera, Edit3, Smartphone } from "lucide-react";

export function ProfileSummary() {
  const { profile, loading } = useCurrentUser();
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="bg-white px-5 py-5">
      <div className="flex gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-[#195585] to-[#12b76a] text-[24px] font-black text-white">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={profile.name}
              src={profile.avatar}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            initials
          )}
          <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#195585] text-white">
            <Camera className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] font-black leading-tight text-[#07162d]">
              {loading && profile.name === "Guest User"
                ? "Loading..."
                : profile.name}
            </h1>
            <Link
              href="/account/profile/edit-profile"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-[#eef8ff] px-3 text-[12px] font-black text-[#195585] no-underline"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </div>

          <p className="mt-2 text-[12px] font-black text-[#195585]">
            Profile {profile.completion.percent}% complete
          </p>
          <div className="mt-2 h-2 max-w-sm overflow-hidden rounded-full bg-[#e4edf5]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#195585] to-[#12b76a]"
              style={{ width: `${profile.completion.percent}%` }}
            />
          </div>
          <p className="mt-3 text-[12px] font-semibold text-[#667085]">
            Customer ID: {profile.customerId}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#667085]">
            Mail ID: {profile.email}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/account/profile/edit-profile"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#fff7ed] px-4 text-[12px] font-black text-[#f97316] no-underline"
        >
          <AlertCircle className="h-4 w-4" />
          {profile.kycStatus}
        </Link>
        <span className="inline-flex h-9 items-center gap-2 rounded-full bg-[#eef8ff] px-4 text-[12px] font-black text-[#195585]">
          <Smartphone className="h-4 w-4" />
          {profile.mobile}
        </span>
      </div>
    </section>
  );
}
