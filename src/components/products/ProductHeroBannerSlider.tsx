"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import type { HomeBanner } from "@/services/homeBanners";
import {
  fetchProductHeroBanners,
  getFallbackProductHeroBanners,
  type ProductHeroCategory,
} from "@/services/productHeroBanners";

const safeDuration = (value?: number) =>
  Math.min(Math.max(Number(value || 5000), 1500), 30000);

export function ProductHeroBannerSlider({
  category,
  productName,
  productSlug,
  applyHref,
}: {
  category: ProductHeroCategory;
  productName: string;
  productSlug: string;
  applyHref: string;
}) {
  const fallbackBanners = useMemo(
    () =>
      getFallbackProductHeroBanners({
        category,
        productName,
        productSlug,
      }),
    [category, productName, productSlug],
  );
  const [banners, setBanners] = useState<HomeBanner[]>(fallbackBanners);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      const result = await fetchProductHeroBanners({
        category,
        productName,
        productSlug,
      });
      if (!active) return;
      setBanners(result.length ? result : fallbackBanners);
    });

    return () => {
      active = false;
    };
  }, [category, fallbackBanners, productName, productSlug]);

  const hasMultiple = banners.length > 1;

  return (
    <div className="relative w-full overflow-hidden bg-[#07162d]">
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[320px] lg:h-[420px] xl:h-[460px]">
        <Swiper
          modules={[Autoplay, EffectFade, A11y]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={hasMultiple}
          speed={850}
          slidesPerView={1}
          autoplay={
            hasMultiple
              ? {
                  delay: safeDuration(banners[0]?.displayDurationMs),
                  disableOnInteraction: false,
                }
              : false
          }
          className="h-full"
        >
          {banners.map((banner, index) => (
            <SwiperSlide
              key={banner._id || `${banner.image}-${index}`}
              className="h-full"
            >
              <AuthRedirectLink
                href={applyHref}
                productSlug={productSlug}
                aria-label={`Apply for ${productName}`}
                className="relative block h-full w-full overflow-hidden no-underline"
              >
                <Image
                  src={banner.image}
                  alt={banner.imageAlt || banner.title}
                  fill
                  priority={index === 0}
                  unoptimized
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-[1800ms] ease-out"
                />
              </AuthRedirectLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
