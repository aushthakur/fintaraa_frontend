"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  stripHtml,
  formatKnowledgeDate,
  fetchWebsiteKnowledge,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";
import {
  CarouselNavigation,
  moveInfiniteCarousel,
} from "./CarouselNavigation";

const fallbackPress: WebsiteKnowledgeItem[] = [
  {
    title: "Fintaraa expands assisted loan discovery across India",
    slug: "fintaraa-expands-assisted-loan-discovery",
    type: "press_release",
    category: "Company News",
    summary:
      "Fintaraa strengthens its assisted discovery experience for loan seekers across more partner-led journeys.",
    coverImageUrl: "/assets/images/media1.png",
    publishedAt: "2026-06-01",
  },
];

function getPressSummary(post: WebsiteKnowledgeItem) {
  return (
    post.summary ||
    post.excerpt ||
    stripHtml(post.content || "") ||
    "Read the latest company update, product announcement, or media coverage from Fintaraa."
  );
}

function PressSkeleton() {
  return (
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-108 w-76 shrink-0 animate-pulse rounded-2xl border border-[#e2edf8] bg-white sm:w-82 md:w-88"
        >
          <div className="h-56 rounded-t-2xl bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-5 rounded bg-slate-100" />
            <div className="h-5 w-4/5 rounded bg-slate-100" />
            <div className="h-16 rounded bg-slate-100" />
          </div>
        </div>
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
    <section className="overflow-hidden select-none bg-white px-4 pt-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[24px] font-bold tracking-tight text-[#111625] md:text-[28px]">
              Media & Press Release
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/press-release"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[13px] font-bold leading-none text-white no-underline transition hover:bg-[#064cb8]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
            <CarouselNavigation
              label="media and press releases"
              disabled={loading || !trackWidth}
              onPrevious={() =>
                moveInfiniteCarousel({
                  direction: "previous",
                  track: trackRef.current,
                  trackWidth,
                  x,
                  onPauseChange: setIsPaused,
                })
              }
              onNext={() =>
                moveInfiniteCarousel({
                  direction: "next",
                  track: trackRef.current,
                  trackWidth,
                  x,
                  onPauseChange: setIsPaused,
                })
              }
            />
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
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
                  className="group flex h-108 w-76 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white no-underline transition-colors duration-300 hover:border-[#bcd3e8] sm:w-82 md:w-88"
                >
                  <div className="pointer-events-none relative h-56 w-full overflow-hidden bg-[#eaf2f9]">
                    <Image
                      src={post.coverImageUrl || "/assets/images/media1.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 19rem, (max-width: 768px) 20.5rem, 22rem"
                      unoptimized
                      draggable={false}
                      className="h-full w-full object-cover select-none transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                  </div>
                  <div className="pointer-events-none flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-bold text-[#667085]">
                        <span className="inline-flex items-center gap-1.5 text-[#075cde]">
                          <Newspaper className="h-3.5 w-3.5" />
                          {post.category || "Press Release"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-[#195585]" />
                          {formatKnowledgeDate(post.publishedAt)}
                        </span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-[18px] font-extrabold leading-snug tracking-tight text-[#111625] transition group-hover:text-[#075cde]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-1 text-[13px] font-semibold leading-6 text-[#667085]">
                        {getPressSummary(post)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#edf2f7] pt-2">
                      <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#98a2b3]">
                        {post.category || "Media"}
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#075cde] text-white transition group-hover:translate-x-1 group-hover:bg-[#064cb8]">
                        <ArrowRight className="h-4 w-4" />
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
