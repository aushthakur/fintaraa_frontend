"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import { Star, Play, X } from "lucide-react";
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
    summary: "Fintaraa supported me financially when I needed it the most",
    coverImageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=400",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    slug: "deepika-kumari-video-2",
    title: "Deepika Kumari",
    type: "video",
    authorName: "Deepika Kumari",
    category: "Home Loan",
    location: "Delhi",
    summary: "Fintaraa supported me financially when I needed it the most",
    coverImageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=400",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    slug: "deepika-kumari-video-3",
    title: "Deepika Kumari",
    type: "video",
    authorName: "Deepika Kumari",
    category: "Home Loan",
    location: "Delhi",
    summary: "Fintaraa supported me financially when I needed it the most",
    coverImageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=400",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];

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
      limit: 5,
    })
      .then((data) => mounted && setItems(data.length ? data : videoData))
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
    <section className="bg-white px-4 py-16 md:px-6 lg:px-8 overflow-hidden select-none">
      <div className="mx-auto max-w-9xl">
        <div className="w-full flex justify-center mb-12">
          <h2 className="text-[26px] md:text-[32px] font-extrabold text-[#111625] tracking-tight text-center">
            Video Testimonials
          </h2>
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
                <div key={index} className="h-64 w-65 shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-72.5 md:w-82.5" />
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
              className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
            >
            {duplicatedVideos.map((item, index) => (
              <button
                key={`video-card-${item.slug}-${index}`}
                type="button"
                onClick={() => {
                  setIsPaused(true);
                  setSelectedVideoUrl(item.videoUrl || null);
                }}
                className="w-65 sm:w-72.5 md:w-82.5 min-w-65 sm:min-w-72.5 md:min-w-82.5 shrink-0 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between text-left outline-none transition-transform duration-200 hover:scale-[1.01]"
              >
                {/* Image Frame Thumbnail */}
                <div className="relative aspect-[1.62/1] w-full bg-slate-900 overflow-hidden pointer-events-none">
                  <Image
                    src={item.coverImageUrl || "/assets/images/media1.png"}
                    alt={item.authorName || item.title}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/40" />

                  {/* Overlay Quote Text */}
                  <div className="absolute top-4 left-4 right-6 text-white z-10">
                    <p className="text-[13px] sm:text-[14px] font-semibold leading-relaxed text-white/95 tracking-wide">
                      {item.summary}
                    </p>
                  </div>

                  {/* Play Button Overlay Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 opacity-85">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center ring-1 ring-white/40 text-white shadow-md">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info Description Block */}
                <div className="p-4 w-full bg-white pointer-events-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                      <h3 className="text-[14px] sm:text-[15px] font-bold text-gray-800 leading-tight">
                        {item.authorName || item.title}
                      </h3>
                      {item.category && (
                        <p className="text-[12px] font-bold text-gray-700 mt-0.5">
                          {item.category}
                        </p>
                      )}
                      <p className="text-[12px] font-medium text-gray-400 mt-0.5">
                        {item.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5 text-orange-500 mt-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-current stroke-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            </motion.div>
          )}
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
                className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()} // Stop closing click propagation inside video frame boundaries
              >
                {/* Close Action Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideoUrl(null);
                    setIsPaused(false);
                  }}
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/90 border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Main Video Box Canvas Element */}
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                  <video
                    src={selectedVideoUrl}
                    autoPlay
                    controls
                    controlsList="nodownload" // Clean layout option disabling simple direct saving avenues
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
