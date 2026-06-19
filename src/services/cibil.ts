import { Post } from "@/hooks/apiUtils";

export type UserCibilResponse = {
  cached?: boolean;
  cibilScore?: number;
  lastFetchedAt?: string;
  lastConsentAt?: string;
  refreshAvailableInDays?: number;
  report?: unknown;
  payload?: unknown;
  message?: string;
};

export const fetchUserCibil = (forceRefresh = false) =>
  Post<UserCibilResponse>("cibil/user", { forceRefresh }, 30000, true);
