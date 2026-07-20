"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import type { HomeBanner } from "@/services/homeBanners";
import {
  fetchProductPopupBanner,
  type ProductPopupDevice,
} from "@/services/productPopupBanners";
import type { ProductHeroCategory } from "@/services/productHeroBanners";

const getDevice = (): ProductPopupDevice =>
  window.matchMedia("(max-width: 767px)").matches ? "mobile" : "web";

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
  const [banner, setBanner] = useState<HomeBanner | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let active = true;
    const device = getDevice();

    const timer = window.setTimeout(() => {
      if (active) setIsVisible(true);
    }, 5000);

    queueMicrotask(async () => {
      const result = await fetchProductPopupBanner({
        category,
        device,
        productName,
        productSlug,
      });

      if (!active || !result) return;
      setBanner(result);
    });

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [category, productName, productSlug]);

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
    height: category === "loan" ? 1200 : 1050,
    unoptimized: true,
  });

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      hidePadding
      width="w-[calc(100vw-2rem)] md:w-4/5 xl:w-2/3"
    >
      <AuthRedirectLink
        href={applyHref}
        productSlug={productSlug}
        aria-label={`Apply for ${productName}`}
        className={`relative block w-full overflow-hidden bg-[#07162d] no-underline md:aspect-[5/2] ${
          category === "loan" ? "aspect-[3/4]" : "aspect-[6/7]"
        }`}
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
      </AuthRedirectLink>
    </Modal>
  );
}
