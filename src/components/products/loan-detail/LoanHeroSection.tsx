import { getApplyHref } from "@/components/application/flowRegistry";
import { ProductHeroBannerSlider } from "@/components/products/ProductHeroBannerSlider";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

export function LoanHeroSection({ page }: { page: LoanSeoPageData }) {
  const applyHref = getApplyHref({
    category: "loan",
    productSlug: page.loanTypeSlug,
    referrer: page.canonicalPath || `/products/${page.loanTypeSlug}`,
  });

  return (
    <section className="relative w-full overflow-hidden bg-[#fbfdff]">
      <ProductHeroBannerSlider
        key={page.loanTypeSlug}
        category="loan"
        productName={page.loanType}
        productSlug={page.loanTypeSlug}
        applyHref={applyHref}
      />
    </section>
  );
}
