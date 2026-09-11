"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Building2, Layers3 } from "lucide-react";
import { trustedPartners } from "@/data/trustedPartners";
import {
  fetchCreditCards,
  type CreditCardProduct,
} from "@/services/bankProducts";
import {
  fetchPublicPartnerProducts,
  fetchPublicPartners,
  getPublicPartnerHref,
  slugifyPartnerValue,
  type PublicPartner,
  type PublicPartnerProduct,
  type PublicPartnerProductCategory,
} from "@/services/partners";

type ProductTabKey = PublicPartnerProductCategory | "featured";

const productTabs: Array<{ key: ProductTabKey; label: string }> = [
  { key: "loan", label: "Loans" },
  { key: "credit_card", label: "Credit Cards" },
  { key: "insurance", label: "Insurance" },
  { key: "featured", label: "Featured" },
];

type PartnerRecord = {
  partner: PublicPartner;
  products: PublicPartnerProduct[];
  productsLoaded: boolean;
};

const bankLogo = (bankName: string) => {
  const slug = slugifyPartnerValue(bankName);
  if (slug.includes("hdfc")) return "/assets/banks/hdfc.png";
  if (slug.includes("icici")) return "/assets/banks/icici.png";
  if (slug.includes("kotak")) return "/assets/banks/kotak.png";
  if (slug.includes("sbi") || slug.includes("state-bank")) {
    return "/assets/banks/sbi.png";
  }
  if (slug.includes("pnb") || slug.includes("punjab")) {
    return "/assets/banks/pnb.png";
  }
  if (slug.includes("indus")) return "/assets/banks/indusind.png";
  return "/assets/banks/indian.png";
};

const createEmptyRecord = (partner: PublicPartner): PartnerRecord => ({
  partner,
  products: [],
  productsLoaded: false,
});

const preferredProductTab = (partners: PublicPartner[]): ProductTabKey => {
  for (const category of [
    "loan",
    "credit_card",
    "insurance",
  ] as PublicPartnerProductCategory[]) {
    if (
      partners.some((partner) => partner.productCategories.includes(category))
    ) {
      return category;
    }
  }
  return partners.some((partner) => partner.featured) ? "featured" : "loan";
};

const staticFallbackRecords: PartnerRecord[] = trustedPartners.map(
  (partner) => ({
    partner: {
      id: `fallback-${partner.slug}`,
      name: partner.name,
      slug: partner.slug,
      logo: partner.logo,
      type:
        partner.type === "NBFC"
          ? "nbfc"
          : partner.type === "Insurer"
            ? "insurer"
            : "bank",
      productCategories: partner.categories
        .map((category) =>
          category === "credit-card"
            ? "credit_card"
            : category === "loan" || category === "insurance"
              ? category
              : null,
        )
        .filter(
          (category): category is PublicPartnerProductCategory =>
            Boolean(category),
        ),
      productCount: 0,
      featured: false,
      website: "",
      status: "active",
    },
    products: [],
    productsLoaded: false,
  }),
);

const productFromCreditCard = (
  card: CreditCardProduct,
  partner: PublicPartner,
): PublicPartnerProduct => ({
  id: card._id || card.id || `${partner.slug}-${slugifyPartnerValue(card.name)}`,
  partnerId: partner.id,
  partnerSlug: partner.slug,
  name: card.name,
  code: "",
  category: "credit_card",
  productType: card.cardType || "credit-card",
  processingFee: card.annualFee,
  minAmount: undefined,
  maxAmount: undefined,
  minTenureMonths: undefined,
  maxTenureMonths: undefined,
  eligibility: card.eligibilityCriteria || null,
  publication: null,
  featured: Boolean(card.featured),
  status: "active",
});

const buildCreditCardFallback = (cards: CreditCardProduct[]) => {
  const grouped = new Map<string, CreditCardProduct[]>();
  cards.forEach((card) => {
    const bankName = card.bankName?.trim();
    if (!bankName) return;
    const list = grouped.get(bankName) || [];
    list.push(card);
    grouped.set(bankName, list);
  });

  return Array.from(grouped.entries()).map(([name, bankCards]) => {
    const slug = slugifyPartnerValue(name);
    const partner: PublicPartner = {
      id: `card-fallback-${slug}`,
      name,
      slug,
      logo: bankCards.find((card) => card.image)?.image || bankLogo(name),
      type: "bank",
      productCategories: ["credit_card"],
      productCount: bankCards.length,
      featured: bankCards.some((card) => card.featured),
      website: "",
      status: "active",
    };
    return {
      partner,
      products: bankCards.map((card) => productFromCreditCard(card, partner)),
      productsLoaded: true,
    } satisfies PartnerRecord;
  });
};

const loadProducts = async (
  partners: PublicPartner[],
): Promise<PartnerRecord[]> => {
  const results = await Promise.allSettled(
    partners.map((partner) => fetchPublicPartnerProducts(partner)),
  );
  return partners.map((partner, index) => {
    const result = results[index];
    return result.status === "fulfilled"
      ? { partner, products: result.value, productsLoaded: true }
      : createEmptyRecord(partner);
  });
};

const categoryProductCount = (
  record: PartnerRecord,
  category?: PublicPartnerProductCategory,
) => {
  if (!category) {
    return record.productsLoaded
      ? record.products.length
      : record.partner.productCount;
  }
  const count = record.products.filter(
    (product) => product.category === category,
  ).length;
  if (count || record.productsLoaded) return count;
  return record.partner.productCount;
};

const partnerSupportsCategory = (
  record: PartnerRecord,
  category: PublicPartnerProductCategory,
) =>
  record.partner.productCategories.includes(category) ||
  record.products.some((product) => product.category === category);

function LogoTile({
  record,
  activeTab,
}: {
  record: PartnerRecord;
  activeTab: ProductTabKey;
}) {
  const category = activeTab === "featured" ? undefined : activeTab;
  const count = categoryProductCount(record, category);
  const productNames = record.products
    .filter((product) => !category || product.category === category)
    .slice(0, 2)
    .map((product) => product.name);
  const href = getPublicPartnerHref(record.partner, category, record.products);
  const typeLabel =
    record.partner.type === "nbfc"
      ? "NBFC"
      : record.partner.type === "insurer"
        ? "Insurer"
        : "Bank";

  return (
    <Link
      href={href}
      aria-label={`Explore ${record.partner.name} products`}
      className="group flex min-h-45 flex-col rounded-2xl border border-[#dde8f1] bg-white p-5 no-underline transition hover:-translate-y-0.5 hover:border-[#9ec9e8]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-14 min-w-28 items-center">
          {record.partner.logo ? (
            <Image
              src={record.partner.logo}
              alt={`${record.partner.name} logo`}
              width={128}
              height={52}
              unoptimized
              className="max-h-12 w-auto max-w-32 object-contain mix-blend-multiply"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4ff] text-[13px] font-extrabold text-[#5b21b6]">
              {record.partner.name
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
        <span className="rounded-full bg-[#f1f6fa] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#65798d]">
          {typeLabel}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="line-clamp-1 text-[15px] font-extrabold text-[#3b0764] transition group-hover:text-[#5b21b6]">
          {record.partner.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-[11px] font-medium leading-5 text-[#718598]">
          {productNames.length
            ? productNames.join(" · ")
            : category === "loan"
              ? "Loan products"
              : category === "insurance"
                ? "Insurance products"
                : category === "credit_card"
                  ? "Credit card products"
                  : "Financial products"}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#f5f3ff] pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#61748f]">
          <Layers3 className="h-3.5 w-3.5" />
          {count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : "Explore"}
        </span>
        <ArrowRight className="h-4 w-4 text-[#5b21b6] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function PartnerProductShowcase({
  initialPartners,
}: {
  initialPartners?: PublicPartner[];
}) {
  const [activeTab, setActiveTab] = useState<ProductTabKey>(() =>
    preferredProductTab(initialPartners || []),
  );
  const [records, setRecords] = useState<PartnerRecord[]>(
    (initialPartners || []).map(createEmptyRecord),
  );
  const [loading, setLoading] = useState(initialPartners === undefined);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const partners = initialPartners ?? (await fetchPublicPartners());
        if (active) {
          setRecords(partners.map(createEmptyRecord));
          setActiveTab(preferredProductTab(partners));
          setLoading(false);
        }
        const hydratedRecords = await loadProducts(partners);
        if (active) setRecords(hydratedRecords);
      } catch {
        try {
          const cards = await fetchCreditCards();
          if (active) {
            const cardRecords = buildCreditCardFallback(cards);
            if (cardRecords.length) {
              setRecords(cardRecords);
              setActiveTab("credit_card");
            } else {
              setRecords(staticFallbackRecords);
              setActiveTab(preferredProductTab(
                staticFallbackRecords.map((record) => record.partner),
              ));
            }
          }
        } catch {
          if (active) {
            setRecords(staticFallbackRecords);
            setActiveTab(
              preferredProductTab(
                staticFallbackRecords.map((record) => record.partner),
              ),
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [initialPartners]);

  const tabCounts = useMemo(
    () =>
      productTabs.reduce<Record<ProductTabKey, number>>(
        (counts, tab) => {
          counts[tab.key] = records.filter((record) =>
            tab.key === "featured"
              ? record.partner.featured
              : partnerSupportsCategory(record, tab.key),
          ).length;
          return counts;
        },
        { loan: 0, credit_card: 0, insurance: 0, featured: 0 },
      ),
    [records],
  );

  const visibleRecords = useMemo(
    () =>
      records
        .filter((record) =>
          activeTab === "featured"
            ? record.partner.featured
            : partnerSupportsCategory(record, activeTab),
        )
        .sort((a, b) => {
          const featuredDifference =
            Number(b.partner.featured) - Number(a.partner.featured);
          if (featuredDifference) return featuredDifference;
          const countDifference =
            categoryProductCount(
              b,
              activeTab === "featured" ? undefined : activeTab,
            ) -
            categoryProductCount(
              a,
              activeTab === "featured" ? undefined : activeTab,
            );
          return countDifference || a.partner.name.localeCompare(b.partner.name);
        }),
    [activeTab, records],
  );

  return (
    <section className="bg-[#f8fbfe] px-4 py-12 md:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5b21b6]">
              Product network
            </p>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.03em] text-[#111827] sm:text-[34px]">
              Partners by product
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] font-medium leading-6 text-[#61748f]">
              Browse published partner institutions and their available product
              categories from one connected catalogue.
            </p>
          </div>

          <Link
            href="/partners"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#bdd7eb] bg-white px-4 text-[12px] font-bold text-[#5b21b6] no-underline transition hover:border-[#5b21b6]"
          >
            Full directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="mt-7 flex max-w-full items-center gap-2 overflow-x-auto pb-2"
          aria-label="Filter partners by product"
        >
          {productTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-[12px] font-bold transition-colors ${
                  isActive
                    ? "border-[#5b21b6] bg-[#5b21b6] text-white"
                    : "border-[#d5e3ee] bg-white text-[#52657d] hover:border-[#8fbadc] hover:text-[#5b21b6]"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#eef3f7] text-[#65798d]"
                  }`}
                >
                  {tabCounts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-45 animate-pulse rounded-2xl border border-[#e3ebf2] bg-white"
                />
              ))}
            </div>
          ) : visibleRecords.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleRecords.map((record) => (
                <LogoTile
                  key={record.partner.id || record.partner.slug}
                  record={record}
                  activeTab={activeTab}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#cbddeb] bg-white px-6 py-12 text-center">
              <Building2 className="mx-auto h-7 w-7 text-[#7c9bb3]" />
              <p className="mt-3 text-[14px] font-bold text-[#334e68]">
                No published partners in this category yet.
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#718598]">
                Select another product category to continue browsing.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
