"use client";

import { getApplyHref } from "@/components/application/flowRegistry";
import { ProductHeroBannerSlider } from "@/components/products/ProductHeroBannerSlider";
import type { InsuranceSeoPageData } from "@/services/insuranceSeoPages";

export function InsuranceHero({ page }: { page: InsuranceSeoPageData }) {
  const applyHref = getApplyHref({
    category: "insurance",
    productSlug: page.insuranceTypeSlug,
    referrer: page.canonicalPath || `/products/${page.insuranceTypeSlug}`,
  });

  return (
    <section className="relative w-full overflow-hidden bg-[#fbfdff]">
      <ProductHeroBannerSlider
        key={page.insuranceTypeSlug}
        category="insurance"
        productName={page.insuranceType}
        productSlug={page.insuranceTypeSlug}
        applyHref={applyHref}
      />
    </section>
  );
}
