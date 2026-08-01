"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { A11y, Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { navigateToProductSection } from "@/lib/productSectionNavigation";
import type { HomeBanner } from "@/services/homeBanners";
import {
  fetchProductHeroBanners,
  type ProductHeroCategory,
} from "@/services/productHeroBanners";

const safeDuration = (value?: number) =>
  Math.min(Math.max(Number(value || 5000), 1500), 30000);

const primaryButtonClassName =
  "group items-center justify-center gap-1.5 overflow-hidden rounded-[clamp(0.55rem,0.8vw,0.9rem)] bg-linear-to-br from-[#2cc5ff] to-[#1686f0] px-2 text-center font-extrabold text-white no-underline shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white";

const secondaryButtonClassName =
  "group items-center justify-center gap-1.5 overflow-hidden rounded-[clamp(0.55rem,0.8vw,0.9rem)] border-2 border-white/80 bg-[#14283f]/95 px-2 text-center font-extrabold text-white no-underline shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:bg-[#1b3858] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white";

function SecondaryBannerAction({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    navigateToProductSection(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label={label}
      className={className}
    >
      <span className="truncate">{label}</span>
      <ArrowRight className="h-[1em] w-[1em] shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

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
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      setIsLoading(true);
      const result = await fetchProductHeroBanners({
        category,
        productSlug,
      });
      if (!active) return;
      setBanners(result);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [category, productSlug]);

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label={`Loading ${productName} banners`}
        className="aspect-[2/3] w-full animate-pulse bg-slate-100 md:aspect-[12/5]"
      />
    );
  }

  if (!banners.length) return null;

  const hasMultiple = banners.length > 1;

  return (
    <div className="relative w-full overflow-hidden bg-[#07162d]">
      <div className="relative aspect-[2/3] w-full overflow-hidden md:aspect-[12/5]">
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
              <div
                className="relative h-full w-full overflow-hidden"
                data-analytics-banner
                data-analytics-name={banner.title || `${productName} banner`}
                data-analytics-placement={`product_hero:${productSlug}`}
              >
                <ResponsiveBannerImage banner={banner} eager={index === 0} />
                {banner.contentOverlay ? (
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.83)_35%,rgba(255,255,255,0)_62%)] md:bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_34%,rgba(255,255,255,0)_62%)]" />
                ) : (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-t from-[#06152d]/90 via-[#06152d]/30 to-transparent md:hidden" />
                )}

                {(() => {
                  const staleProductLink = `/products/${productSlug}`;
                  const configuredPrimaryHref = String(
                    banner.linkUrl || "",
                  ).trim();
                  const primaryHref =
                    configuredPrimaryHref &&
                    configuredPrimaryHref !== staleProductLink
                      ? configuredPrimaryHref
                      : applyHref;
                  const primaryLabel = banner.buttonText || "Apply Now";
                  const secondaryHref =
                    banner.secondaryLinkUrl ||
                    (category === "loan"
                      ? "#loan-emi-calculator"
                      : "#insurance-compare-plans");
                  const secondaryLabel =
                    banner.secondaryButtonText ||
                    (category === "loan" ? "Calculate EMI" : "Compare Plans");

                  if (banner.contentOverlay) {
                    return (
                      <div className="absolute inset-0 z-20 mx-auto w-full max-w-9xl px-4 sm:px-7 md:px-8 lg:px-10">
                        <div className="flex h-full items-start pt-[5%] md:items-center md:pt-0">
                          <div className="w-full max-w-full sm:max-w-[78%] md:max-w-[50%] lg:max-w-[43%]">
                            <h1 className="product-banner-title max-w-3xl text-[clamp(1rem,4.8vw,1.6rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-[#07162d] md:text-balance md:text-[clamp(1.35rem,2.6vw,1.75rem)] md:leading-[1.06] lg:text-[clamp(2rem,3.35vw,3.45rem)] lg:leading-[1.04]">
                              {banner.title || productName}
                            </h1>
                            {banner.description ? (
                              <p className="mt-2 max-w-2xl text-[9px] font-semibold leading-[14px] tracking-normal text-[#48637b] min-[360px]:text-[10px] min-[360px]:leading-4 sm:text-[12px] md:mt-3 md:text-[12px] md:leading-5 lg:mt-4 lg:text-[clamp(0.82rem,1.15vw,1.05rem)] lg:leading-7">
                                {banner.description}
                              </p>
                            ) : null}

                            <div className="swiper-no-swiping mt-3 grid max-w-md grid-cols-2 gap-2 md:mt-4 md:max-w-full md:gap-2.5 lg:mt-6 lg:flex lg:max-w-none lg:flex-wrap lg:gap-3">
                              <AuthRedirectLink
                                href={primaryHref}
                                productSlug={productSlug}
                                aria-label={`${primaryLabel} for ${productName}`}
                                className={`${primaryButtonClassName} flex h-8 text-[9px] min-[360px]:h-9 min-[360px]:text-[10px] md:h-10 md:px-3 md:text-[11px] lg:h-12 lg:px-6 lg:text-[13px]`}
                              >
                                <span className="truncate">{primaryLabel}</span>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 md:h-4 md:w-4" />
                              </AuthRedirectLink>
                              <SecondaryBannerAction
                                href={secondaryHref}
                                label={secondaryLabel}
                                className={`${secondaryButtonClassName} flex h-8 text-[9px] min-[360px]:h-9 min-[360px]:text-[10px] md:h-10 md:px-3 md:text-[11px] lg:h-12 lg:px-6 lg:text-[13px]`}
                              />
                            </div>

                            <p className="mt-4 hidden whitespace-nowrap text-[11px] font-bold tracking-wide text-[#668096] lg:block">
                              Secure application&nbsp;&nbsp;•&nbsp;&nbsp;Guided support
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="swiper-no-swiping absolute bottom-11 left-4 right-4 z-20 grid grid-cols-2 gap-2 md:hidden">
                        <AuthRedirectLink
                          href={primaryHref}
                          productSlug={productSlug}
                          aria-label={`${primaryLabel} for ${productName}`}
                          className={`${primaryButtonClassName} flex h-11 text-[12px]`}
                        >
                          <span className="truncate">{primaryLabel}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </AuthRedirectLink>
                        <SecondaryBannerAction
                          href={secondaryHref}
                          label={secondaryLabel}
                          className={`${secondaryButtonClassName} flex h-11 text-[12px]`}
                        />
                      </div>

                      <AuthRedirectLink
                        href={primaryHref}
                        productSlug={productSlug}
                        aria-label={`${primaryLabel} for ${productName}`}
                        className={`${primaryButtonClassName} swiper-no-swiping absolute left-[5.75%] top-[77%] z-20 hidden h-[10.5%] w-[13.2%] text-[clamp(0.65rem,1.25vw,1.25rem)] md:flex`}
                      >
                        <span className="truncate">{primaryLabel}</span>
                        <ArrowRight className="h-[1em] w-[1em] shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </AuthRedirectLink>
                      <SecondaryBannerAction
                        href={secondaryHref}
                        label={secondaryLabel}
                        className={`${secondaryButtonClassName} swiper-no-swiping absolute left-[20%] top-[77%] z-20 hidden h-[10.5%] w-[14.9%] text-[clamp(0.65rem,1.25vw,1.25rem)] md:flex`}
                      />
                    </>
                  );
                })()}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
