"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { emitAuthChanged } from "@/lib/authEvents";
import {
  fetchCurrentUser,
  updateUserProfilePhoto,
  type CurrentUser,
} from "@/services/profile";
import {
  AlertCircle,
  Camera,
  Edit3,
  Loader2,
  Smartphone,
} from "lucide-react";

const stringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getAvatarUrl = (user: CurrentUser | null) =>
  stringValue(user?.avatar) ||
  stringValue(user?.profilePictureUrl) ||
  stringValue(user?.profilePicture) ||
  stringValue(user?.profileImage) ||
  stringValue(user?.photoURL) ||
  stringValue(user?.photoUrl);

const withCacheBuster = (url: string) =>
  `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;

export function ProfileSummary() {
  const { profile, loading } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [failedAvatar, setFailedAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const displayedAvatar = previewUrl || profile.avatar;
  const showAvatar = Boolean(displayedAvatar && failedAvatar !== displayedAvatar);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const replaceCachedUser = (updatedUser: CurrentUser) => {
    if (typeof window === "undefined") return;

    let cachedUser: CurrentUser = {};
    try {
      const cached = localStorage.getItem("user");
      if (cached) cachedUser = JSON.parse(cached) as CurrentUser;
    } catch {
      cachedUser = {};
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...cachedUser,
        ...updatedUser,
        personalDetails:
          updatedUser.personalDetails || cachedUser.personalDetails,
        kycProfile: updatedUser.kycProfile || cachedUser.kycProfile,
      }),
    );
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be smaller than 5 MB.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const localPreview = URL.createObjectURL(file);
    objectUrlRef.current = localPreview;
    setPreviewUrl(localPreview);
    setFailedAvatar("");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("profilePicture", file, file.name || `profile-${Date.now()}`);

      const updated = await updateUserProfilePhoto(form);
      let refreshed = updated;
      try {
        refreshed = (await fetchCurrentUser()) || updated;
      } catch {
        // The update response already contains the saved user. A refresh is
        // useful for normalization, but it should not turn a saved photo into
        // a failed upload when the follow-up request is temporarily offline.
      }
      const avatarUrl = getAvatarUrl(refreshed);

      if (!refreshed || !avatarUrl) {
        throw new Error("Updated profile photo could not be loaded.");
      }

      replaceCachedUser(refreshed);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreviewUrl(withCacheBuster(avatarUrl));
      emitAuthChanged();
      toast.success("Profile photo updated successfully.");
    } catch (error) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreviewUrl("");
      setFailedAvatar("");
      toast.error(
        error instanceof Error
          ? error.message
          : "Profile photo could not be updated.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bg-white px-5 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-20 w-20 shrink-0">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-[#3b0764] to-[#12b76a] text-[24px] font-extrabold text-white">
            {showAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={profile.name}
                src={displayedAvatar}
                onError={() => setFailedAvatar(displayedAvatar)}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <button
            type="button"
            aria-label="Upload a new profile photo"
            title="Change profile photo"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b0764] text-white shadow-[0_5px_14px_rgba(25,85,133,0.3)] ring-2 ring-white transition hover:bg-[#0f4771] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6] disabled:cursor-wait disabled:opacity-80"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePhotoChange}
            className="sr-only"
            aria-label="Choose profile photo"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 text-[22px] font-extrabold leading-tight text-[#07162d] sm:text-[24px]">
              {loading && profile.name === "Guest User"
                ? "Loading..."
                : profile.name}
            </h1>
            <Link
              href="/account/profile/edit-profile"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-[#eef8ff] px-3 text-[12px] font-extrabold text-[#3b0764] no-underline"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </div>

          <p className="mt-2 text-[12px] font-extrabold text-[#3b0764]">
            Profile {profile.completion.percent}% complete
          </p>
          <div className="mt-2 h-2 max-w-sm overflow-hidden rounded-full bg-[#e4edf5]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#3b0764] to-[#12b76a]"
              style={{ width: `${profile.completion.percent}%` }}
            />
          </div>
          <p className="mt-3 wrap-break-word text-[12px] font-semibold text-[#667085]">
            Customer ID: {profile.customerId}
          </p>
          <p className="mt-1 wrap-break-word text-[12px] font-semibold text-[#667085]">
            Mail ID: {profile.email}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/account/profile/edit-profile"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#fff7ed] px-4 text-[12px] font-extrabold text-[#f97316] no-underline"
        >
          <AlertCircle className="h-4 w-4" />
          {profile.kycStatus}
        </Link>
        <span className="inline-flex h-9 items-center gap-2 rounded-full bg-[#eef8ff] px-4 text-[12px] font-extrabold text-[#3b0764]">
          <Smartphone className="h-4 w-4" />
          {profile.mobile}
        </span>
      </div>
    </section>
  );
}
