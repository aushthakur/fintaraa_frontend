import { Fetch, Put } from "@/hooks/apiUtils";

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
