"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Headphones, UsersRound, ShieldCheck } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import {
  fallbackHomeBanners,
  fetchHomeBanners,
  type HomeBanner,
} from "@/services/homeBanners";

const trustStats = [
  {
    value: "256-bit",
    icon: ShieldCheck,
    label: "Bank-level Security",
  },
  {
    value: "2M+",
    icon: UsersRound,
    label: "Happy Customers",
  },
  {
    value: "99.9%",
    icon: ShieldCheck,
    label: "Uptime & Reliability",
  },
  {
    value: "24/7",
    icon: Headphones,
    label: "Customer Support",
  },
];

const safeDuration = (value?: number) =>
  Math.min(Math.max(Number(value || 5000), 1500), 30000);

export function HeroSection() {
  const [banners, setBanners] = useState<HomeBanner[]>(fallbackHomeBanners);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      const result = await fetchHomeBanners();
      if (!active) return;
      setBanners(result.length ? result : fallbackHomeBanners);
      setActiveIndex(0);
    });

    return () => {
      active = false;
    };
  }, []);

  const activeBanner = banners[activeIndex] || fallbackHomeBanners[0];
  const duration = safeDuration(activeBanner.displayDurationMs);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % banners.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, banners.length, duration]);

  const hasMultiple = banners.length > 1;
  const activeDescription = useMemo(
    () =>
      activeBanner.description ||
      "Compare offers from 30+ banks and NBFCs. Apply in minutes.",
    [activeBanner.description],
  );

  return (
    <section className="bg-white py-12 lg:pt-16 lg:pb-0">
      <div className="mx-auto max-w-9xl px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row items-center">
          {/* Left Side */}
          <div className="flex flex-col md:w-[45%]">
            {activeBanner.eyebrow ? (
              <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
                {activeBanner.eyebrow}
              </p>
            ) : null}
            <h1 className="text-[28px] font-extrabold leading-[1.12] tracking-tight text-[#212529] sm:text-[32px] md:text-[46px] lg:text-[52px]">
              {activeBanner.title}
              {activeBanner.highlightText ? (
                <span className="block mt-2 font-extrabold text-[#12b76a]">
                  {activeBanner.highlightText}
                </span>
              ) : null}
            </h1>

            <p className="mt-5 max-w-md text-[15px] font-medium leading-relaxed text-[#8a94a6]">
              {activeDescription}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {activeBanner.buttonText && activeBanner.linkUrl ? (
                <Link
                  href={activeBanner.linkUrl}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#12b76a] px-7 text-[15px] font-bold text-[#12b76a] no-underline transition-colors hover:bg-emerald-50/40"
                >
                  {activeBanner.buttonText}
                </Link>
              ) : null}

              {activeBanner.secondaryButtonText &&
              activeBanner.secondaryLinkUrl ? (
                <Link
                  href={activeBanner.secondaryLinkUrl}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-8 text-[15px] font-bold text-white no-underline transition-colors hover:bg-[#0ea85f]"
                >
                  {activeBanner.secondaryButtonText}
                </Link>
              ) : null}
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex md:w-[55%] flex-col justify-end align-top pb-10">
            {/* Image */}
            <div className="w-full rounded-xl border max-sm:mt-0 border-gray-300 bg-[#fafbfc] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="relative w-full h-[45vh]">
                {banners.map((banner, index) => (
                  <Image
                    key={banner._id || `${banner.image}-${index}`}
                    src={banner.image}
                    alt={banner.imageAlt || banner.title}
                    fill
                    priority={index === 0}
                    unoptimized
                    className={`object-contain object-bottom transition-opacity duration-700 ease-in-out ${
                      index === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
            </div>

            {hasMultiple ? (
              <div className="mt-4 flex items-center justify-center gap-2">
                {banners.map((banner, index) => (
                  <button
                    key={banner._id || `${banner.title}-${index}`}
                    type="button"
                    aria-label={`Show banner ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-[#12b76a]"
                        : "w-2 bg-[#d8e3ef] hover:bg-[#9db9d1]"
                    }`}
                  />
                ))}
              </div>
            ) : null}

            {/* Trust Stats Card */}
            <div className="rounded-2xl border-2 mt-5 border-indigo-50 bg-white p-4">
              <div className="grid grid-cols-4 items-center gap-4">
                {trustStats.map(({ value, label, icon: Icon }, index) => (
                  <div
                    key={label}
                    className={`relative flex items-center gap-3 px-4 ${
                      index > 0
                        ? "before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-center text-[#2557ff]">
                      <Icon className="h-8 w-8 shrink-0" strokeWidth={1.8} />
                    </div>

                    <div className="flex flex-col">
                      <AnimatedCounter
                        value={value}
                        className="text-xl font-bold leading-none text-slate-900"
                      />

                      <span className="mt-1 whitespace-nowrap text-xs line-clamp-1 font-semibold text-gray-400">
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
