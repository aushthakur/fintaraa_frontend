"use client";

// import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export function Providers({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   const preventClipboard = (event: ClipboardEvent) => {
  //     event.preventDefault();
  //   };

  //   const preventDefault = (event: Event) => {
  //     event.preventDefault();
  //   };

  //   const clearSelection = () => {
  //     window.getSelection()?.removeAllRanges();
  //   };

  //   const preventCopyShortcut = (event: KeyboardEvent) => {
  //     const key = event.key.toLowerCase();
  //     const isModifierPressed = event.ctrlKey || event.metaKey;

  //     if (isModifierPressed && ["c", "x", "a"].includes(key)) {
  //       event.preventDefault();
  //       clearSelection();
  //     }
  //   };

  //   document.addEventListener("cut", preventClipboard, true);
  //   document.addEventListener("copy", preventClipboard, true);
  //   document.addEventListener("dragstart", preventDefault, true);
  //   document.addEventListener("selectstart", preventDefault, true);
  //   document.addEventListener("selectionchange", clearSelection);
  //   document.addEventListener("contextmenu", preventDefault, true);
  //   document.addEventListener("keydown", preventCopyShortcut, true);

  //   return () => {
  //     document.removeEventListener("cut", preventClipboard, true);
  //     document.removeEventListener("copy", preventClipboard, true);
  //     document.removeEventListener("dragstart", preventDefault, true);
  //     document.removeEventListener("contextmenu", preventDefault, true);
  //     document.removeEventListener("selectstart", preventDefault, true);
  //     document.removeEventListener("selectionchange", clearSelection);
  //     document.removeEventListener("keydown", preventCopyShortcut, true);
  //   };
  // }, []);

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
