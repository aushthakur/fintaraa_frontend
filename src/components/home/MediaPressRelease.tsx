"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  fetchWebsiteKnowledge,
  formatKnowledgeDate,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

const fallbackPress: WebsiteKnowledgeItem[] = [
  {
    title: "Fintaraa expands assisted loan discovery across India",
    slug: "fintaraa-expands-assisted-loan-discovery",
    type: "press_release",
    category: "Company News",
    coverImageUrl: "/assets/images/media1.png",
    publishedAt: "2026-06-01",
  },
];

function PressSkeleton() {
  return (
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-80 w-65 shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-70 md:w-73.75" />
      ))}
    </div>
  );
}

export function MediaPressRelease() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "press_release",
      sectionKey: "media_press_release",
      limit: 12,
    })
      .then((data) => mounted && setItems(data.length ? data : fallbackPress))
      .catch(() => mounted && setItems(fallbackPress))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth) return;
    const nextX = x.get() - 0.6 * (delta / 16);
    const loopThreshold = trackWidth / 3;
    x.set(Math.abs(nextX) >= loopThreshold ? nextX + loopThreshold : nextX);
  });

  const duplicatedPress = [...items, ...items, ...items];

  return (
    <section className="overflow-hidden select-none bg-white px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-10 flex w-full flex-col items-center gap-4 sm:grid sm:grid-cols-3">
          <div className="hidden sm:block" />
          <h2 className="text-center text-[24px] font-bold tracking-tight text-[#111625] md:text-[28px]">
            Media & Press Release
          </h2>
          <div className="self-center sm:justify-self-end">
            <Link
              href="/press-release"
              className="rounded-full bg-[#12b76a] px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#0fa35e]"
            >
              View All
            </Link>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

          {loading ? (
            <PressSkeleton />
          ) : (
            <motion.div
              ref={trackRef}
              style={{ x, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{
                left: -((trackWidth || 2000) * (2 / 3)),
                right: 0,
              }}
              dragElastic={0.05}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={() => setIsPaused(false)}
              className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
            >
              {duplicatedPress.map((post, index) => (
                <Link
                  key={`press-card-${post.slug}-${index}`}
                  href={
                    post.linkUrl && /^https?:\/\//i.test(post.linkUrl)
                      ? post.linkUrl
                      : `/press-release/${post.slug}`
                  }
                  className="flex w-65 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100/80 bg-white no-underline shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:w-70 md:w-73.75"
                >
                  <div className="pointer-events-none relative aspect-[1.38/1] w-full bg-gray-100">
                    <Image
                      src={post.coverImageUrl || "/assets/images/media1.png"}
                      alt={post.title}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover select-none"
                    />
                  </div>
                  <div className="pointer-events-none flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span className="block text-[12px] font-medium tracking-tight text-gray-400">
                        {post.category}
                      </span>
                      <h3 className="mt-1 text-[14px] font-bold leading-snug tracking-tight text-[#111625] md:text-[15px]">
                        {post.title}
                      </h3>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-gray-50/60 pt-3">
                      <span className="text-[12px] font-medium text-gray-400">
                        {formatKnowledgeDate(post.publishedAt)}
                      </span>
                      <span className="text-[14px] font-bold text-[#12b76a]">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
