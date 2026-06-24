"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  fetchWebsiteKnowledge,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

const fallbackBlogs: WebsiteKnowledgeItem[] = [
  {
    title: "What is a Hard Inquiry vs Soft Inquiry in CIBIL?",
    slug: "hard-inquiry-vs-soft-inquiry",
    type: "blog",
    coverImageUrl: "/assets/banks/visa-card.png",
  },
  {
    title: "Gold Loan Meaning, Process, Eligibility & Interest Rates",
    slug: "gold-loan-meaning-process-eligibility",
    type: "blog",
    coverImageUrl: "/assets/banks/visa-card.png",
  },
  {
    title: "What is Loan Grading? Types & Loan Grading System Explained",
    slug: "loan-grading-system-explained",
    type: "blog",
    coverImageUrl: "/assets/banks/visa-card.png",
  },
];

function BlogSkeleton() {
  return (
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-65 shrink-0 animate-pulse sm:w-72.5 md:w-77.5">
          <div className="mb-4 aspect-4/3 rounded-2xl bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export function RecentBlogs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "blog",
      sectionKey: "recent_blogs",
      limit: 12,
    })
      .then((items) => mounted && setPosts(items.length ? items : fallbackBlogs))
      .catch(() => mounted && setPosts(fallbackBlogs))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [posts]);

  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth) return;
    const nextX = x.get() - 0.8 * (delta / 16);
    const loopThreshold = trackWidth / 3;
    x.set(Math.abs(nextX) >= loopThreshold ? nextX + loopThreshold : nextX);
  });

  const displayPosts = [...posts, ...posts, ...posts];

  return (
    <section className="overflow-hidden select-none bg-white px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-10 flex w-full flex-col items-center gap-4 sm:grid sm:grid-cols-3">
          <div className="hidden sm:block" />
          <h2 className="text-center text-[24px] font-bold tracking-tight text-[#111625] md:text-[28px]">
            Recent Blogs
          </h2>
          <div className="self-center sm:justify-self-end">
            <Link
              href="/blog"
              className="rounded-full bg-[#12b76a] px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#0fa35e]"
            >
              View All Blogs
            </Link>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loading ? (
            <BlogSkeleton />
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
              {displayPosts.map((post, index) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={`${post.slug}-${index}`}
                  className="w-65 shrink-0 no-underline sm:w-72.5 md:w-77.5"
                >
                  <div className="pointer-events-none relative mb-4 aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#dadada] shadow-xs">
                    <Image
                      src={post.coverImageUrl || "/assets/banks/visa-card.png"}
                      alt={post.title}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover select-none"
                    />
                  </div>
                  <h3 className="pointer-events-none text-[15px] font-bold leading-snug tracking-tight text-[#111625] md:text-[16px]">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
