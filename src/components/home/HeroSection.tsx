"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  HandCoins,
  LockKeyhole,
  ShieldCheck,
  Star,
  Umbrella,
  UsersRound,
} from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import {
  fallbackHomeBanners,
  fetchHomeBanners,
  type HomeBanner,
} from "@/services/homeBanners";

const trustStats = [
  { value: "2M+", label: "customers", icon: UsersRound },
  { value: "30+", label: "banks & NBFCs", icon: ShieldCheck },
  { value: "256-bit", label: "secure", icon: LockKeyhole },
];

const proofChips = ["RBI registered", "ISO 27001 certified", "No CIBIL impact"];

const productTabs = [
  { label: "Loan", icon: HandCoins },
  { label: "Insurance", icon: Umbrella },
  { label: "Credit Card", icon: CreditCard },
];

const safeDuration = (value?: number) =>
  Math.min(Math.max(Number(value || 5000), 1500), 30000);

const resolveBannerHref = (buttonText?: string, href?: string) => {
  if (/eligibility/i.test(buttonText || "")) return "/#eligibility-check";
  return href || "";
};

export function HeroSection() {
  const [banners, setBanners] = useState<HomeBanner[]>(fallbackHomeBanners);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(productTabs[0].label);

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
  const hasMultiple = banners.length > 1;

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % banners.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, banners.length, duration]);

  const activeDescription = useMemo(
    () =>
      activeBanner.description ||
      "One secure check. Multiple trusted offers. No CIBIL impact.",
    [activeBanner.description],
  );
  const primaryHref =
    resolveBannerHref(
      activeBanner.secondaryButtonText,
      activeBanner.secondaryLinkUrl,
    ) || "/#eligibility-check";
  const secondaryHref =
    resolveBannerHref(activeBanner.buttonText, activeBanner.linkUrl) ||
    "/products";

  return (
    <section className="relative overflow-hidden bg-white px-4 py-6 md:px-6 lg:px-8 lg:py-5">
      <div className="mx-auto max-w-9xl">
        <div className="grid overflow-hidden rounded-2xl bg-white lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-8 lg:py-12">
            <div className="flex flex-wrap gap-2">
              {proofChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#0b5cab]"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {chip}
                </span>
              ))}
            </div>

            {activeBanner.eyebrow ? (
              <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0f7a4d]">
                {activeBanner.eyebrow}
              </p>
            ) : null}

            <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-[1.08] tracking-tight text-[#07162d] sm:text-[42px] lg:text-[54px]">
              {activeBanner.title}
              {activeBanner.highlightText ? (
                <span className="block text-[#075cde]">
                  {activeBanner.highlightText}
                </span>
              ) : null}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] font-medium leading-7 text-[#4b5f78] sm:text-[17px]">
              {activeDescription}
            </p>

            <div className="mt-7 grid max-w-lg gap-3 sm:grid-cols-3">
              {["100% free", "Instant results", "No hidden charges"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[13px] font-semibold text-[#0b315f]"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#0f7a4d]" />
                    {item}
                  </div>
                ),
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-6 text-[14px] font-semibold text-white no-underline transition hover:bg-[#064cb8]"
              >
                Check my eligibility - free & instant
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#cfe3f7] bg-white px-6 text-[14px] font-semibold text-[#075cde] no-underline transition hover:border-[#075cde]"
              >
                View all products
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {trustStats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white p-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#075cde]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <AnimatedCounter
                      value={value}
                      className="block text-[20px] font-bold leading-none text-[#07162d]"
                    />
                    <span className="mt-1 block text-[12px] font-bold text-[#61748f]">
                      {label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-130 bg-[#dceeff] sm:min-h-140 lg:min-h-full">
            {banners.map((banner, index) => (
              <Image
                key={banner._id || `${banner.image}-${index}`}
                src={banner.image}
                alt={banner.imageAlt || banner.title}
                fill
                priority={index === 0}
                unoptimized
                className={`object-cover transition-opacity duration-700 ease-in-out ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-[#061a3d]/65 via-[#061a3d]/12 to-transparent" />
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 sm:left-8 sm:right-8 sm:top-8">
              <div className="rounded-xl bg-white/90 px-3 py-2 backdrop-blur">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#07162d]">
                  <Star className="h-4 w-4 fill-[#f8b400] text-[#f8b400]" />
                  4.8 Google rating
                </div>
              </div>
              {hasMultiple ? (
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 backdrop-blur">
                  {banners.map((banner, index) => (
                    <button
                      key={banner._id || `${banner.title}-${index}`}
                      type="button"
                      aria-label={`Show banner ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-7 bg-[#075cde]"
                          : "w-2 bg-[#b8c8d9] hover:bg-[#7d93aa]"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 backdrop-blur sm:bottom-6 sm:left-auto sm:right-6 sm:w-97.5 sm:p-5 lg:right-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[18px] font-bold text-[#07162d]">
                    Check Your Eligibility
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-[#61748f]">
                    Takes 30 seconds. No hard enquiry.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#087443]">
                  100% secure
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {productTabs.map(({ label, icon: Icon }) => {
                  const active = selectedProduct === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedProduct(label)}
                      className={`flex h-10 items-center justify-center gap-1.5 rounded-xl border text-[12px] font-semibold transition ${
                        active
                          ? "border-[#075cde] bg-[#075cde] text-white"
                          : "border-[#d7e5f3] bg-white text-[#344054] hover:border-[#075cde]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3">
                <label className="block">
                  <span className="text-[12px] font-semibold text-[#344054]">
                    Full Name
                  </span>
                  <input
                    aria-label="Full name"
                    placeholder="Enter your full name"
                    className="mt-1 h-11 w-full rounded-xl border border-[#d7e5f3] bg-white px-3 text-[13px] font-semibold outline-none transition placeholder:text-[#98a2b3] focus:border-[#075cde]"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-semibold text-[#344054]">
                    Mobile Number
                  </span>
                  <div className="mt-1 flex h-11 overflow-hidden rounded-xl border border-[#d7e5f3] bg-white focus-within:border-[#075cde]">
                    <span className="flex items-center border-r border-[#e4edf5] px-3 text-[13px] font-bold text-[#344054]">
                      +91
                    </span>
                    <input
                      aria-label="Mobile number"
                      placeholder="Enter mobile number"
                      className="min-w-0 flex-1 px-3 text-[13px] font-semibold outline-none placeholder:text-[#98a2b3]"
                    />
                  </div>
                </label>
                <Link
                  href="/#eligibility-check"
                  className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[14px] font-bold text-white no-underline transition hover:bg-[#064cb8]"
                >
                  Check Eligibility
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-center text-[11px] font-bold text-[#667085]">
                  Your information is encrypted and never sold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
