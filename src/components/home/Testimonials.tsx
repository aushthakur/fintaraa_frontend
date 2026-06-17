"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Star } from "lucide-react";

interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  avatar: string;
  text: string;
}

const testimonialsData: TestimonialItem[] = [
  {
    id: 1,
    name: "Ramesh Kumar",
    location: "Delhi",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Got ₹25 Lakh Home Loan approved in 3 days. The team was very helpful",
  },
  {
    id: 2,
    name: "Ramesh Kumar",
    location: "Delhi",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    text: "The attention to detail and design sensibility is unmatched. Every corner of our space reflects thoughtful planning and refined aesthetics. It truly feels like a personalized masterpiece.",
  },
  {
    id: 3,
    name: "Ramesh Kumar",
    location: "Delhi",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Working with them was an exceptional experience. They balanced creativity with practicality, delivering a space that is not only beautiful but also perfectly suited to our lifestyle.",
  },
  {
    id: 4,
    name: "Ramesh Kumar",
    location: "Delhi",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Working with them was an exceptional experience. They balanced creativity with practicality, delivering a space that is not only beautiful but also perfectly suited to our lifestyle.",
  },
];

export function Testimonials() {
  // Triplicate array to guarantee continuous structural real-estate for looping
  const duplicatedTestimonials = [
    ...testimonialsData,
    ...testimonialsData,
    ...testimonialsData,
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  // Framer Motion shared dynamic value coordinates container
  const x = useMotionValue(0);
  const baseSpeed = 0.6; // Adjust to speed up or slow down auto-scroll smoothly

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth);
    }
  }, []);

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

  return (
    <section className="bg-white px-4 py-16 md:px-6 lg:px-8 overflow-hidden select-none">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-center text-[26px] font-extrabold text-[#111625] md:text-[32px] tracking-tight">
          What Our Clients Say
        </h2>

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
                key={`testimonial-card-${item.id}-${index}`}
                className="w-77.5 sm:w-87.5 md:w-95 shrink-0 rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-start select-none"
              >
                {/* Meta Layout Row */}
                <div className="flex items-center gap-4 pointer-events-none">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-50 bg-gray-50">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover select-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-gray-800 leading-tight">
                      {item.name}
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
                  {item.text}
                </p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
