export const AUTH_CHANGED_EVENT = "fintaraa:auth-changed";

export function emitAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
