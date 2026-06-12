"use client";

import { clearAuthSession, getAuthToken } from "@/hooks/authStorage";
import { useMemo, useSyncExternalStore } from "react";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import { fetchCurrentUser, type CurrentUser } from "@/services/profile";

const stringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && String(value).trim() !== "";

function getCachedUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

type CurrentUserSnapshot = {
  user: CurrentUser | null;
  loading: boolean;
  version: number;
};

const listeners = new Set<() => void>();
let storeStarted = false;
let storeUser: CurrentUser | null = null;
let storeLoading = true;
let storeVersion = 0;
let storeSnapshot: CurrentUserSnapshot = {
  user: storeUser,
  loading: storeLoading,
  version: storeVersion,
};
let inFlight: Promise<void> | null = null;
let loadGeneration = 0;

const emitStoreChange = () => {
  storeVersion += 1;
  storeSnapshot = {
    user: storeUser,
    loading: storeLoading,
    version: storeVersion,
  };
  listeners.forEach((listener) => listener());
};

const setStoreState = ({
  user,
  loading,
}: {
  user?: CurrentUser | null;
  loading?: boolean;
}) => {
  let changed = false;

  if (user !== undefined && user !== storeUser) {
    storeUser = user;
    changed = true;
  }

  if (loading !== undefined && loading !== storeLoading) {
    storeLoading = loading;
    changed = true;
  }

  if (changed) emitStoreChange();
};

const loadCurrentUserOnce = async (force = false) => {
  if (inFlight && !force) return inFlight;

  const generation = force ? loadGeneration + 1 : loadGeneration;
  loadGeneration = generation;

  inFlight = (async () => {
    const cached = getCachedUser();
    if (generation !== loadGeneration) return;
    if (cached) setStoreState({ user: cached });

    const token = getAuthToken();
    if (!token) {
      if (generation !== loadGeneration) return;
      setStoreState({ user: cached || null, loading: false });
      return;
    }

    if (generation !== loadGeneration) return;
    setStoreState({ loading: true });

    try {
      const current = await fetchCurrentUser();
      if (generation !== loadGeneration) return;
      if (current) {
        const normalized = {
          ...(cached || {}),
          ...current,
          personalDetails: current.personalDetails || cached?.personalDetails,
          kycProfile: current.kycProfile || cached?.kycProfile,
        };
        storeUser = normalized;
        localStorage.setItem("user", JSON.stringify(normalized));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("Record not found")) {
        clearAuthSession();
        if (generation !== loadGeneration) return;
        setStoreState({ user: null });
      }
      // Keep cached user for transient network/server failures.
    } finally {
      if (generation !== loadGeneration) return;
      storeLoading = false;
      emitStoreChange();
      inFlight = null;
    }
  })();

  return inFlight;
};

const refreshCurrentUser = () => {
  queueMicrotask(() => {
    void loadCurrentUserOnce();
  });
};

const forceRefreshCurrentUser = () => {
  queueMicrotask(() => {
    const cached = getCachedUser();
    const token = getAuthToken();
    setStoreState({ user: cached, loading: Boolean(token) });
    void loadCurrentUserOnce(true);
  });
};

const ensureCurrentUserStore = () => {
  if (storeStarted || typeof window === "undefined") return;
  storeStarted = true;
  refreshCurrentUser();
  window.addEventListener(AUTH_CHANGED_EVENT, forceRefreshCurrentUser);
  window.addEventListener("storage", forceRefreshCurrentUser);
};

const subscribeCurrentUser = (listener: () => void) => {
  listeners.add(listener);
  ensureCurrentUserStore();
  return () => {
    listeners.delete(listener);
  };
};

const getCurrentUserSnapshot = () => storeSnapshot;

export function normalizeCurrentUser(user: CurrentUser | null) {
  const personal = {
    ...(user?.personalDetails || {}),
    ...(user?.kycProfile?.personalDetails || {}),
  };
  const address = {
    ...(user?.addressDetails || {}),
    ...(user?.kycProfile?.addressDetails || {}),
  };
  const employment = {
    ...(user?.employmentDetails || {}),
    ...(user?.kycProfile?.employmentDetails || {}),
  };
  const bank = {
    ...(user?.bankDetails || {}),
    ...(user?.kycProfile?.bankDetails || {}),
  };

  const name =
    stringValue(user?.name) ||
    stringValue(user?.fullName) ||
    stringValue(personal.fullName) ||
    "Guest User";
  const email =
    stringValue(user?.email) ||
    stringValue(personal.email) ||
    "Email not available";
  const mobile = stringValue(user?.mobile) || stringValue(personal.mobile);
  const customerSource =
    stringValue(user?.customerId) ||
    stringValue(user?._id) ||
    stringValue(user?.id);
  const customerId = customerSource ? customerSource.slice(-8) : "—";
  const kycVerified =
    user?.kycProfile?.verification?.status === "verified" ||
    Boolean(user?.isKycVerified);
  const avatar =
    stringValue(user?.avatar) ||
    stringValue(user?.profilePictureUrl) ||
    stringValue(user?.profilePicture) ||
    stringValue(user?.profileImage) ||
    stringValue(user?.photoURL) ||
    stringValue(user?.photoUrl) ||
    stringValue(user?.image);

  const employmentType =
    stringValue(employment.employmentType) ||
    stringValue(employment.employerType);

  const personalAddress =
    personal.address || address.address || address.street || user?.address;

  const requiredPersonal = [
    name !== "Guest User" ? name : "",
    personal.dateOfBirth,
    personal.fatherName,
    personal.panNumber || user?.panCard,
    personal.aadhaarNumber || user?.aadhaarCard,
    mobile,
    email !== "Email not available" ? email : "",
    personalAddress,
    personal.city || address.city || user?.city,
    personal.state || address.state || user?.state,
    personal.pinCode || personal.pincode || address.pinCode || address.pincode,
  ];

  let requiredProfessional: unknown[] = [];
  if (employmentType === "salaried") {
    requiredProfessional = [
      employment.employerName,
      employment.professionOrJobTitle,
      employment.monthlyIncome,
      employment.companyAddress,
    ];
  } else if (employmentType === "selfEmployedProfessional") {
    requiredProfessional = [
      employment.employerName,
      employment.taxId,
      employment.professionOrJobTitle,
      employment.companyType,
      employment.businessVintage || employment.tenure,
      employment.monthlyIncome || employment.businessIncome,
      employment.emiPaid,
    ];
  } else if (employmentType === "selfEmployedNonProfessional") {
    requiredProfessional = [
      employment.employerName,
      employment.companyType,
      employment.taxId,
      employment.industry,
      employment.monthlyIncome || employment.businessIncome,
      employment.businessVintage || employment.tenure,
      employment.emiPaid,
    ];
  }

  const requiredBank = [
    bank.accountHolderName,
    bank.bankName,
    bank.accountType,
    bank.accountNumber,
    bank.ifscCode,
  ];

  const required = [
    ...requiredPersonal,
    ...requiredProfessional,
    ...requiredBank,
  ];
  const completed = required.filter(hasValue).length;
  const total = required.length || 1;
  const percent = Math.round((completed / total) * 100);

  return {
    raw: user,
    name,
    email,
    mobile: mobile ? `+91 ${mobile}` : "Mobile not available",
    customerId,
    kycStatus: kycVerified ? "KYC verified" : "KYC pending",
    kycVerified,
    avatar,
    completion: { completed, total, percent },
  };
}

export function useCurrentUser() {
  const { user, loading } = useSyncExternalStore(
    subscribeCurrentUser,
    getCurrentUserSnapshot,
    getCurrentUserSnapshot,
  );
  const profile = useMemo(() => normalizeCurrentUser(user), [user]);

  return { user, profile, loading };
}
