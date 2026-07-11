"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function PageMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  distance = 20,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0.94, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`min-w-0 ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
