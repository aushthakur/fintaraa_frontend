"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const HOME_BANNERS = [
  {
    id: "business-loan",
    title: "Business Loans for a Bigger Tomorrow",
    image: "/assets/banners/business-loan-banner.png",
    href: "/products/business-loan",
  },
  {
    id: "personal-loan",
    title: "Personal Loans for a Brighter You",
    image: "/assets/banners/personal-loan-banner.png",
    href: "/products/personal-loan",
  },
  {
    id: "car-loan",
    title: "Car Loans for a Bigger Journey",
    image: "/assets/banners/car-loan-banner.png",
    href: "/products/car-loan",
  },
  {
    id: "insurance",
    title: "Personal Accident Insurance - Be Prepared for Life's Unexpected Turns",
    image: "/assets/banners/insurance-banner.png",
    href: "/products/personal-accident-insurance",
  },
];

export function HomeBannerCarousel() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  return (
    <section
      aria-label="Promotional Banners"
      className="group relative w-full overflow-hidden bg-white pt-2.5 pb-2 lg:pt-1 lg:pb-6"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
          {/* Previous Slide Button */}
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            disabled={!swiper}
            aria-label="Previous banner"
            className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 z-20 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/70 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 disabled:opacity-0 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Next Slide Button */}
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            disabled={!swiper}
            aria-label="Next banner"
            className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 z-20 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/70 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 disabled:opacity-0 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Swiper Carousel */}
          <Swiper
            modules={[A11y, Autoplay, Navigation, Pagination]}
            onSwiper={setSwiper}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            speed={500}
            autoplay={{
              delay: 2600,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="w-full home-banner-swiper"
          >
            {HOME_BANNERS.map((banner, index) => (
              <SwiperSlide key={banner.id}>
                <Link
                  href={banner.href}
                  className="block w-full cursor-pointer overflow-hidden focus:outline-none"
                  aria-label={banner.title}
                >
                  <div className="relative w-full aspect-[2.85/1] sm:aspect-[3/1] max-h-[320px] overflow-hidden bg-slate-100">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      priority={index === 0}
                      unoptimized={true}
                      className="object-cover object-center select-none transition-all duration-500 hover:brightness-[1.02]"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
