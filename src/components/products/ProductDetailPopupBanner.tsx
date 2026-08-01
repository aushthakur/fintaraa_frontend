"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import type { HomeBanner } from "@/services/homeBanners";
import {
  fetchProductHeroBanners,
  type ProductHeroCategory,
} from "@/services/productHeroBanners";

export function ProductDetailPopupBanner({
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
  const popupKey = `${category}:${productSlug}`;
  const [loadedBanner, setLoadedBanner] = useState<{
    key: string;
    banner: HomeBanner;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const banner = loadedBanner?.key === popupKey ? loadedBanner.banner : null;

  useEffect(() => {
    let active = true;
    const bannerRequest = fetchProductHeroBanners({
      category,
      productSlug,
    });

    const timer = window.setTimeout(async () => {
      const result = (await bannerRequest)[0];
      if (!active || !result) return;
      setLoadedBanner({ key: popupKey, banner: result });
      setIsVisible(true);
    }, 5000);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [category, popupKey, productSlug]);

  if (!banner) return null;

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
    <Modal
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      hidePadding
      width="w-[calc(100vw-1.5rem)] sm:w-[430px] md:w-[82vw] lg:w-[72vw] 2xl:w-[1100px]"
    >
      <AuthRedirectLink
        href={applyHref}
        productSlug={productSlug}
        aria-label={`Apply for ${productName}`}
        className="relative block aspect-[2/3] w-full overflow-hidden bg-[#07162d] no-underline md:aspect-[12/5]"
        data-analytics-category="popup"
        data-analytics-name={banner.title || `${productName} popup`}
        data-analytics-placement={`product_popup:${productSlug}`}
      >
        <picture className="absolute inset-0 block h-full w-full">
          <source
            media="(max-width: 767px)"
            srcSet={mobileImage.srcSet || mobileImage.src}
          />
          <img
            {...desktopImage}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {banner.contentOverlay ? (
          <>
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.83)_35%,rgba(255,255,255,0)_62%)] md:bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_34%,rgba(255,255,255,0)_62%)]" />
            <div className="pointer-events-none absolute inset-0 z-20 px-4 sm:px-7 md:px-7 lg:px-8">
              <div className="flex h-full items-start pt-[5%] md:items-center md:pt-0">
                <div className="w-full max-w-full sm:max-w-[78%] md:max-w-[50%] lg:max-w-[43%]">
                  <p className="max-w-3xl text-[clamp(1rem,4.8vw,1.6rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-[#07162d] md:text-balance md:text-[clamp(1.15rem,2.3vw,1.5rem)] md:leading-[1.06] lg:text-[clamp(1.75rem,2.4vw,2.5rem)] lg:leading-[1.04]">
                    {banner.title || productName}
                  </p>
                  {banner.description ? (
                    <p className="mt-2 max-w-2xl text-[9px] font-semibold leading-[14px] tracking-normal text-[#48637b] min-[360px]:text-[10px] min-[360px]:leading-4 sm:text-[12px] md:mt-2.5 md:text-[11px] md:leading-4 lg:mt-3 lg:text-[clamp(0.78rem,1vw,0.95rem)] lg:leading-6">
                      {banner.description}
                    </p>
                  ) : null}
                  <span className="mt-3 inline-flex h-8 items-center justify-center rounded-xl bg-linear-to-br from-[#2cc5ff] to-[#1686f0] px-4 text-[9px] font-extrabold text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)] min-[360px]:h-9 min-[360px]:text-[10px] md:h-9 md:px-4 md:text-[10px] lg:mt-4 lg:h-11 lg:px-5 lg:text-[12px]">
                    {banner.buttonText || "Apply Now"}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </AuthRedirectLink>
    </Modal>
  );
}
