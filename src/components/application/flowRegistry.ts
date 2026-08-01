import { formFlows, type FormFlow } from "./flows";
import {
  requiredLoanProductContracts,
  requiredLoanSlugToFlowKey,
} from "./loanProductContract";

export type ApplicationCategory = "loan" | "insurance";

const loanSlugToFlowKey: Record<string, string> = {
  ...requiredLoanSlugToFlowKey,
  // Historical website routes remain resolvable with explicit, non-default flows.
  "vehicle-loan": "vehicleLoan",
  "loan-against-car": "loanAgainstCarValue",
  "loan-against-car-value": "loanAgainstCarValue",
};

const insuranceSlugToFlowKey: Record<string, string> = {
  "health-insurance": "healthInsurance",
  "life-insurance": "lifeInsurance",
  "term-insurance": "termInsurance",
  "loan-suraksha-insurance": "loanSurakshaInsurance",
  "group-insurance": "groupInsurance",
  "car-insurance": "vehicleInsurance",
  "bike-insurance": "vehicleInsurance",
  "vehicle-insurance": "vehicleInsurance",
  "home-insurance": "propertyInsurance",
  "property-insurance": "propertyInsurance",
  "shop-insurance": "shopInsurance",
  "stock-insurance": "stockInsurance",
  "machinery-insurance": "machineInsurance",
  "machine-insurance": "machineInsurance",
  "machinery-stock-insurance": "machineryStockInsurance",
  "personal-accident-insurance": "personalAccidentInsurance",
  "critical-illness-insurance": "criticalIllnessInsurance",
  "travel-insurance": "travelInsurance",
  "retirement-plan": "retirementPlanInsurance",
  "retirement-plan-insurance": "retirementPlanInsurance",
  "cyber-insurance": "cyberInsurance",
  "pet-insurance": "petInsurance",
};

const assertRequiredLoanApplicationContracts = () => {
  if (requiredLoanProductContracts.length !== 24) {
    throw new Error(
      `Expected 24 required loan products, received ${requiredLoanProductContracts.length}`,
    );
  }

  requiredLoanProductContracts.forEach(({ name, slug, aliases, flowKey }) => {
    const routeSlugs = [slug, ...(aliases || [])];
    routeSlugs.forEach((routeSlug) => {
      if (loanSlugToFlowKey[routeSlug] !== flowKey) {
        throw new Error(
          `Loan route contract mismatch for ${name}: ${routeSlug} must resolve to ${flowKey}`,
        );
      }
    });
    if (!formFlows[flowKey]) {
      throw new Error(`Missing registered application form for ${name}: ${flowKey}`);
    }
  });
};

assertRequiredLoanApplicationContracts();

export const slugifyProduct = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const humanizeProduct = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getApplyHref = ({
  category,
  productSlug,
  referrer,
  bankSlug,
}: {
  category: ApplicationCategory;
  productSlug: string;
  referrer?: string;
  bankSlug?: string;
}) => {
  const params = new URLSearchParams();
  if (referrer) params.set("referrer", referrer);
  if (bankSlug) params.set("bank", bankSlug);
  const query = params.toString();
  return `/apply/${category}/${slugifyProduct(productSlug)}${query ? `?${query}` : ""}`;
};

export const getApplicationFlow = (
  category: ApplicationCategory,
  productSlug: string,
): { flowKey: string; flow: FormFlow } | null => {
  const slug = slugifyProduct(productSlug);
  const flowKey =
    category === "insurance"
      ? insuranceSlugToFlowKey[slug]
      : loanSlugToFlowKey[slug];
  const flow = flowKey ? formFlows[flowKey] : undefined;
  return flow ? { flowKey, flow } : null;
};
