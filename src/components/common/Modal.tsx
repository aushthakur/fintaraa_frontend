"use client";

import ReactDOM from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  width?: string;
  isVisible: boolean;
  hideCross?: boolean;
  hidePadding?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  width = "w-full max-w-lg",
  isVisible,
  onClose,
  children,
  hidePadding = false,
  hideCross = false,
}: ModalProps) {
  if (!isVisible) return null;

  const target = document.getElementById("modal-root") || document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-[#07162d]/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] bg-white shadow-[0_28px_90px_rgba(7,22,45,0.28)] ${width}`}
        role="dialog"
        aria-modal="true"
      >
        {!hideCross && (
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#eef8ff] text-[#195585] transition hover:bg-[#195585] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div
          className={`max-h-[calc(100dvh-2rem)] overflow-y-auto ${
            hidePadding ? "" : "p-5 md:p-6"
          }`}
        >
          {children}
        </div>
      </div>
    </div>,
    target,
  );
}
