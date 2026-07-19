"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  Bell,
  CheckCheck,
  CircleDollarSign,
  FileCheck2,
  Inbox,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationAccountType,
  type NotificationPagination,
  type NotificationRecord,
} from "@/services/notifications";

const emptyPagination: NotificationPagination = {
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 20,
  totalPages: 1,
};

const notificationIcon = (type: string) => {
  const value = type.toLowerCase();
  if (/document|kyc/.test(value)) return FileCheck2;
  if (/payment|emi|commission|payout/.test(value)) return CircleDollarSign;
  if (/security|login|password|otp/.test(value)) return ShieldCheck;
  if (/approved|complete|success|disburs/.test(value)) return BadgeCheck;
  return Bell;
};

const formatNotificationTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(date);
};

export function NotificationsPanel({
  accountType,
  embedded = false,
}: {
  accountType: NotificationAccountType;
  embedded?: boolean;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [pagination, setPagination] =
    useState<NotificationPagination>(emptyPagination);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(
    async (page = 1, append = false) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError("");
      try {
        const result = await fetchNotifications(accountType, page, 20);
        setNotifications((current) =>
          append ? [...current, ...result.result] : result.result,
        );
        setPagination(result.pagination);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message.replace(/^❌\s*/, "")
            : "Unable to load notifications.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accountType],
  );

  useEffect(() => {
    const authType = getAuthType();
    const token = getAuthToken();
    if (!token) {
      const target =
        accountType === "partner"
          ? "/partner/login?redirect=/partner/profile/notifications"
          : "/login?referrer=/account/profile/notifications";
      router.replace(target);
      return;
    }
    if (accountType === "partner" && authType !== "agency") {
      router.replace("/account/profile/notifications");
      return;
    }
    if (accountType === "user" && authType === "agency") {
      router.replace("/partner/profile/notifications");
      return;
    }
    void load();
  }, [accountType, load, router]);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter(
        (item) =>
          item.status !== "deleted" &&
          (filter === "all" || item.status === "unread"),
      ),
    [filter, notifications],
  );
  const unreadCount = notifications.filter(
    (item) => item.status === "unread",
  ).length;

  const handleMarkRead = async (item: NotificationRecord) => {
    if (item.status === "read" || updating) return;
    setUpdating(item._id);
    try {
      await markNotificationRead(accountType, item._id);
      setNotifications((current) =>
        current.map((notification) =>
          notification._id === item._id
            ? {
                ...notification,
                status: "read",
                readAt: new Date().toISOString(),
              }
            : notification,
        ),
      );
      window.dispatchEvent(new Event("notifications:changed"));
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message.replace(/^❌\s*/, "")
          : "Unable to update notification.",
      );
    } finally {
      setUpdating("");
    }
  };

  const handleMarkAll = async () => {
    if (!unreadCount || updating) return;
    setUpdating("all");
    setError("");
    try {
      await markAllNotificationsRead(accountType);
      const readAt = new Date().toISOString();
      setNotifications((current) =>
        current.map((item) =>
          item.status === "unread"
            ? { ...item, status: "read", readAt }
            : item,
        ),
      );
      window.dispatchEvent(new Event("notifications:changed"));
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message.replace(/^❌\s*/, "")
          : "Unable to mark notifications as read.",
      );
    } finally {
      setUpdating("");
    }
  };

  return (
    <section
      className={
        embedded
          ? "py-5"
          : "mx-auto w-full max-w-5xl rounded-2xl border border-[#e1eaf2] bg-white p-4 shadow-[0_16px_44px_rgba(16,44,69,0.07)] sm:p-6"
      }
    >
      {!embedded ? (
        <div className="border-b border-[#e7eef4] pb-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1b68b3]">
            {accountType === "partner" ? "Partner account" : "Customer account"}
          </p>
          <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.02em] text-[#102c45] sm:text-[34px]">
            Notifications
          </h1>
          <p className="mt-2 text-[13px] font-medium leading-6 text-[#6c8192]">
            Application updates, document requests and important account alerts.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-xl bg-[#f1f5f9] p-1">
          {[
            ["all", `All (${notifications.filter((item) => item.status !== "deleted").length})`],
            ["unread", `Unread (${unreadCount})`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as "all" | "unread")}
              className={`rounded-lg px-3.5 py-2 text-[12px] font-extrabold transition ${
                filter === value
                  ? "bg-white text-[#075cab] shadow-sm"
                  : "text-[#667b8d] hover:text-[#23465f]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            aria-label="Refresh notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9e5ee] text-[#587386] transition hover:border-[#9fc7e8] hover:text-[#075cab] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={!unreadCount || Boolean(updating)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#cfe2f2] bg-[#f5faff] px-3 text-[11px] font-extrabold text-[#075cab] transition hover:bg-[#eaf5ff] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {updating === "all" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5" />
            )}
            Mark all read
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => void load()} className="font-extrabold underline">
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-[#f1f5f8]"
            />
          ))}
        </div>
      ) : visibleNotifications.length ? (
        <div className="divide-y divide-[#e9eff4] border-y border-[#e9eff4]">
          {visibleNotifications.map((item) => {
            const Icon = notificationIcon(item.type);
            const unread = item.status === "unread";
            const sender = item.from?.fullName || item.from?.name || "Fintaraa";
            return (
              <button
                key={item._id}
                type="button"
                onClick={() => void handleMarkRead(item)}
                className={`group flex w-full items-start gap-3 px-2 py-4 text-left transition sm:gap-4 sm:px-3 ${
                  unread ? "bg-[#f7fbff] hover:bg-[#f0f8ff]" : "bg-white hover:bg-[#fafcfd]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    unread
                      ? "bg-[#dff0ff] text-[#075cab]"
                      : "bg-[#f0f3f6] text-[#718495]"
                  }`}
                >
                  {updating === item._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4.5 w-4.5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={`text-[13px] leading-5 text-[#17354d] ${
                        unread ? "font-extrabold" : "font-bold"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold text-[#8a9aa8]">
                      {formatNotificationTime(item.createdAt)}
                    </span>
                  </span>
                  <span className="mt-1 block text-[12px] font-medium leading-5 text-[#647b8d]">
                    {item.message}
                  </span>
                  <span className="mt-1.5 block text-[10px] font-bold text-[#91a0ac]">
                    {sender}
                  </span>
                </span>
                {unread ? (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1687e2]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d9e5ee] bg-[#fbfdff] px-5 py-12 text-center">
          <Inbox className="mx-auto h-9 w-9 text-[#9db2c1]" />
          <h2 className="mt-3 text-[16px] font-extrabold text-[#17354d]">
            {filter === "unread" ? "You're all caught up" : "No notifications yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[12px] font-medium leading-5 text-[#718596]">
            {filter === "unread"
              ? "New account and application alerts will appear here."
              : "Important updates from Fintaraa will appear in this inbox."}
          </p>
        </div>
      )}

      {pagination.currentPage < pagination.totalPages ? (
        <div className="pt-5 text-center">
          <button
            type="button"
            onClick={() => void load(pagination.currentPage + 1, true)}
            disabled={loadingMore}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#cbdde9] px-5 text-[12px] font-extrabold text-[#075cab] hover:bg-[#f4faff] disabled:opacity-50"
          >
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Load older notifications
          </button>
        </div>
      ) : null}

      {!embedded ? (
        <div className="mt-5 border-t border-[#e8eef3] pt-4 text-[11px] font-medium text-[#7b8d9b]">
          Manage delivery channels from{" "}
          <Link
            href={
              accountType === "partner"
                ? "/partner/profile"
                : "/account/profile/notification-preferences"
            }
            className="font-extrabold text-[#075cab] no-underline hover:underline"
          >
            notification preferences
          </Link>
          .
        </div>
      ) : null}
    </section>
  );
}
