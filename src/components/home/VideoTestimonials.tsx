"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, MapPin, Play, Quote, ShieldCheck, Star, X } from "lucide-react";
import {
  fetchWebsiteKnowledge,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

const videoData: WebsiteKnowledgeItem[] = [
  {
    slug: "deepika-kumari-video",
    title: "Deepika Kumari",
    type: "video",
    authorName: "Deepika Kumari",
    category: "Home Loan",
    location: "Delhi",
    summary: "My ₹38L home loan options were compared clearly before I applied.",
    coverImageUrl: "/assets/images/testimonials/video-1.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    slug: "arjun-mehta-video",
    title: "Arjun Mehta",
    type: "video",
    authorName: "Arjun Mehta",
    category: "Credit Card",
    location: "Ahmedabad",
    summary: "I found a cashback card that matched my fuel and grocery spends.",
    coverImageUrl: "/assets/images/testimonials/video-2.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    slug: "neha-and-rahul-video",
    title: "Neha & Rahul",
    type: "video",
    authorName: "Neha & Rahul",
    category: "Home Loan",
    location: "Pune",
    summary: "Eligibility, EMI and document requirements were clear from day one.",
    coverImageUrl: "/assets/images/testimonials/video-3.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];

const videoCovers = [
  "/assets/images/testimonials/video-1.jpg",
  "/assets/images/testimonials/video-2.jpg",
  "/assets/images/testimonials/video-3.jpg",
];

const normaliseVideoItems = (data: WebsiteKnowledgeItem[]) => {
  const source = data.length ? data : videoData;
  return source.slice(0, 12).map((item, index) => ({
    ...item,
    coverImageUrl: item.coverImageUrl || videoCovers[index % videoCovers.length],
  }));
};

export function VideoTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const x = useMotionValue(0);
  const baseSpeed = 0.65;

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "video",
      sectionKey: "video_testimonials",
      limit: 12,
    })
      .then((data) => mounted && setItems(normaliseVideoItems(data)))
      .catch(() => mounted && setItems(videoData))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [items]);

  const duplicatedVideos = [...items, ...items, ...items];

  // Infinite carousel looping logic
  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth || selectedVideoUrl) return; // Freeze carousel auto-scroll when modal is active
    const currentX = x.get();
    const newX = currentX - baseSpeed * (delta / 16);
    const loopThreshold = trackWidth / 3;
    if (Math.abs(newX) >= loopThreshold) {
      x.set(newX + loopThreshold);
    } else {
      x.set(newX);
    }
  });

  return (
    <section className="overflow-hidden select-none bg-white px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#075cde]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#075cde]" />
              Customer stories
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold tracking-tight text-[#111625] md:text-[32px]">
              Video Testimonials
            </h2>
            <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[#667085]">
              Real journeys from customers who compared loans, cards, and financial options with Fintaraa.
            </p>
          </div>
        </div>

        {/* Carousel Viewport Box */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => !selectedVideoUrl && setIsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

          {loading ? (
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[410px] w-[19rem] shrink-0 animate-pulse rounded-2xl border border-[#e2edf8] bg-white sm:w-[20.5rem] md:w-[23rem]"
                >
                  <div className="h-56 rounded-t-2xl bg-slate-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="h-5 rounded bg-slate-100" />
                    <div className="h-16 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              ref={trackRef}
              style={{ x, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{
                left: -((trackWidth || 2400) * (2 / 3)),
                right: 0,
              }}
              dragElastic={0.05}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={() => !selectedVideoUrl && setIsPaused(false)}
              className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
            >
              {duplicatedVideos.map((item, index) => (
                <button
                  key={`video-card-${item.slug}-${index}`}
                  type="button"
                  onClick={() => {
                    setIsPaused(true);
                    setSelectedVideoUrl(item.videoUrl || null);
                  }}
                  className="group flex h-[410px] w-[19rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white text-left no-underline outline-none transition duration-300 hover:-translate-y-1 hover:border-[#bcd3e8] sm:w-[20.5rem] md:w-[23rem]"
                >
                  <div className="pointer-events-none relative h-56 w-full overflow-hidden bg-slate-950">
                    <Image
                      src={item.coverImageUrl || "/assets/images/media1.png"}
                      alt={item.authorName || item.title}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover select-none transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/20" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#075cde] ring-8 ring-white/20 transition group-hover:scale-105">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-[18px] font-extrabold leading-tight text-white">
                        {item.authorName || item.title}
                      </h3>
                      {item.location ? (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-bold text-white/80">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="pointer-events-none flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#98a2b3]">
                            <Quote className="h-3.5 w-3.5 text-[#075cde]" />
                            Story
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#075cde]">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {item.category || "Customer Story"}
                          </span>
                        </div>
                        <span className="flex shrink-0 items-center gap-0.5 text-[#f59e0b]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-current stroke-current"
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-[14px] font-semibold leading-6 text-[#667085]">
                        {item.summary ||
                          "A Fintaraa customer shares how comparison and assisted guidance helped them choose confidently."}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#edf2f7] pt-4">
                      <span className="text-[13px] font-extrabold text-[#111625]">
                        Watch testimonial
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#075cde] text-white transition group-hover:translate-x-1 group-hover:bg-[#064cb8]">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/video-testimonials"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-6 text-[14px] font-bold text-white no-underline transition hover:bg-[#064cb8]"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Dynamic Video Lightbox Modal Popup */}
        <AnimatePresence>
          {selectedVideoUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
              onClick={() => {
                setSelectedVideoUrl(null);
                setIsPaused(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideoUrl(null);
                    setIsPaused(false);
                  }}
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/90"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex aspect-video w-full items-center justify-center bg-black">
                  <video
                    src={selectedVideoUrl}
                    autoPlay
                    controls
                    controlsList="nodownload"
                    className="h-full w-full object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
