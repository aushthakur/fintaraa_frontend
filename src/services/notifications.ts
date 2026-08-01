import { Delete, Fetch, Post, Put } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  success?: boolean;
};

export type NotificationAccountType = "user" | "partner";

export type NotificationRecord = {
  _id: string;
  type: string;
  title: string;
  message: string;
  status: "unread" | "read" | "deleted";
  readAt?: string;
  createdAt: string;
  data?: {
    actionUrl?: string;
    url?: string;
    campaignId?: string;
    [key: string]: unknown;
  };
  from?: {
    _id?: string;
    name?: string;
    fullName?: string;
    role?: string;
    profilePic?: string;
  };
};

export type NotificationPagination = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
};

export type NotificationStats = {
  read: number;
  unread: number;
  deleted: number;
  total: number;
};

const endpoint = (accountType: NotificationAccountType) =>
  accountType === "partner" ? "agency" : "user";

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const fetchNotifications = async (
  accountType: NotificationAccountType,
  page = 1,
  limit = 20,
) => {
  const response = await Fetch<
    ApiEnvelope<{
      result?: NotificationRecord[];
      pagination?: NotificationPagination;
    }>
  >(
    `${endpoint(accountType)}/notifications`,
    { page, limit },
    15000,
    true,
    false,
  );
  const data = unwrap(response) || {};
  return {
    result: Array.isArray(data.result) ? data.result : [],
    pagination: data.pagination || {
      currentPage: page,
      totalItems: 0,
      itemsPerPage: limit,
      totalPages: 1,
    },
  };
};

export const fetchNotificationStats = async (
  accountType: NotificationAccountType,
) => {
  const response = await Fetch<ApiEnvelope<NotificationStats>>(
    `${endpoint(accountType)}/notifications-stats`,
    undefined,
    12000,
    true,
    false,
  );
  return (
    unwrap(response) || { read: 0, unread: 0, deleted: 0, total: 0 }
  );
};

export const markNotificationRead = (
  accountType: NotificationAccountType,
  notificationId: string,
) =>
  Put<ApiEnvelope<NotificationRecord>>(
    `${endpoint(accountType)}/notifications/mark-read?notificationId=${encodeURIComponent(
      notificationId,
    )}`,
    {},
    12000,
    true,
  );

export const markAllNotificationsRead = (
  accountType: NotificationAccountType,
) =>
  Put<ApiEnvelope<{ modifiedCount: number }>>(
    `${endpoint(accountType)}/notifications/mark-read?markAll=true`,
    {},
    12000,
    true,
  );

const urlBase64ToUint8Array = (value: string) => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
};

const arrayBuffersMatch = (
  current?: ArrayBuffer | null,
  expected?: Uint8Array,
) => {
  if (!current || !expected) return false;
  const currentBytes = new Uint8Array(current);
  if (currentBytes.length !== expected.length) return false;
  return currentBytes.every((value, index) => value === expected[index]);
};

const getPushRegistration = async () => {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    throw new Error("Web push is not supported in this browser.");
  }
  return navigator.serviceWorker.register("/push-sw.js");
};

export const getWebsitePushState = async () => {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return { supported: false, permission: "default", subscribed: false };
  }
  const registration = await getPushRegistration();
  const subscription = await registration.pushManager.getSubscription();
  return {
    supported: true,
    permission: Notification.permission,
    subscribed: Boolean(subscription),
  };
};

export const enableWebsitePush = async (requestPermission = true) => {
  const registration = await getPushRegistration();
  const permission =
    Notification.permission === "default" && requestPermission
      ? await Notification.requestPermission()
      : Notification.permission;
  if (permission !== "granted") {
    throw new Error("Browser notification permission was not granted.");
  }
  const keyResponse = await Fetch<
    ApiEnvelope<{ publicKey?: string }>
  >("web-push/vapid-public-key", undefined, 12000, true, false);
  const publicKey = unwrap(keyResponse)?.publicKey;
  if (!publicKey) {
    throw new Error("Website push keys are not configured on the server.");
  }
  const applicationServerKey = urlBase64ToUint8Array(publicKey);

  let existing = await registration.pushManager.getSubscription();
  if (
    existing &&
    !arrayBuffersMatch(
      existing.options.applicationServerKey,
      applicationServerKey,
    )
  ) {
    await Delete(
      "web-push/subscriptions",
      { endpoint: existing.endpoint },
      undefined,
      12000,
      true,
    ).catch(() => undefined);
    await existing.unsubscribe();
    existing = null;
  }
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    }));
  await Post(
    "web-push/subscriptions",
    { subscription: subscription.toJSON() },
    15000,
    true,
  );
  return subscription;
};

export const syncWebsitePush = async () => {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return null;
  }
  return enableWebsitePush(false);
};

export const disableWebsitePush = async () => {
  const registration = await getPushRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  await Delete(
    "web-push/subscriptions",
    { endpoint: subscription.endpoint },
    undefined,
    12000,
    true,
  );
  await subscription.unsubscribe();
};
