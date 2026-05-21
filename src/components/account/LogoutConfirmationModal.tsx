"use client";

import { AlertCircle, LogOut } from "lucide-react";
import Modal from "@/components/common/Modal";

type LogoutConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmationModal({
  open,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  return (
    <Modal
      isVisible={open}
      onClose={onClose}
      width="w-[calc(100%-2rem)] max-w-xl"
    >
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7ed] text-[#f97316]">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="mt-5 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#195585]">
          Confirm sign out
        </p>
        <h3 className="mt-2 text-[28px] font-extrabold leading-tight text-[#07162d]">
          Logout from this device?
        </h3>
        <p className="mx-auto mt-3 text-[14px] font-semibold leading-6 text-[#667085]">
          Your local session token will be cleared from this browser. Any
          unsaved profile changes should be saved before signing out.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full bg-[#eef8ff] px-5 text-[13px] font-extrabold text-[#195585]"
          >
            Stay logged in
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-500 px-5 text-[13px] font-extrabold text-white"
          >
            <LogOut className="h-4 w-4" />
            Yes, logout
          </button>
        </div>
      </div>
    </Modal>
  );
}
