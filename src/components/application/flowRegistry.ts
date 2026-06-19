import { formFlows, type FormFlow } from "./flows";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { isUserLoggedIn } from "@/hooks/authStorage";

export type ApplicationCategory = "loan" | "insurance";

const loanSlugToFlowKey: Record<string, string> = {
  "personal-loan": "personalLoan",
  "home-loan": "homeLoan",
  "business-loan": "businessLoan",
  "vehicle-loan": "vehicleLoan",
  "car-loan": "vehicleLoan",
  "two-wheeler-loan": "twoWheelerLoan",
  "used-car-loan": "usedCarLoan",
  "gold-loan": "goldLoan",
  "education-loan": "educationLoan",
  "instant-loan": "instantLoan",
  "loan-against-property": "loanAgainstProperty",
  "renovation-loan": "renovationLoan",
  "working-capital-loan": "workingCapitalLoan",
  "loan-against-security": "loanAgainstSecurity",
  "loan-against-car": "loanAgainstCarValue",
  "loan-against-car-value": "loanAgainstCarValue",
  "machinery-loan": "machineryLoan",
  "balance-transfer-loan": "balanceTransferLoan",
  "top-up-loan": "topUpLoan",
  "agriculture-loan": "agricultureLoan",
  "dod-loan": "businessLoan",
  "od-loan": "workingCapitalLoan",
  "industrial-loan": "machineryLoan",
  "commercial-purchases-loan": "businessLoan",
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
  const applyHref = `/apply/${category}/${slugifyProduct(productSlug)}${query ? `?${query}` : ""}`;

  if (isUserLoggedIn()) {
    return applyHref;
  }

  if (referrer) {
    const loginParams = new URLSearchParams();
    loginParams.set("referrer", referrer);
    loginParams.set("product", slugifyProduct(productSlug));
    return `/login?${loginParams.toString()}`;
  }

  return buildLoginRedirectHref({
    redirectTo: applyHref,
    product: slugifyProduct(productSlug),
  });
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
