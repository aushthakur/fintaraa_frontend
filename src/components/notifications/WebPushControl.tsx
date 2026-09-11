"use client";

import { useEffect, useState } from "react";
import { BellRing, Loader2 } from "lucide-react";
import {
  disableWebsitePush,
  enableWebsitePush,
  getWebsitePushState,
  syncWebsitePush,
} from "@/services/notifications";

type PushState = {
  supported: boolean;
  permission: string;
  subscribed: boolean;
};

const initialState: PushState = {
  supported: true,
  permission: "default",
  subscribed: false,
};

export function WebPushControl() {
  const [state, setState] = useState<PushState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setState(await getWebsitePushState());
  };

  useEffect(() => {
    let active = true;
    const loadState = async () => {
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        await syncWebsitePush();
      }
      return getWebsitePushState();
    };
    loadState()
      .then((nextState) => {
        if (active) setState(nextState);
      })
      .catch(() => {
        if (active) {
          setState({
            supported: false,
            permission: "default",
            subscribed: false,
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggle = async () => {
    setLoading(true);
    setError("");
    try {
      if (state.subscribed) {
        await disableWebsitePush();
      } else {
        await enableWebsitePush();
      }
      await refresh();
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message.replace(/^❌\s*/, "")
          : "Unable to update browser push.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!state.supported) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#dbeaf7] bg-[#f6fbff] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3b0764] text-white">
          <BellRing className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[14px] font-extrabold text-[#3b0764]">
            Browser push notifications
          </p>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6c8192]">
            {state.subscribed
              ? "Enabled on this browser. Important updates can reach you even when this tab is closed."
              : state.permission === "denied"
                ? "Blocked in browser settings. Allow notifications for this site to enable push."
                : "Enable alerts for application updates and important announcements."}
          </p>
          {error ? (
            <p className="mt-1 text-[12px] font-bold text-red-600">{error}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading || state.permission === "denied"}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3b0764] px-4 text-[12px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {state.subscribed ? "Disable push" : "Enable push"}
      </button>
    </div>
  );
}
