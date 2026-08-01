"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const SERVICE_FEEDBACK_DURATION_MS = 5_000;

export function useTransientServiceFeedback() {
  const [error, setError] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);
  const errorTimer = useRef<number | null>(null);
  const successTimer = useRef<number | null>(null);

  const clearError = useCallback(() => {
    if (errorTimer.current !== null) {
      window.clearTimeout(errorTimer.current);
      errorTimer.current = null;
    }
    setError("");
  }, []);

  const showError = useCallback((message: string) => {
    if (errorTimer.current !== null) {
      window.clearTimeout(errorTimer.current);
    }
    if (successTimer.current !== null) {
      window.clearTimeout(successTimer.current);
      successTimer.current = null;
    }
    setSuccessVisible(false);
    setError(message);
    errorTimer.current = window.setTimeout(() => {
      setError("");
      errorTimer.current = null;
    }, SERVICE_FEEDBACK_DURATION_MS);
  }, []);

  const showSuccess = useCallback(() => {
    if (successTimer.current !== null) {
      window.clearTimeout(successTimer.current);
    }
    if (errorTimer.current !== null) {
      window.clearTimeout(errorTimer.current);
      errorTimer.current = null;
    }
    setError("");
    setSuccessVisible(true);
    successTimer.current = window.setTimeout(() => {
      setSuccessVisible(false);
      successTimer.current = null;
    }, SERVICE_FEEDBACK_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (errorTimer.current !== null) {
        window.clearTimeout(errorTimer.current);
      }
      if (successTimer.current !== null) {
        window.clearTimeout(successTimer.current);
      }
    },
    [],
  );

  return {
    error,
    successVisible,
    clearError,
    showError,
    showSuccess,
  };
}
