"use client";

import { useState, useSyncExternalStore, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  CheckCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { isUserLoggedIn } from "@/hooks/authStorage";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import { WHATSAPP_PHONE } from "@/data/company";

const subscribeToAuth = (onStoreChange: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const quickOptions = [
  "Personal Loan Offers",
  "Check Loan Eligibility",
  "Best Credit Cards",
  "Business Loan Support",
];

let messageIdCounter = 0;
function createMessageId(prefix: string) {
  messageIdCounter += 1;
  return `${prefix}-${messageIdCounter}`;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MobileActionBar() {
  const pathname = usePathname();
  const userLoggedIn = useSyncExternalStore(
    subscribeToAuth,
    isUserLoggedIn,
    () => true,
  );

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hi, We have a personalized offer for you! 👋",
      time: "Just now",
    },
    {
      id: "welcome-2",
      sender: "bot",
      text: "Which financial service are you exploring today? Type your query below or pick a quick option to chat with our expert advisor.",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isChatOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text) return;

    const timeStr = getCurrentTime();

    const userMsg: ChatMessage = {
      id: createMessageId("user"),
      sender: "user",
      text,
      time: timeStr,
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: createMessageId("bot-reply"),
        sender: "bot",
        text: "Connecting you with an advisor on WhatsApp with your query...",
        time: timeStr,
      },
    ]);

    setInputValue("");

    // Open WhatsApp in a new tab with the typed message pre-filled
    const whatsappUrl = `${WHATSAPP_PHONE.href}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isAccountProfile =
    pathname === "/account/profile" ||
    pathname.startsWith("/account/profile/");
  const hasCardApplyBar =
    pathname.startsWith("/credit-card/") ||
    pathname.startsWith("/credit-cards/");

  if (isAccountProfile && userLoggedIn) return null;

  return (
    <aside
      aria-label="WhatsApp Advisor"
      className={`fixed z-50 right-3 sm:right-6 md:right-8 flex flex-col items-end pointer-events-auto ${
        hasCardApplyBar ? "bottom-24 lg:bottom-16" : "bottom-14 sm:bottom-16"
      }`}
    >
      {/* ── 1. FLOATING SPEECH BUBBLE (Visible when chat is closed) ── */}
      <AnimatePresence>
        {!isChatOpen && showBubble && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative mb-2.5 max-w-[270px] sm:max-w-[290px] cursor-pointer"
            onClick={() => setIsChatOpen(true)}
          >
            <div className="relative rounded-2xl bg-white p-3 pr-8 shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-slate-100 transition-all hover:shadow-[0_12px_36px_rgba(37,211,102,0.22)]">
              {/* Dismiss button */}
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-3 w-3" />
              </button>

              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C4B]">
                  <Sparkles className="h-4 w-4 fill-[#25D366] text-[#128C4B]" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#128C4B] flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#25D366] animate-ping" />
                    Special Offer
                  </p>
                  <p className="mt-0.5 text-[12.5px] font-bold leading-snug text-slate-800">
                    Hi, We have a personalized offer for you
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#128C4B] flex items-center gap-1">
                    Tap to chat &amp; claim →
                  </p>
                </div>
              </div>

              {/* Chat bubble pointer tail pointing to the floating button */}
              <div
                className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white border-r border-b border-slate-100"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. INTERACTIVE CHAT WINDOW POPUP ── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="mb-3 w-[340px] sm:w-[370px] max-w-[calc(100vw-24px)] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.30)] border border-slate-200 overflow-hidden flex flex-col"
            style={{ height: "470px", maxHeight: "78vh" }}
          >
            {/* Window Header */}
            <div className="bg-[#075E54] px-4 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#075E54] font-black text-sm shadow-inner">
                    F
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#25D366] ring-2 ring-[#075E54]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[14px] font-bold leading-tight">
                      Fintaraa Advisory
                    </h3>
                    <ShieldCheck className="h-3.5 w-3.5 text-[#25D366]" />
                  </div>
                  <p className="text-[10.5px] font-normal text-white/80">
                    Typically replies instantly • Online
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat window"
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body (WhatsApp Wallpaper Tint) */}
            <div
              className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#e5ddd5]/30"
              style={{
                backgroundImage:
                  "radial-gradient(#cbd5e1 0.75px, transparent 0.75px)",
                backgroundSize: "16px 16px",
              }}
            >
              {/* Date pill */}
              <div className="flex justify-center">
                <span className="rounded-md bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-xs uppercase tracking-wider">
                  TODAY
                </span>
              </div>

              {/* Message List */}
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed shadow-xs ${
                        isBot
                          ? "bg-white text-slate-800 rounded-tl-xs border border-slate-100"
                          : "bg-[#d9fdd3] text-slate-900 rounded-tr-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-[9.5px] text-slate-400">
                        <span>{msg.time}</span>
                        {!isBot && (
                          <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick Prompt Chips */}
              <div className="pt-2">
                <p className="text-[10.5px] font-bold text-slate-500 mb-1.5">
                  Frequently Asked:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSendMessage(opt)}
                      className="rounded-full bg-white border border-[#25D366]/40 px-2.5 py-1 text-[11px] font-semibold text-[#128C4B] hover:bg-[#25D366]/10 transition shadow-2xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full bg-slate-100 px-3.5 py-2 text-[12.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#128C4B]/20"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send message to WhatsApp"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-xs transition ${
                  inputValue.trim()
                    ? "bg-[#25D366] hover:bg-[#128C4B] cursor-pointer"
                    : "bg-slate-300 opacity-60 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. MAIN FLOATING WHATSAPP BUTTON ── */}
      <button
        type="button"
        onClick={() => setIsChatOpen((prev) => !prev)}
        aria-label={isChatOpen ? "Close WhatsApp Chat" : "Open WhatsApp Chat"}
        data-analytics-category="whatsapp"
        data-analytics-name="Floating WhatsApp Widget"
        data-analytics-placement="floating_contact"
        className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(135deg,#25D366_0%,#128C4B_100%)] text-white shadow-[0_10px_32px_rgba(18,140,75,0.40)] transition hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(18,140,75,0.50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ebe5a] cursor-pointer"
      >
        <span className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-[#25D366]/35 blur-[3px] motion-reduce:animate-none" />

        {isChatOpen ? (
          <X className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>
    </aside>
  );
}
