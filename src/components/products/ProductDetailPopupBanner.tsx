"use client";

import Image from "next/image";
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

    queueMicrotask(async () => {
      const result = await fetchProductPopupBanner({
        category,
        device,
        productSlug,
      });

      if (!active || !result) return;
      setBanner(result);
      setIsVisible(true);
    });

    return () => {
      active = false;
    };
  }, [category, productSlug]);

  if (!banner) return null;

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      hidePadding
      width="w-[calc(100vw-2rem)] md:w-2/3"
    >
      <AuthRedirectLink
        href={applyHref}
        productSlug={productSlug}
        aria-label={`Apply for ${productName}`}
        className="relative block h-80 w-full overflow-hidden bg-[#07162d] no-underline"
      >
        <Image
          src={banner.image}
          alt={banner.imageAlt || banner.title}
          fill
          unoptimized
          sizes="(min-width: 768px) 66vw, calc(100vw - 2rem)"
          className="object-cover object-center"
        />
      </AuthRedirectLink>
    </Modal>
  );
}
