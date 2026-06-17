"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

interface PressPost {
  id: number;
  category: string;
  title: string;
  date: string;
  image: string;
}

const pressData: PressPost[] = [
  {
    id: 1,
    category: "Investor",
    title: "Productboard and Gainsight Partnership P ...",
    date: "01th June, 2026",
    image: "/assets/images/media1.png", // Replace with your asset paths
  },
  {
    id: 2,
    category: "Investor",
    title: "Productboard and Gainsight Partnership P ...",
    date: "01th June, 2026",
    image: "/assets/images/media2.png",
  },
  {
    id: 3,
    category: "Investor",
    title: "Productboard and Gainsight Partnership P ...",
    date: "01th June, 2026",
    image: "/assets/images/media3.png",
  },
  {
    id: 4,
    category: "Investor",
    title: "Productboard and Gainsight Partnership P ...",
    date: "01th June, 2026",
    image: "/assets/images/media4.png",
  },
];

export function MediaPressRelease() {
  // Triplicate array to guarantee continuous structural real-estate for looping tracks
  const duplicatedPress = [...pressData, ...pressData, ...pressData];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  // Hardware-accelerated position stream container
  const x = useMotionValue(0);
  const baseSpeed = 0.6; // Adjust pace speed safely here

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth);
    }
  }, []);

  // Framer native frame-rate independent rendering loop runner
  useAnimationFrame((_, delta) => {
    if (isPaused || !trackWidth) return;

    const currentX = x.get();
    const newX = currentX - baseSpeed * (delta / 16);

    // Reset loop point when exactly 1/3 of the element has slid out of view
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
        {/* Header Layout Grid: Centered text with end actions */}
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 items-center mb-10 w-full">
          <div className="hidden sm:block" />{" "}
          {/* Left empty balancer layout block */}
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#111625] tracking-tight text-center">
            Media & Press Release
          </h2>
          <div className="self-center sm:justify-self-end">
            <Link
              href="/media"
              className="rounded-full bg-[#12b76a] px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#0fa35e] whitespace-nowrap select-none shadow-xs"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Carousel Window Mask Viewport Frame */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Edge Blur linears */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

          {/* Interactive Motion Track Canvas */}
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
            {duplicatedPress.map((post, index) => (
              <article
                key={`press-card-${post.id}-${index}`}
                className="w-65 sm:w-70 md:w-73.75 shrink-0 rounded-2xl border border-gray-100/80 bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-shadow flex flex-col"
              >
                {/* Media Image Thumbnail Block Frame */}
                <div className="relative aspect-[1.38/1] w-full bg-gray-100 pointer-events-none">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover select-none"
                  />
                </div>

                {/* Meta Summary Container Panel */}
                <div className="p-4 flex flex-col justify-between flex-1 pointer-events-none">
                  <div>
                    <span className="text-[12px] font-medium text-gray-400 block tracking-tight">
                      {post.category}
                    </span>
                    <h3 className="text-[14px] md:text-[15px] font-bold text-[#111625] leading-snug tracking-tight mt-1 whitespace-normal">
                      {post.title}
                    </h3>
                  </div>

                  {/* Card Actions Bottom Row Layout */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-50/60 pt-3">
                    <span className="text-[12px] font-medium text-gray-400">
                      {post.date}
                    </span>
                    <span className="text-[14px] font-bold text-[#12b76a]">
                      ➔
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
