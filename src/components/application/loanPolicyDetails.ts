type PolicyValues = Record<string, any>;

export type LoanPolicyMetadata = {
  requestedProductName?: string;
  requestedProductSlug?: string;
  productVariant?: string;
  metaFlowKey: string;
};

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  const cleaned = String(value).replace(/,/g, "").trim();
  if (!cleaned) return undefined;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : undefined;
};

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

const serialize = (value: unknown): unknown => {
  if (isFile(value)) return undefined;
  if (Array.isArray(value)) {
    return value
      .map((item) => serialize(item))
      .filter((item) => item !== undefined);
  }
  if (value && typeof value === "object") {
    return cleanPolicyDetails(value as PolicyValues);
  }
  return value;
};

const cleanPolicyDetails = (input: PolicyValues) =>
  Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => {
        if (key.startsWith("__") || isFile(value)) return false;
        if (value === undefined || value === null) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
      .map(([key, value]) => [key, serialize(value)]),
  );

const setIfPresent = (
  target: PolicyValues,
  key: string,
  value: unknown,
) => {
  if (value === undefined || value === null || isFile(value)) return;
  if (typeof value === "string" && value.trim() === "") return;
  if (Array.isArray(value) && value.length === 0) return;
  target[key] = value;
};

const pickDocumentUrl = (value: unknown): string | undefined => {
  if (!value || isFile(value)) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return pickDocumentUrl(value[0]);
  if (typeof value !== "object") return undefined;
  const candidate = value as { uri?: unknown; url?: unknown };
  const raw = candidate.uri || candidate.url;
  return typeof raw === "string" && raw.trim() ? raw.trim() : undefined;
};

const addHomeDetails = (details: PolicyValues, values: PolicyValues) => {
  setIfPresent(details, "propertyType", values.propertyType);
  setIfPresent(
    details,
    "propertyLocation",
    values.propertyLocation || values.city,
  );
  setIfPresent(
    details,
    "propertyValue",
    toNumber(values.estimate) || toNumber(values.propertyValue),
  );
  setIfPresent(details, "ownershipType", values.ownershipType);
  setIfPresent(
    details,
    "builderSellerName",
    values.builderName || values.builderSellerName,
  );
  setIfPresent(
    details,
    "propertyDocumentsUrl",
    pickDocumentUrl(values.ownershipDocs || values.propertyDocumentsUrl),
  );
  setIfPresent(details, "tenure", values.tenure || values.loanTenure);
  setIfPresent(details, "preferredBank", values.preferredBank);
  setIfPresent(details, "coApplicants", values.coApplicants);
};

const addBusinessDetails = (details: PolicyValues, values: PolicyValues) => {
  setIfPresent(details, "businessName", values.businessName);
  setIfPresent(
    details,
    "businessType",
    values.constitution || values.industry || values.businessType,
  );
  setIfPresent(
    details,
    "natureOfBusiness",
    values.natureOfBusiness || values.usage,
  );
  setIfPresent(
    details,
    "businessVintage",
    toNumber(values.vintage) || toNumber(values.businessVintage),
  );
  setIfPresent(details, "annualTurnover", toNumber(values.turnover));
  setIfPresent(
    details,
    "purposeOfLoan",
    values.usage || values.purpose || values.loanPurpose,
  );
  const secured = values.securedLoan ?? values.collateralAvailable;
  setIfPresent(
    details,
    "collateralAvailable",
    typeof secured === "boolean" ? (secured ? "Yes" : "No") : secured,
  );
  setIfPresent(
    details,
    "gstReturnsUrl",
    pickDocumentUrl(values.financials || values.gstReturnsUrl),
  );
  setIfPresent(
    details,
    "businessRegistrationCertificateUrl",
    pickDocumentUrl(values.businessRegistrationCertificateUrl),
  );
  setIfPresent(details, "tenure", values.tenure || values.loanTenure);
};

const addVehicleDetails = (details: PolicyValues, values: PolicyValues) => {
  setIfPresent(details, "vehicleType", values.vehicleType);
  setIfPresent(
    details,
    "carMakeModel",
    values.makeModel || values.carMakeModel,
  );
  setIfPresent(
    details,
    "yearOfManufacture",
    values.manufactureYear || values.year,
  );
  setIfPresent(
    details,
    "vehicleValue",
    toNumber(values.onRoadPrice) || toNumber(values.price),
  );
  setIfPresent(details, "dealerName", values.dealerName);
  setIfPresent(
    details,
    "downPaymentAmount",
    toNumber(values.downPayment),
  );
  setIfPresent(details, "kmDriven", toNumber(values.kmDriven));
  setIfPresent(details, "isUsed", values.isUsed);
  setIfPresent(details, "tenure", values.tenure || values.loanTenure);
  setIfPresent(details, "rcCopyUrl", pickDocumentUrl(values.rcCopyUrl));
  setIfPresent(
    details,
    "inspectionPhotosUrl",
    pickDocumentUrl(values.inspectionPhotos || values.inspectionPhotosUrl),
  );
};

export const buildCanonicalLoanPolicyDetails = ({
  loanType,
  values,
  metadata,
}: {
  flowKey: string;
  loanType: string;
  values: PolicyValues;
  metadata: LoanPolicyMetadata;
}) => {
  const details: PolicyValues = {};

  switch (loanType) {
    case "personal_loan": {
      const existing =
        values.existingEmisOrLoans ??
        values.existingEmis ??
        values.emiBurden ??
        values.hasExistingLoans;
      setIfPresent(details, "purpose", values.purpose || values.loanPurpose);
      setIfPresent(
        details,
        "existingEmisOrLoans",
        typeof existing === "boolean" ? (existing ? "Yes" : "No") : existing,
      );
      setIfPresent(details, "tenure", values.tenure || values.loanTenure);
      setIfPresent(
        details,
        "salarySlipUrl",
        pickDocumentUrl(values.salarySlipUrl),
      );
      break;
    }
    case "education_loan":
      setIfPresent(details, "studentName", values.studentName);
      setIfPresent(details, "courseName", values.courseName);
      setIfPresent(
        details,
        "instituteName",
        values.instituteName || values.institution,
      );
      setIfPresent(
        details,
        "countryOfStudy",
        values.countryOfStudy || values.country,
      );
      setIfPresent(
        details,
        "courseDuration",
        values.courseDuration || values.duration,
      );
      setIfPresent(
        details,
        "totalCourseFee",
        toNumber(values.totalCourseFee) || toNumber(values.loanAmount),
      );
      setIfPresent(
        details,
        "coApplicantParentName",
        values.coApplicantParentName,
      );
      setIfPresent(
        details,
        "admissionLetterUrl",
        pickDocumentUrl(values.admitLetter || values.admissionLetterUrl),
      );
      setIfPresent(
        details,
        "feeStructureUrl",
        pickDocumentUrl(values.feeStructureUrl),
      );
      setIfPresent(details, "tenure", values.tenure || values.loanTenure);
      break;
    case "Vechile Loan":
    case "Two Wheeler Loan":
    case "vehicle_loan":
      addVehicleDetails(details, values);
      break;
    case "gold_loan":
      setIfPresent(details, "goldType", values.goldType);
      setIfPresent(details, "weightInGrams", toNumber(values.weight));
      setIfPresent(details, "purity", values.purity);
      setIfPresent(
        details,
        "estimatedValue",
        toNumber(values.estimatedValue) || toNumber(values.loanAmount),
      );
      setIfPresent(details, "tenure", values.tenure || values.loanTenure);
      setIfPresent(
        details,
        "goldPhotosUrl",
        pickDocumentUrl(values.valuationSlip),
      );
      break;
    case "loan_against_car":
      setIfPresent(
        details,
        "carRegistrationNumber",
        values.carRegistrationNumber,
      );
      setIfPresent(
        details,
        "carCompanyAndModel",
        values.makeModel || values.carCompanyAndModel,
      );
      setIfPresent(details, "yearOfManufacture", values.year);
      setIfPresent(
        details,
        "carIdentificationNumber",
        values.carIdentificationNumber,
      );
      setIfPresent(
        details,
        "carInsuranceUrl",
        pickDocumentUrl(values.carInsuranceUrl),
      );
      break;
    case "instant_loan":
      setIfPresent(
        details,
        "employmentType",
        values.employmentType || values.employment,
      );
      setIfPresent(
        details,
        "salarySlipUrl",
        pickDocumentUrl(values.salarySlipUrl),
      );
      setIfPresent(
        details,
        "lastMonthBankStatementUrl",
        pickDocumentUrl(values.lastMonthBankStatementUrl),
      );
      setIfPresent(details, "cibilCheckConsent", values.cibilCheckConsent);
      break;
    case "loan_against_property":
      setIfPresent(details, "propertyType", values.propertyType);
      setIfPresent(
        details,
        "propertyAddress",
        values.propertyAddress || values.address || values.city,
      );
      setIfPresent(details, "propertyOwnerName", values.propertyOwnerName);
      setIfPresent(
        details,
        "estimatedMarketValue",
        toNumber(values.propertyValue),
      );
      setIfPresent(
        details,
        "propertyDocumentsUrl",
        pickDocumentUrl(values.ownershipDocs || values.propertyDocumentsUrl),
      );
      setIfPresent(details, "propertyAge", values.propertyAge);
      setIfPresent(details, "coApplicants", values.coApplicants);
      break;
    case "renovation_loan":
      setIfPresent(
        details,
        "propertyOwnershipProofUrl",
        pickDocumentUrl(values.propertyOwnershipProofUrl),
      );
      setIfPresent(
        details,
        "estimatedRenovationCost",
        toNumber(values.estimatedCost),
      );
      setIfPresent(
        details,
        "contractorArchitectName",
        values.contractorArchitectName || values.contractorName,
      );
      setIfPresent(
        details,
        "renovationEstimateUrl",
        pickDocumentUrl(values.plans || values.renovationEstimateUrl),
      );
      break;
    case "working_capital_loan":
      setIfPresent(
        details,
        "businessRegistrationType",
        values.businessRegistrationType,
      );
      setIfPresent(
        details,
        "businessVintage",
        toNumber(values.businessVintage) || toNumber(values.vintage),
      );
      setIfPresent(details, "annualTurnover", toNumber(values.turnover));
      setIfPresent(details, "gstNumber", values.gstNumber);
      setIfPresent(details, "itrUrl", pickDocumentUrl(values.itrUrl));
      setIfPresent(
        details,
        "gstReturnsUrl",
        pickDocumentUrl(values.gstReturnsUrl),
      );
      break;
    case "loan_against_security":
      setIfPresent(details, "typeOfSecurity", values.instrument);
      setIfPresent(
        details,
        "securityValue",
        toNumber(values.portfolioValue),
      );
      setIfPresent(details, "dematAccountNumber", values.dematAccountNumber);
      setIfPresent(details, "nameOfDepository", values.nameOfDepository);
      setIfPresent(
        details,
        "dematStatementOrFdCopyUrl",
        pickDocumentUrl(values.dpStatement),
      );
      break;
    case "machinery_loan":
      setIfPresent(details, "typeOfMachinery", values.typeOfMachinery);
      setIfPresent(details, "newOrUsed", values.newOrUsed);
      setIfPresent(details, "machineryCost", toNumber(values.machineryCost));
      setIfPresent(details, "vendorSupplierName", values.vendorSupplierName);
      setIfPresent(
        details,
        "proformaInvoiceOrQuotationUrl",
        pickDocumentUrl(values.proformaInvoiceOrQuotationUrl),
      );
      setIfPresent(
        details,
        "expectedDeliveryDate",
        values.expectedDeliveryDate,
      );
      addBusinessDetails(details, values);
      break;
    case "home_loan":
    case "Solar Loan":
      addHomeDetails(details, values);
      break;
    case "Agriculture Loan":
      setIfPresent(details, "purposeOfLoan", values.purpose);
      setIfPresent(details, "landSizeInAcres", toNumber(values.landSize));
      setIfPresent(details, "cropType", values.cropType);
      setIfPresent(
        details,
        "landDocumentsUrl",
        pickDocumentUrl(values.landDocs || values.landDocumentsUrl),
      );
      break;
    case "business_loan":
    case "dod_loan":
    case "od_loan":
    case "industrial_loan":
    case "commercial_purchases_loan":
      addBusinessDetails(details, values);
      break;
    case "top_up_loan":
      setIfPresent(details, "existingLender", values.existingLender);
      setIfPresent(details, "existingLoanType", values.loanType);
      setIfPresent(details, "topUpAmount", toNumber(values.topupAmount));
      setIfPresent(details, "onTimeEmiHistory", values.emiTrack);
      setIfPresent(
        details,
        "latestLoanStatementUrl",
        pickDocumentUrl(values.latestStatement),
      );
      break;
    case "Balance Transfer+ Top Up Loan":
      setIfPresent(details, "existingLender", values.lender);
      setIfPresent(details, "existingLoanType", values.loanType);
      setIfPresent(
        details,
        "outstandingAmount",
        toNumber(values.outstanding),
      );
      setIfPresent(details, "currentEmi", toNumber(values.emi));
      setIfPresent(
        details,
        "currentInterestRate",
        toNumber(values.interestRate),
      );
      setIfPresent(details, "tenureLeft", toNumber(values.tenureLeft));
      setIfPresent(details, "topUpAmount", toNumber(values.topupAmount));
      setIfPresent(
        details,
        "latestLoanStatementUrl",
        pickDocumentUrl(values.loanStatement),
      );
      break;
    case "credit_card":
      setIfPresent(
        details,
        "desiredCreditLimit",
        toNumber(values.requestedCreditLimit || values.desiredCreditLimit),
      );
      setIfPresent(details, "preferredBank", values.preferredBank);
      setIfPresent(
        details,
        "cardPreference",
        values.preferredCardType || values.cardPreference,
      );
      setIfPresent(details, "existingCards", values.existingCards);
      break;
    default:
      break;
  }

  return cleanPolicyDetails({ ...details, ...metadata });
};
