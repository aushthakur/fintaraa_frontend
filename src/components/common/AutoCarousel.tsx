"use client";

import { Children, type ReactNode } from "react";
import { A11y, Autoplay, Navigation } from "swiper/modules";
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

  if (!items.length) return null;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`site-carousel relative ${className}`}
    >
      <Swiper
        modules={[A11y, Autoplay, Navigation]}
        slidesPerView={mobileSlides}
        spaceBetween={10}
        navigation={items.length > mobileSlides}
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
    </div>
  );
}
