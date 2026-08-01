export type LoanProductContract = {
  name: string;
  slug: string;
  group: "personal" | "secured" | "business" | "vehicle";
  flowKey: string;
  loanType: string;
  aliases?: string[];
};

export const requiredLoanProductContracts: LoanProductContract[] = [
  {
    name: "Personal Loan",
    slug: "personal-loan",
    group: "personal",
    flowKey: "personalLoan",
    loanType: "personal_loan",
  },
  {
    name: "Top-up Loan",
    slug: "top-up-loan",
    group: "secured",
    flowKey: "topUpLoan",
    loanType: "top_up_loan",
  },
  {
    name: "Balance Transfer Loan + Top up Loan",
    slug: "balance-transfer-top-up-loan",
    group: "secured",
    flowKey: "balanceTransferTopUpLoan",
    loanType: "Balance Transfer+ Top Up Loan",
    aliases: ["balance-transfer-loan", "balance-transfer-and-top-up-loan"],
  },
  {
    name: "Business Loan",
    slug: "business-loan",
    group: "business",
    flowKey: "businessLoan",
    loanType: "business_loan",
  },
  {
    name: "Agriculture Loan",
    slug: "agriculture-loan",
    group: "business",
    flowKey: "agricultureLoan",
    loanType: "Agriculture Loan",
  },
  {
    name: "Solar Loan",
    slug: "solar-loan",
    group: "secured",
    flowKey: "solarLoan",
    loanType: "Solar Loan",
  },
  {
    name: "Car Loan",
    slug: "car-loan",
    group: "vehicle",
    flowKey: "carLoan",
    loanType: "Vechile Loan",
  },
  {
    name: "Two Wheeler Loan",
    slug: "two-wheeler-loan",
    group: "vehicle",
    flowKey: "twoWheelerLoan",
    loanType: "Two Wheeler Loan",
  },
  {
    name: "Used Car Loan",
    slug: "used-car-loan",
    group: "vehicle",
    flowKey: "usedCarLoan",
    loanType: "vehicle_loan",
  },
  {
    name: "Home Loan",
    slug: "home-loan",
    group: "secured",
    flowKey: "homeLoan",
    loanType: "home_loan",
  },
  {
    name: "Construction Loan",
    slug: "construction-loan",
    group: "secured",
    flowKey: "constructionLoan",
    loanType: "home_loan",
  },
  {
    name: "Instant Loan",
    slug: "instant-loan",
    group: "personal",
    flowKey: "instantLoan",
    loanType: "instant_loan",
  },
  {
    name: "Education Loan",
    slug: "education-loan",
    group: "personal",
    flowKey: "educationLoan",
    loanType: "education_loan",
  },
  {
    name: "Gold Loan",
    slug: "gold-loan",
    group: "secured",
    flowKey: "goldLoan",
    loanType: "gold_loan",
  },
  {
    name: "Loan Against Property",
    slug: "loan-against-property",
    group: "secured",
    flowKey: "loanAgainstProperty",
    loanType: "loan_against_property",
  },
  {
    name: "Renovation Loan",
    slug: "renovation-loan",
    group: "personal",
    flowKey: "renovationLoan",
    loanType: "renovation_loan",
  },
  {
    name: "Working Capital Loan",
    slug: "working-capital-loan",
    group: "business",
    flowKey: "workingCapitalLoan",
    loanType: "working_capital_loan",
  },
  {
    name: "Loan Against Security",
    slug: "loan-against-security",
    group: "secured",
    flowKey: "loanAgainstSecurity",
    loanType: "loan_against_security",
  },
  {
    name: "Machinery Loan",
    slug: "machinery-loan",
    group: "business",
    flowKey: "machineryLoan",
    loanType: "machinery_loan",
  },
  {
    name: "DOD Loan",
    slug: "dod-loan",
    group: "business",
    flowKey: "dodLoan",
    loanType: "dod_loan",
  },
  {
    name: "OD Loan",
    slug: "od-loan",
    group: "business",
    flowKey: "odLoan",
    loanType: "od_loan",
  },
  {
    name: "Industrial Loan",
    slug: "industrial-loan",
    group: "business",
    flowKey: "industrialLoan",
    loanType: "industrial_loan",
  },
  {
    name: "Commercial Purchases Loan",
    slug: "commercial-purchases-loan",
    group: "business",
    flowKey: "commercialPurchasesLoan",
    loanType: "commercial_purchases_loan",
  },
  {
    name: "Credit Card",
    slug: "credit-card",
    group: "personal",
    flowKey: "creditCard",
    loanType: "credit_card",
  },
];

const assertUnique = (values: string[], label: string) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) {
    throw new Error(`Duplicate loan product ${label}: ${Array.from(new Set(duplicates)).join(", ")}`);
  }
};

assertUnique(requiredLoanProductContracts.map((item) => item.slug), "slug");
assertUnique(requiredLoanProductContracts.map((item) => item.flowKey), "flow key");

export const requiredLoanSlugToFlowKey = Object.fromEntries(
  requiredLoanProductContracts.flatMap((item) => [
    [item.slug, item.flowKey],
    ...(item.aliases || []).map((alias) => [alias, item.flowKey]),
  ]),
) as Record<string, string>;

export const requiredLoanTypeByFlowKey = Object.fromEntries(
  requiredLoanProductContracts.map((item) => [item.flowKey, item.loanType]),
) as Record<string, string>;

export const requiredLoanProductByFlowKey = new Map(
  requiredLoanProductContracts.map((item) => [item.flowKey, item]),
);

const historicalLoanTypeByFlowKey: Record<string, string> = {
  vehicleLoan: "Vechile Loan",
  loanAgainstCarValue: "loan_against_car",
  balanceTransferLoan: "Balance Transfer+ Top Up Loan",
};

export const resolveLoanTypeForFlow = (flowKey: string) => {
  const loanType =
    requiredLoanTypeByFlowKey[flowKey] || historicalLoanTypeByFlowKey[flowKey];
  if (!loanType) {
    throw new Error(`Unsupported loan application flow: ${flowKey}`);
  }
  return loanType;
};

export const getRequiredLoanProductMetadata = (flowKey: string) => {
  const product = requiredLoanProductByFlowKey.get(flowKey);
  if (!product) return undefined;
  return {
    requestedProductName: product.name,
    requestedProductSlug: product.slug,
    productVariant: product.slug,
    metaFlowKey: product.flowKey,
  };
};

const requiredLoanProductBySlug = new Map(
  requiredLoanProductContracts.flatMap((item) => [
    [item.slug, item] as const,
    ...(item.aliases || []).map((alias) => [alias, item] as const),
  ]),
);

const requiredLoanProductByName = new Map(
  requiredLoanProductContracts.map((item) => [item.name.toLowerCase(), item]),
);

export const resolveLoanProductDisplayName = ({
  loanType,
  policyDetails,
}: {
  loanType?: string;
  policyDetails?: Record<string, unknown>;
}) => {
  const details = policyDetails || {};
  const metadataCandidates = [
    details.metaFlowKey,
    details.productVariant,
    details.requestedProductSlug,
  ];

  for (const candidate of metadataCandidates) {
    const token = String(candidate || "").trim();
    const product =
      requiredLoanProductByFlowKey.get(token) ||
      requiredLoanProductBySlug.get(token);
    if (product) return product.name;
  }

  const requestedName = String(details.requestedProductName || "")
    .trim()
    .toLowerCase();
  const requestedProduct = requiredLoanProductByName.get(requestedName);
  if (requestedProduct) return requestedProduct.name;

  const canonicalType = String(loanType || "").trim();
  const canonicalProduct = requiredLoanProductContracts.find(
    (item) => item.loanType === canonicalType,
  );
  if (canonicalProduct) return canonicalProduct.name;

  if (canonicalType === "loan_against_car") return "Loan Against Car";
  if (canonicalType === "Vehicle Loan") return "Car Loan";
  return undefined;
};
