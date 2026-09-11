"use client";

import Link from "next/link";
import {
  BadgeIndianRupee,
  CheckCircle2,
  CreditCard,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import {
  buildCreditCardDetailPath,
  getBankProductApplyUrl,
  getCreditCardId,
  trackBankProductClick,
  type BankProduct,
  type BankProductType,
} from "@/services/bankProducts";

const formatCurrency = (value?: number | string) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "As per bank";
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export function BankProductOfferCard({
  product,
  productType,
  fallbackHref,
}: {
  product: BankProduct;
  productType: BankProductType;
  fallbackHref: string;
}) {
  const productId = getCreditCardId(product);
  const applyHref = getBankProductApplyUrl(product, fallbackHref);
  const isCreditCard = productType === "credit_card";
  const detailHref =
    isCreditCard && productId ? buildCreditCardDetailPath(product) : "";
  const description =
    product.shortDescription ||
    product.subtitle ||
    (isCreditCard
      ? "Review features, eligibility and bank terms before applying."
      : "Continue to the lender to review the latest instant-loan offer.");
  const highlights = [
    ...(product.featuresList || []),
    ...(product.eligibilityCriteria || []),
    ...(product.termsAndConditions || []),
  ]
    .filter(Boolean)
    .slice(0, 3);
  const details = isCreditCard
    ? [
        {
          label: "Joining fee",
          value: formatCurrency(product.joiningFee),
          icon: BadgeIndianRupee,
        },
        {
          label: "Annual fee",
          value: formatCurrency(product.annualFee),
          icon: CreditCard,
        },
        {
          label: "Network",
          value: product.cardNetwork || "Bank issued",
          icon: ShieldCheck,
        },
      ]
    : [
        {
          label: "Minimum income",
          value: formatCurrency(product.minimumIncome),
          icon: BadgeIndianRupee,
        },
        {
          label: "Preferred score",
          value: product.creditScoreRequirement
            ? `${product.creditScoreRequirement}+`
            : "As per bank",
          icon: ShieldCheck,
        },
        {
          label: "Processing",
          value: product.processingTime || "As per bank",
          icon: Landmark,
        },
      ];

  const trackClick = (action: "apply" | "detail") => {
    if (!productId) return;
    void trackBankProductClick(productId, action).catch(() => {
      // Tracking must never block navigation to the product or lender.
    });
  };

  return (
    <article
      data-bank-product-type={productType}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#dce8f3] bg-white p-4 shadow-[0_8px_28px_rgba(7,22,45,0.05)]"
    >
      <div className="flex items-start gap-3">
        {product.image ? (
          <BankLogoImage
            src={product.image}
            alt={product.bankName || product.name}
            className="h-12 w-24 rounded-lg border border-[#edf2f7] bg-white"
            sizes="96px"
            unoptimized={isExternalHref(product.image)}
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef6ff] text-[#4c1d95]">
            {isCreditCard ? (
              <CreditCard className="h-5 w-5" />
            ) : (
              <Landmark className="h-5 w-5" />
            )}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-[#4c1d95]">
            {product.bankName || "Partner bank"}
          </p>
          <h3 className="mt-1 line-clamp-2 text-[17px] font-extrabold leading-6 text-[#07162d]">
            {product.name || product.title}
          </h3>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-[12px] font-semibold leading-5 text-[#64748b]">
        {description}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        {details.map((detail) => {
          const Icon = detail.icon;
          return (
            <div
              key={detail.label}
              className="min-w-0 rounded-xl bg-[#f7fbff] px-2.5 py-3"
            >
              <Icon className="h-4 w-4 text-[#4c1d95]" />
              <dt className="mt-2 truncate text-[9px] font-extrabold uppercase tracking-wide text-[#8a94a6]">
                {detail.label}
              </dt>
              <dd className="mt-1 line-clamp-2 text-[11px] font-extrabold leading-4 text-[#07162d]">
                {detail.value}
              </dd>
            </div>
          );
        })}
      </dl>

      {highlights.length > 0 ? (
        <div className="mt-4 space-y-2">
          {highlights.map((highlight) => (
            <p
              key={highlight}
              className="flex gap-2 text-[11px] font-semibold leading-4 text-[#536273]"
            >
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#13a653]" />
              <span className="line-clamp-2">{highlight}</span>
            </p>
          ))}
        </div>
      ) : null}

      <div
        className={`mt-auto grid gap-2 pt-5 ${detailHref ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {detailHref ? (
          <Link
            href={detailHref}
            onClick={() => trackClick("detail")}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#bfd7ed] bg-white px-3 text-[12px] font-extrabold text-[#4c1d95] no-underline"
          >
            View Details
          </Link>
        ) : null}
        <a
          href={applyHref}
          target={isExternalHref(applyHref) ? "_blank" : undefined}
          rel={isExternalHref(applyHref) ? "noopener noreferrer" : undefined}
          onClick={() => trackClick("apply")}
          className="inline-flex h-10 items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-3 text-[12px] font-extrabold text-white no-underline"
        >
          {isExternalHref(applyHref) ? "Apply on bank site" : "View bank offer"}
        </a>
      </div>
    </article>
  );
}
