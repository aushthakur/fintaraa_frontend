"use client";

import { useEffect, useState, useMemo } from "react";

export const DEFAULT_SEARCH_PLACEHOLDERS = [
  "Search Personal Loan from 10.49%...",
  "Search Instant Home Loan across 50+ Banks...",
  "Search Best Lifetime Free Credit Cards...",
  "Search Collateral-Free Business Loans...",
  "Search Free CIBIL Score & Report...",
  "Search Health & Life Insurance...",
  "Search GST, MSME & Govt Subsidies...",
  "Search EMI Calculator & Bank Rates...",
];

interface TypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function useTypewriter(
  phrases: string[] = DEFAULT_SEARCH_PLACEHOLDERS,
  options: TypewriterOptions = {}
): string {
  const {
    typingSpeed = 55,
    deletingSpeed = 28,
    pauseDuration = 1800,
  } = options;

  const phraseList = useMemo(() => {
    return phrases && phrases.length > 0 ? phrases : DEFAULT_SEARCH_PLACEHOLDERS;
  }, [phrases]);

  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phraseList[phraseIdx % phraseList.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phraseList.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIdx, phraseList, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}
