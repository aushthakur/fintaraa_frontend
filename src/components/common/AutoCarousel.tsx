"use client";

import { Children, type ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type AutoCarouselProps = {
  children: ReactNode;
  ariaLabel: string;
  mobileSlides?: number;
  tabletSlides?: number;
  desktopSlides?: number;
  wideSlides?: number;
  delay?: number;
  className?: string;
};

export function AutoCarousel({
  children,
  ariaLabel,
  mobileSlides = 2,
  tabletSlides = 3,
  desktopSlides = 4,
  wideSlides = 6,
  delay = 3200,
  className = "",
}: AutoCarouselProps) {
  const items = Children.toArray(children);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  if (!items.length) return null;

  const navigationVisibility = [
    items.length > mobileSlides ? "flex" : "hidden",
    items.length > tabletSlides ? "sm:flex" : "sm:hidden",
    items.length > desktopSlides ? "lg:flex" : "lg:hidden",
    items.length > wideSlides ? "xl:flex" : "xl:hidden",
  ].join(" ");
  const navigationPosition = className.includes("product-card-carousel")
    ? "top-[22%]"
    : className.includes("credit-card-carousel")
      ? "top-1/2 max-sm:top-[26%]"
      : "top-1/2";
  const navigationButtonClassName = `absolute z-20 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#cfe0ee] bg-white/95 text-[#075cde] shadow-[0_10px_28px_rgba(7,22,45,0.16)] backdrop-blur transition hover:border-[#075cde] hover:bg-[#075cde] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:h-11 md:w-11 ${navigationPosition} ${navigationVisibility}`;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`site-carousel relative ${className}`}
    >
      <button
        type="button"
        aria-label={`Previous ${ariaLabel}`}
        className={`${navigationButtonClassName} left-1 sm:left-1.5`}
        onClick={() => swiper?.slidePrev()}
        disabled={!swiper}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <Swiper
        modules={[A11y, Autoplay]}
        onSwiper={setSwiper}
        slidesPerView={mobileSlides}
        spaceBetween={10}
        rewind={items.length > mobileSlides}
        watchOverflow
        speed={650}
        autoplay={
          items.length > mobileSlides
            ? {
                delay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        breakpoints={{
          640: { slidesPerView: tabletSlides, spaceBetween: 14 },
          1024: { slidesPerView: desktopSlides, spaceBetween: 16 },
          1280: { slidesPerView: wideSlides, spaceBetween: 16 },
        }}
        className="h-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="h-auto!">
            <div className="h-full">{item}</div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        aria-label={`Next ${ariaLabel}`}
        className={`${navigationButtonClassName} right-1 sm:right-1.5`}
        onClick={() => swiper?.slideNext()}
        disabled={!swiper}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
