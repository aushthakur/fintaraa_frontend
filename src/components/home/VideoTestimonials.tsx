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
import { ArrowRight, MapPin, Play, Star, X } from "lucide-react";
import {
  fetchWebsiteKnowledge,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";
import { ManagedVideoPlayer } from "@/components/common/ManagedVideoPlayer";
import {
  CarouselNavigation,
  moveInfiniteCarousel,
} from "./CarouselNavigation";

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
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
  const [selectedVideo, setSelectedVideo] = useState<WebsiteKnowledgeItem | null>(null);

  const x = useMotionValue(0);
  const baseSpeed = 0.55;

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({ type: "video", sectionKey: "video_testimonials", limit: 12 })
      .then((data) => mounted && setItems(normaliseVideoItems(data)))
      .catch(() => mounted && setItems(videoData))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [items]);

  const duplicatedVideos = [...items, ...items, ...items];

  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth || selectedVideo) return;
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
    <section className="relative overflow-hidden select-none bg-white py-12 sm:py-16">
      <style>{`
        @keyframes play-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(100,36,199,0.4); }
          50% { box-shadow: 0 0 0 14px rgba(100,36,199,0); }
        }
        .play-btn-pulse { animation: play-pulse 2.2s ease-in-out infinite; }
        .video-card-thumb { transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
        .video-card:hover .video-card-thumb { transform: scale(1.06); }
        .video-card:hover .play-ring { opacity: 1 !important; transform: scale(1) !important; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c3aed", fontWeight: 500, marginBottom: 6 }}>
              Real stories
            </p>
            <h2 className="text-[22px] sm:text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
              Customer Video Stories
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 font-normal max-w-md">
              Watch real borrowers share their financing journeys with Fintaraa.
            </p>
            <div style={{ marginTop: 10, height: 1, background: "linear-gradient(90deg, #7c3aed, rgba(124,58,237,0))", width: 160 }} />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/video-testimonials"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[12.5px] font-medium text-gray-700 transition-all hover:border-[#6424C7] hover:text-[#6424C7] hover:shadow-sm"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <CarouselNavigation
              label="video testimonials"
              disabled={loading || !trackWidth || Boolean(selectedVideo)}
              onPrevious={() =>
                moveInfiniteCarousel({ direction: "previous", track: trackRef.current, trackWidth, x, onPauseChange: setIsPaused })
              }
              onNext={() =>
                moveInfiniteCarousel({ direction: "next", track: trackRef.current, trackWidth, x, onPauseChange: setIsPaused })
              }
            />
          </div>
        </div>

        {/* Carousel viewport */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => !selectedVideo && setIsPaused(false)}
        >
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16" style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16" style={{ background: "linear-gradient(to left, white, transparent)" }} />

          {loading ? (
            <div className="flex gap-5 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[380px] w-72 shrink-0 animate-pulse rounded-3xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <motion.div
              ref={trackRef}
              style={{ x, touchAction: "pan-y" }}
              drag="x"
              dragConstraints={{ left: -((trackWidth || 2400) * (2 / 3)), right: 0 }}
              dragElastic={0.05}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={() => !selectedVideo && setIsPaused(false)}
              className="flex w-max cursor-grab gap-5 py-2 active:cursor-grabbing"
            >
              {duplicatedVideos.map((item, index) => (
                <VideoCard
                  key={`vc-${item.slug}-${index}`}
                  item={item}
                  onClick={() => {
                    setIsPaused(true);
                    if (item.videoUrl || item.youtubeUrl) setSelectedVideo(item);
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => { setSelectedVideo(null); setIsPaused(false); }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-zinc-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => { setSelectedVideo(null); setIsPaused(false); }}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-sm transition hover:bg-black/90"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Meta info bar */}
              <div className="px-6 pt-5 pb-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6424C7] to-[#9b5de5] flex items-center justify-center text-white text-[12px] font-semibold shrink-0">
                  {(selectedVideo.authorName || selectedVideo.title).charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white leading-none">{selectedVideo.authorName || selectedVideo.title}</p>
                  {selectedVideo.location && (
                    <p className="text-[11px] text-white/50 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{selectedVideo.location}
                    </p>
                  )}
                </div>
                {selectedVideo.category && (
                  <span className="ml-auto text-[11px] text-purple-300 border border-purple-800 rounded-full px-2.5 py-0.5">
                    {selectedVideo.category}
                  </span>
                )}
              </div>

              <div className="flex aspect-video w-full items-center justify-center bg-black">
                <ManagedVideoPlayer
                  src={selectedVideo.videoUrl}
                  youtubeUrl={selectedVideo.youtubeUrl}
                  title={selectedVideo.title}
                  poster={selectedVideo.coverImageUrl}
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Individual video card ──────────────────────────────────────────────────
function VideoCard({
  item,
  onClick,
}: {
  item: WebsiteKnowledgeItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="video-card group shrink-0 w-[280px] sm:w-[300px] text-left outline-none rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-[200px] overflow-hidden bg-gray-900">
        <Image
          src={item.coverImageUrl || "/assets/images/media1.png"}
          alt={item.authorName || item.title}
          fill
          unoptimized
          draggable={false}
          className="video-card-thumb object-cover select-none"
        />

        {/* Dark gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="play-ring flex h-14 w-14 items-center justify-center rounded-full bg-white opacity-90 group-hover:opacity-100 transition-all duration-300"
            style={{ boxShadow: "0 0 0 8px rgba(255,255,255,0.2)" }}
          >
            <span className="play-btn-pulse flex h-14 w-14 rounded-full items-center justify-center">
              <Play className="h-5 w-5 fill-[#6424C7] text-[#6424C7] ml-0.5" />
            </span>
          </span>
        </div>

        {/* Name + location overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p className="text-[15px] font-semibold text-white leading-tight">
            {item.authorName || item.title}
          </p>
          {item.location && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-white/75">
              <MapPin className="h-3 w-3" />
              {item.location}
            </p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Category + stars */}
        <div className="flex items-center justify-between mb-3">
          {item.category && (
            <span
              className="text-[10.5px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "#f5f3ff", color: "#6424C7" }}
            >
              {item.category}
            </span>
          )}
          <span className="flex items-center gap-0.5 ml-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </span>
        </div>

        {/* Quote */}
        <p className="text-[13px] text-gray-600 font-normal leading-relaxed line-clamp-2">
          &ldquo;{item.summary || "A Fintaraa customer shares how comparison and guided assistance helped them choose confidently."}&rdquo;
        </p>

        {/* Watch CTA */}
        <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-[#6424C7] group-hover:gap-2.5 transition-all duration-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f3ff] shrink-0">
            <Play className="h-3 w-3 fill-[#6424C7] text-[#6424C7] ml-0.5" />
          </span>
          Watch story
          <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </button>
  );
}
