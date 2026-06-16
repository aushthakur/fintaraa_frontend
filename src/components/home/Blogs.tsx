"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  image: string; // Dynamic path string for unique card images
}

// 1. Updated Data Object: You can now change any single card image path here!
const blogPostsData: BlogPost[] = [
  { 
    id: 1, 
    title: "What is a Hard Inquiry vs Soft Inquiry in CIBIL?", 
    image: "/assets/banks/visa-card.png" 
  },
  { 
    id: 2, 
    title: "What is Gold Loan? Meaning, Process, Eligibility & Interest Rates in India (2026)", 
    image: "/assets/banks/visa-card.png" // Replace with your custom gold loan asset path
  },
  { 
    id: 3, 
    title: "What is Gold Loan? Meaning, Process, Eligibility & Interest Rates in India (2026)", 
    image: "/assets/banks/visa-card.png" 
  },
  { 
    id: 4, 
    title: "What is Loan Grading? Meaning, Types & Loan Grading System Explained", 
    image: "/assets/banks/visa-card.png" // Replace with your custom grading asset path
  },
];

export function RecentBlogs() {
  // Triplicate array to guarantee continuous structural real-estate for looping
  const duplicatedBlogs = [...blogPostsData, ...blogPostsData, ...blogPostsData];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  // Framer Motion shared dynamic value coordinates container
  const x = useMotionValue(0);
  const baseSpeed = 0.8; // Adjust to speed up or slow down auto-scroll smoothly

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth);
    }
  }, []);

  // Framer Motion native animation loop runner
  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth) return;

    const currentX = x.get();
    const newX = currentX - baseSpeed * (delta / 16);

    // Loop reset boundary point: Exactly 1/3 of the triplicated track width
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
        
     {/* Header Section */}
<div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 items-center mb-10 w-full">
  {/* Left Column: Left Empty to Balance the Grid layout */}
  <div className="hidden sm:block" />

  {/* Center Column: Perfectly centered text alignment */}
  <h2 className="text-[24px] md:text-[28px] font-bold text-[#111625] tracking-tight text-center">
    Recent Blogs
  </h2>

  {/* Right Column: Button pushed cleanly to the far right end */}
  <div className="self-center sm:justify-self-end">
    <Link 
      href="/blogs" 
      className="rounded-full bg-[#12b76a] px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#0fa35e] whitespace-nowrap select-none"
    >
      View All Blogs
    </Link>
  </div>
</div>
        {/* Mask Carousel Viewport Container Frame */}
        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Edge Blur Overlays */}
          {/* <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" /> */}
          {/* <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" /> */}

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
            {duplicatedBlogs.map((post, index) => (
              <div 
                key={`blog-card-${post.id}-${index}`}
                className="w-65 sm:w-72.5 md:w-77.5 shrink-0"
              >
                {/* 2. Dynamic Image Component reading directly from item object configuration properties */}
                <div className="relative aspect-4/3 w-full rounded-2xl bg-[#dadada] mb-4 overflow-hidden shadow-xs pointer-events-none">
                  <Image
                    src={post.image} // Dynamic variable input source mapped here!
                    alt={post.title}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover select-none"
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-[15px] md:text-[16px] font-bold text-[#111625] leading-snug tracking-tight whitespace-normal pointer-events-none select-none">
                  {post.title}
                </h3>
              </div>
            ))}
          </motion.div>
        </div>

       

      </div>
    </section>
  );
}