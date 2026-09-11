"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import {
  fetchWebsiteKnowledge,
  type WebsiteKnowledgeItem,
} from "@/services/websiteKnowledge";

const testimonialsData: WebsiteKnowledgeItem[] = [
  {
    slug: "rajesh-kumar-personal-loan",
    title: "Rajesh K.",
    type: "testimonial",
    authorName: "Rajesh K.",
    location: "Bengaluru",
    authorAvatarUrl: "/assets/images/testimonials/client-1.jpg",
    rating: 5,
    tags: ["Personal Loan", "₹8 Lakhs", "ICICI Bank", "48 hours"],
    summary:
      "Got my ₹8L personal loan from ICICI in 48 hours. The eligibility tool showed me exactly which documents I needed - no back and forth.",
  },
  {
    slug: "sunita-m-term-insurance",
    title: "Sunita M.",
    type: "testimonial",
    authorName: "Sunita M.",
    location: "Pune",
    authorAvatarUrl: "/assets/images/testimonials/client-2.jpg",
    rating: 4.5,
    tags: ["Term Insurance", "₹520/mo", "HDFC Life"],
    summary:
      "Compared 6 term insurance plans in under 10 minutes. Went with HDFC Life at ₹520/month - would never have found that rate on my own.",
  },
  {
    slug: "megha-credit-card",
    title: "Megha S.",
    type: "testimonial",
    authorName: "Megha S.",
    location: "Delhi",
    authorAvatarUrl: "/assets/images/testimonials/client-3.jpg",
    rating: 5,
    tags: ["Credit Card", "SBI Card", "Cashback"],
    summary:
      "I was choosing between 4 cashback cards. Fintaraa showed annual fee, reward rate and eligibility clearly, so I picked the SBI card without confusion.",
  },
  {
    slug: "arvind-home-loan",
    title: "Arvind R.",
    type: "testimonial",
    authorName: "Arvind R.",
    location: "Chennai",
    authorAvatarUrl: "/assets/images/testimonials/client-4.jpg",
    rating: 4.5,
    tags: ["Home Loan", "₹42 Lakhs", "HDFC Bank", "12 days"],
    summary:
      "For my ₹42L home loan, the EMI calculator and document checklist saved time. HDFC approval came through in 12 days with clear updates.",
  },
];

const testimonialAvatars = testimonialsData.map(
  (item) => item.authorAvatarUrl || "",
);
const homeTestimonialsLimit = 12;

const normaliseTestimonials = (data: WebsiteKnowledgeItem[]) => {
  const source = data.length ? data : testimonialsData;
  const seen = new Set<string>();
  const cleaned: WebsiteKnowledgeItem[] = [];

  for (const item of source) {
    const name = item.authorName || item.title || item.slug;
    const key = String(name || "")
      .trim()
      .toLowerCase();
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
      rating:
        item.rating ||
        testimonialsData[cleaned.length % testimonialsData.length]?.rating ||
        5,
      tags: item.tags?.length
        ? item.tags
        : testimonialsData[cleaned.length % testimonialsData.length]?.tags ||
          [],
    });

    if (cleaned.length === homeTestimonialsLimit) break;
  }

  for (const item of testimonialsData) {
    if (cleaned.length === homeTestimonialsLimit) break;
    const name = item.authorName || item.title || item.slug;
    const key = String(name || "")
      .trim()
      .toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    cleaned.push({
      ...item,
      authorAvatarUrl:
        testimonialAvatars[cleaned.length % testimonialAvatars.length],
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
      <section className="relative overflow-hidden select-none bg-linear-to-b from-[#fafafa] to-white px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[26px] font-semibold tracking-tight text-[#111625] md:text-[32px]">
              What Our Clients Say
            </h2>
            <Link
              href="/testimonials"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-5 text-[13px] font-semibold text-white no-underline transition hover:bg-[#4c1d95]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-52 w-77.5 shrink-0 animate-pulse rounded-xl bg-slate-100 sm:w-87.5 md:w-95"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden select-none bg-[#fafafa] py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5b21b6]" />
              <h2 className="text-[17px] font-semibold text-[#0f172a] sm:text-[20px]">
                Customer Stories
              </h2>
            </div>
            <p className="text-[12px] font-normal text-[#64748b]">
              Real feedback from customers across India
            </p>
          </div>
          <Link
            href="/testimonials"
            className="inline-flex h-8.5 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#5b21b6] px-3.5 text-[12px] font-medium text-white no-underline transition hover:bg-[#4c1d95]"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mask Carousel Viewport Container Frame */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
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
                className="w-80 shrink-0 rounded-2xl border border-white/60 bg-white/60 p-6 flex flex-col justify-start select-none shadow-[0_8px_30px_rgba(91,33,182,0.04)] backdrop-blur-xl sm:w-95 md:w-105"
              >
                {/* Meta Layout Row */}
                <div className="flex items-start justify-between gap-4 pointer-events-none">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-[#07162d] leading-tight">
                      {item.authorName || item.title}
                    </h3>
                    <p className="text-[12px] font-medium text-[#8090a4] mt-0.5">
                      {item.location}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5 text-orange-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(item.rating || 5)
                            ? "fill-current stroke-current"
                            : "stroke-current text-orange-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Body */}
                <p className="mt-5 text-[14px] font-semibold leading-relaxed text-[#52657d] whitespace-normal pointer-events-none">
                  {item.summary}
                </p>

                {item.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2 pointer-events-none">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold text-[#087443]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
