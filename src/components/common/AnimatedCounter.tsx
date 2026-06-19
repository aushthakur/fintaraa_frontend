"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const parseCounter = (value: string | number) => {
  const text = String(value);
  const match = text.match(/^([^0-9-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numericText, suffix] = match;
  if (/^x\d+/i.test(suffix.trim())) return null;
  const end = Number(numericText.replace(/,/g, ""));
  if (!Number.isFinite(end)) return null;
  const decimals = numericText.includes(".")
    ? numericText.split(".")[1]?.length || 0
    : 0;
  return { prefix, end, suffix, decimals };
};

export function AnimatedCounter({
  value,
  duration = 1200,
  className,
}: {
  value: string | number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const parsed = useMemo(() => parseCounter(value), [value]);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !parsed) return;
    let frame = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(parsed.end * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, parsed, visible]);

  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const formatted = current.toLocaleString("en-IN", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  });

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {visible ? formatted : "0"}
      {parsed.suffix}
    </span>
  );
}
