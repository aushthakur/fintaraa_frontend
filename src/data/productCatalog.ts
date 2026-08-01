import { requiredLoanProductContracts } from "@/components/application/loanProductContract";

export type ProductCatalogItem = {
  name: string;
  slug: string;
  group: string;
};

export const loanProductCatalog: ProductCatalogItem[] = [
  ...requiredLoanProductContracts.map(({ name, slug, group }) => ({
    name,
    slug,
    group,
  })),
  // Historical routes remain available without replacing the required catalog.
  { name: "Vehicle Loan", slug: "vehicle-loan", group: "vehicle" },
  {
    name: "Loan Against Car",
    slug: "loan-against-car",
    group: "vehicle",
  },
  {
    name: "Loan Against Car Value",
    slug: "loan-against-car-value",
    group: "vehicle",
  },
];

export const insuranceProductCatalog: ProductCatalogItem[] = [
  { name: "Life Insurance", slug: "life-insurance", group: "life-health" },
  {
    name: "Health Insurance",
    slug: "health-insurance",
    group: "life-health",
  },
  { name: "Term Insurance", slug: "term-insurance", group: "life-health" },
  {
    name: "Group Insurance",
    slug: "group-insurance",
    group: "life-health",
  },
  {
    name: "Personal Accident Insurance",
    slug: "personal-accident-insurance",
    group: "life-health",
  },
  {
    name: "Critical Illness Insurance",
    slug: "critical-illness-insurance",
    group: "life-health",
  },
  { name: "Retirement Plan", slug: "retirement-plan", group: "life-health" },
  { name: "Vehicle Insurance", slug: "vehicle-insurance", group: "motor" },
  { name: "Car Insurance", slug: "car-insurance", group: "motor" },
  { name: "Bike Insurance", slug: "bike-insurance", group: "motor" },
  { name: "Travel Insurance", slug: "travel-insurance", group: "motor" },
  { name: "Home Insurance", slug: "home-insurance", group: "property" },
  {
    name: "Property Insurance",
    slug: "property-insurance",
    group: "property",
  },
  { name: "Shop Insurance", slug: "shop-insurance", group: "property" },
  { name: "Stock Insurance", slug: "stock-insurance", group: "property" },
  {
    name: "Machinery Insurance",
    slug: "machinery-insurance",
    group: "property",
  },
];
