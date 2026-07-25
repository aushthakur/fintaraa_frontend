"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { A11y, Autoplay, EffectFade, Pagination } from "swiper/modules";
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

function ResponsiveBannerImage({
  banner,
  eager,
}: {
  banner: HomeBanner;
  eager: boolean;
}) {
  const alt = banner.imageAlt || banner.title;
  const { props: desktopImage } = getImageProps({
    src: banner.image,
    alt,
    width: 1600,
    height: 640,
    unoptimized: true,
  });
  const { props: mobileImage } = getImageProps({
    src: banner.mobileImage || banner.image,
    alt,
    width: 900,
    height: 1200,
    unoptimized: true,
  });

  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source
        media="(max-width: 767px)"
        srcSet={mobileImage.srcSet || mobileImage.src}
      />
      <img
        {...desktopImage}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

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
      <div
        className="relative aspect-[3/4] w-full overflow-hidden md:aspect-[5/2]"
      >
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, A11y]}
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
          pagination={hasMultiple ? { clickable: true } : false}
          className="product-hero-swiper h-full"
        >
          {banners.map((banner, index) => (
            <SwiperSlide
              key={banner._id || `${banner.image}-${index}`}
              className="h-full"
            >
              <div className="relative h-full w-full overflow-hidden">
                <ResponsiveBannerImage banner={banner} eager={index === 0} />

                {category === "loan" ? (
                  <>
                    <AuthRedirectLink
                      href={applyHref}
                      productSlug={productSlug}
                      aria-label={`Apply for ${productName}`}
                      className="absolute inset-0 z-10 no-underline md:hidden"
                    >
                      <span className="sr-only">Apply for {productName}</span>
                    </AuthRedirectLink>
                    <AuthRedirectLink
                      href={applyHref}
                      productSlug={productSlug}
                      aria-label={`${banner.buttonText || "Apply now"} for ${productName}`}
                      className="absolute left-[5.75%] top-[77%] z-10 hidden h-[10.5%] w-[13.2%] rounded-xl no-underline md:block"
                    >
                      <span className="sr-only">
                        {banner.buttonText || "Apply now"}
                      </span>
                    </AuthRedirectLink>
                    <Link
                      href={
                        banner.secondaryLinkUrl || "#loan-emi-calculator"
                      }
                      aria-label={
                        banner.secondaryButtonText || "Calculate loan EMI"
                      }
                      className="absolute left-[20%] top-[77%] z-10 hidden h-[10.5%] w-[14.9%] rounded-xl no-underline md:block"
                    >
                      <span className="sr-only">
                        {banner.secondaryButtonText || "Calculate EMI"}
                      </span>
                    </Link>
                  </>
                ) : (
                  <AuthRedirectLink
                    href={applyHref}
                    productSlug={productSlug}
                    aria-label={`Apply for ${productName}`}
                    className="absolute inset-0 z-10 no-underline"
                  >
                    <span className="sr-only">Apply for {productName}</span>
                  </AuthRedirectLink>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
