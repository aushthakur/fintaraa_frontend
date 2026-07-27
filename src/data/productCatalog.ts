export type ProductCatalogItem = {
  name: string;
  slug: string;
  group: string;
};

export const loanProductCatalog: ProductCatalogItem[] = [
  { name: "Personal Loan", slug: "personal-loan", group: "personal" },
  { name: "Instant Loan", slug: "instant-loan", group: "personal" },
  { name: "Education Loan", slug: "education-loan", group: "personal" },
  { name: "Renovation Loan", slug: "renovation-loan", group: "personal" },
  { name: "Home Loan", slug: "home-loan", group: "secured" },
  {
    name: "Loan Against Property",
    slug: "loan-against-property",
    group: "secured",
  },
  { name: "Gold Loan", slug: "gold-loan", group: "secured" },
  {
    name: "Loan Against Security",
    slug: "loan-against-security",
    group: "secured",
  },
  {
    name: "Balance Transfer Loan",
    slug: "balance-transfer-loan",
    group: "secured",
  },
  { name: "Top Up Loan", slug: "top-up-loan", group: "secured" },
  { name: "Business Loan", slug: "business-loan", group: "business" },
  {
    name: "Working Capital Loan",
    slug: "working-capital-loan",
    group: "business",
  },
  { name: "DOD Loan", slug: "dod-loan", group: "business" },
  { name: "OD Loan", slug: "od-loan", group: "business" },
  { name: "Machinery Loan", slug: "machinery-loan", group: "business" },
  { name: "Industrial Loan", slug: "industrial-loan", group: "business" },
  {
    name: "Commercial Purchases Loan",
    slug: "commercial-purchases-loan",
    group: "business",
  },
  {
    name: "Agriculture Loan",
    slug: "agriculture-loan",
    group: "business",
  },
  { name: "Vehicle Loan", slug: "vehicle-loan", group: "vehicle" },
  { name: "Car Loan", slug: "car-loan", group: "vehicle" },
  { name: "Used Car Loan", slug: "used-car-loan", group: "vehicle" },
  {
    name: "Two Wheeler Loan",
    slug: "two-wheeler-loan",
    group: "vehicle",
  },
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
