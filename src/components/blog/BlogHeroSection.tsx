"use client";

import Image from "next/image";
import { Search } from "lucide-react";

export function BlogHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 font-sans antialiased md:px-8 lg:px-16">
      {/* Top left  */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/* Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/* Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>
     
      {/* Decorative Accent Background Panels from image_ee0a25.png */}
      <div className="absolute left-0 top-0 -z-10 h-36 w-36 rounded-br-full bg-[#edf5fd] opacity-80" />
      <div className="absolute left-0 top-12 -z-10 h-16 w-16 rounded-br-full bg-[#deebf9] opacity-50" />

      {/* Two-Column Structured Hero Grid */}
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* LEFT COMPARTMENT: Brand Headers, Copy Messaging & Search Bar */}
        <div className="space-y-6">
          <h1 className="max-w-xl text-[38px] font-extrabold leading-[1.15] tracking-tight text-[#2d3142] md:text-[46px]">
            Financial Insights, <br />
            Market <span className="text-[#005ca8]">Trends & Money</span> <br />
            Management Tips
          </h1>

          <p className="max-w-lg text-[14px] font-medium leading-[1.6] text-[#939ca3] md:text-[15px]">
            Stay updated with expert analysis, investment strategies, A complete guide to Systematic Investment Plans, their benefits, fintech innovations, and personal finance guides.
          </p>

          {/* Precision Match Mock Search Component */}
          <div className="max-w-md pt-2">
            <div className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-[#e1ecf8] bg-[#edf4fe] transition-colors focus-within:border-[#005ca8]">
              <div className="flex w-full items-center gap-1.5 px-4 text-[13px] font-medium text-[#7d8893]">
                <span>Search</span>
                {/* Accent Highlighted "blog" Token */}
                <span className="rounded bg-[#ffe300] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black">
                  blog
                </span>
                <span>articles ...</span>
              </div>

              {/* Square Deep Blue Icon CTA Button */}
              <button
                type="button"
                className="flex h-full w-14 shrink-0 items-center justify-center bg-[#005ca8] text-white transition-colors hover:bg-[#004a87]"
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: 3D Graphics Portfolio Composition Area */}
        <div className="relative flex min-h-75 items-center justify-center bg-[radial-gradient(circle,#f2f7fe_0%,rgba(255,255,255,0)_75%)] md:min-h-90">
          {/* Main Visual Image Wrapper Slot */}
          <div className="relative h-70 w-full md:h-85">
            <Image
              src="/assets/images/blog-hero.png"
              alt="Financial Analysis Mobile Graphs Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Standby UI fallback nodes for 3D coin/pie graph structure rendering mockup layers */}
          <div className="pointer-events-none absolute inset-0 -z-10 hidden items-center justify-center">
            <div className="h-48 w-48 animate-spin rounded-full border-4 border-dashed border-sky-100" style={{ animationDuration: '40s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}