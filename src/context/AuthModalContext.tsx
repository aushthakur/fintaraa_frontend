"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthModalMode = "user" | "partner";

export interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  redirectTarget?: string;
  referralCode?: string;
  openAuthModal: (
    mode?: AuthModalMode,
    redirectTarget?: string,
    referralCode?: string,
  ) => void;
  closeAuthModal: () => void;
  setMode: (mode: AuthModalMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export const OPEN_AUTH_MODAL_EVENT = "fintaraa:open-auth-modal";

export function triggerAuthModal(
  mode: AuthModalMode = "user",
  redirectTarget?: string,
  referralCode?: string,
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_AUTH_MODAL_EVENT, {
      detail: { mode, redirectTarget, referralCode },
    }),
  );
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("user");
  const [redirectTarget, setRedirectTarget] = useState<string | undefined>(
    undefined,
  );
  const [referralCode, setReferralCode] = useState<string | undefined>(
    undefined,
  );

  const openAuthModal = useCallback(
    (
      newMode: AuthModalMode = "user",
      target?: string,
      refCode?: string,
    ) => {
      setMode(newMode);
      setRedirectTarget(target);
      setReferralCode(refCode);
      setIsOpen(true);
    },
    [],
  );

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        mode?: AuthModalMode;
        redirectTarget?: string;
        referralCode?: string;
      }>;
      const detail = customEvent.detail || {};
      openAuthModal(
        detail.mode || "user",
        detail.redirectTarget,
        detail.referralCode,
      );
    };

    window.addEventListener(OPEN_AUTH_MODAL_EVENT, handleOpenEvent);
    return () => {
      window.removeEventListener(OPEN_AUTH_MODAL_EVENT, handleOpenEvent);
    };
  }, [openAuthModal]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        redirectTarget,
        referralCode,
        openAuthModal,
        closeAuthModal,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    return {
      isOpen: false,
      mode: "user" as AuthModalMode,
      openAuthModal: triggerAuthModal,
      closeAuthModal: () => undefined,
      setMode: () => undefined,
    };
  }
  return context;
}
