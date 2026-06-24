"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Star } from "lucide-react";
import {
  fetchWebsiteKnowledge,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

const testimonialsData: WebsiteKnowledgeItem[] = [
  {
    slug: "ananya-sharma",
    title: "Ananya Sharma",
    type: "testimonial",
    authorName: "Ananya Sharma",
    location: "Mumbai",
    authorAvatarUrl: "/assets/images/testimonials/client-1.jpg",
    summary:
      "Got my home loan options compared quickly and the documentation support was clear.",
  },
  {
    slug: "rohan-mehta",
    title: "Rohan Mehta",
    type: "testimonial",
    authorName: "Rohan Mehta",
    location: "Ahmedabad",
    authorAvatarUrl: "/assets/images/testimonials/client-2.jpg",
    summary:
      "The team helped me choose a credit card that matched my spending pattern.",
  },
  {
    slug: "aditya-nair",
    title: "Aditya Nair",
    type: "testimonial",
    authorName: "Aditya Nair",
    location: "Bengaluru",
    authorAvatarUrl: "/assets/images/testimonials/client-3.jpg",
    summary:
      "I could understand eligibility, EMI and required documents before applying.",
  },
  {
    slug: "priya-iyer",
    title: "Priya Iyer",
    type: "testimonial",
    authorName: "Priya Iyer",
    location: "Chennai",
    authorAvatarUrl: "/assets/images/testimonials/client-4.jpg",
    summary:
      "Fintaraa made the loan process feel organised, transparent and easy to track.",
  },
];

const testimonialAvatars = testimonialsData.map((item) => item.authorAvatarUrl || "");
const homeTestimonialsLimit = 12;

const normaliseTestimonials = (data: WebsiteKnowledgeItem[]) => {
  const source = data.length ? data : testimonialsData;
  const seen = new Set<string>();
  const cleaned: WebsiteKnowledgeItem[] = [];

  for (const item of source) {
    const name = item.authorName || item.title || item.slug;
    const key = String(name || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);

    cleaned.push({
      ...item,
      authorName: name,
      title: item.title || name,
      authorAvatarUrl:
        item.authorAvatarUrl ||
        testimonialAvatars[cleaned.length % testimonialAvatars.length],
      location:
        item.location ||
        testimonialsData[cleaned.length % testimonialsData.length]?.location ||
        "India",
    });

    if (cleaned.length === homeTestimonialsLimit) break;
  }

  for (const item of testimonialsData) {
    if (cleaned.length === homeTestimonialsLimit) break;
    const name = item.authorName || item.title || item.slug;
    const key = String(name || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    cleaned.push({
      ...item,
      authorAvatarUrl: testimonialAvatars[cleaned.length % testimonialAvatars.length],
    });
  }

  return cleaned.length ? cleaned : testimonialsData;
};

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<WebsiteKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  // Framer Motion shared dynamic value coordinates container
  const x = useMotionValue(0);
  const baseSpeed = 0.6; // Adjust to speed up or slow down auto-scroll smoothly

  useEffect(() => {
    let mounted = true;
    fetchWebsiteKnowledge({
      type: "testimonial",
      sectionKey: "client_testimonials",
      limit: homeTestimonialsLimit,
    })
      .then((data) => mounted && setItems(normaliseTestimonials(data)))
      .catch(() => mounted && setItems(testimonialsData))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
  }, [items]);

  const duplicatedTestimonials = [...items, ...items, ...items];

  // Framer Motion native animation loop runner (runs outside React state render cycle)
  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth) return;

    // Convert fixed pixel delta to maintain uniform velocity across varying screen refresh rates
    const currentX = x.get();
    const newX = currentX - baseSpeed * (delta / 16);

    // Loop reset boundary point: Exactly 1/3 of the triplicated track width
    const loopThreshold = trackWidth / 3;
    if (Math.abs(newX) >= loopThreshold) {
      x.set(newX + loopThreshold); // Loop back smoothly without jumping frames
    } else {
      x.set(newX);
    }
  });

  if (loading) {
    return (
      <section className="overflow-hidden select-none bg-white px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-center text-[26px] font-extrabold tracking-tight text-[#111625] md:text-[32px]">
            What Our Clients Say
          </h2>
          <div className="mt-12 flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-52 w-77.5 shrink-0 animate-pulse rounded-[20px] bg-slate-100 sm:w-87.5 md:w-95" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-16 md:px-6 lg:px-8 overflow-hidden select-none">
      <div className="mx-auto max-w-9xl">
        <div className="flex w-full flex-col items-center gap-4 sm:grid sm:grid-cols-3">
          <div className="hidden sm:block" />
          <h2 className="text-center text-[26px] font-extrabold text-[#111625] md:text-[32px] tracking-tight">
            What Our Clients Say
          </h2>
          <div className="self-center sm:justify-self-end">
            <Link
              href="/testimonials"
              className="rounded-full bg-[#12b76a] px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#0fa35e]"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Mask Carousel Viewport Container Frame */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-4 mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Edge Blur Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

          {/* Fully Synchronized Drag & Auto-Scroll Canvas Track */}
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
            className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
          >
            {duplicatedTestimonials.map((item, index) => (
              <article
                key={`testimonial-card-${item.slug}-${index}`}
                className="w-77.5 sm:w-87.5 md:w-95 shrink-0 rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-start select-none"
              >
                {/* Meta Layout Row */}
                <div className="flex items-center gap-4 pointer-events-none">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-50 bg-gray-50">
                    <Image
                      src={item.authorAvatarUrl || "/assets/images/user1.png"}
                      alt={item.authorName || item.title}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover select-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-gray-800 leading-tight">
                      {item.authorName || item.title}
                    </h3>
                    <p className="text-[12px] font-medium text-gray-400 mt-0.5">
                      {item.location}
                    </p>

                    <div className="mt-1.5 flex items-center gap-0.5 text-orange-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-current stroke-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Body */}
                <p className="mt-5 text-[14px] font-normal leading-relaxed text-gray-500/90 whitespace-normal pointer-events-none">
                  {item.summary}
                </p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
