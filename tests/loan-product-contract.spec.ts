import { expect, test } from "@playwright/test";
import { getApplicationFlow } from "../src/components/application/flowRegistry";
import {
  getRequiredLoanProductMetadata,
  requiredLoanProductContracts,
  resolveLoanProductDisplayName,
  resolveLoanTypeForFlow,
} from "../src/components/application/loanProductContract";
import { buildCanonicalLoanPolicyDetails } from "../src/components/application/loanPolicyDetails";

test("all 24 required loan products resolve to a form and exact payload contract", () => {
  expect(requiredLoanProductContracts).toHaveLength(24);

  for (const contract of requiredLoanProductContracts) {
    for (const slug of [contract.slug, ...(contract.aliases || [])]) {
      const resolved = getApplicationFlow("loan", slug);
      expect(resolved?.flowKey).toBe(contract.flowKey);
      expect(resolved?.flow).toBeTruthy();
    }

    expect(resolveLoanTypeForFlow(contract.flowKey)).toBe(contract.loanType);
    expect(getRequiredLoanProductMetadata(contract.flowKey)).toEqual({
      requestedProductName: contract.name,
      requestedProductSlug: contract.slug,
      productVariant: contract.slug,
      metaFlowKey: contract.flowKey,
    });
  }

  expect(resolveLoanTypeForFlow("vehicleLoan")).toBe("Vechile Loan");
});

test("unknown loan routes and flow keys never fall back to Personal Loan", () => {
  expect(getApplicationFlow("loan", "unknown-loan")).toBeNull();
  expect(() => resolveLoanTypeForFlow("unknownLoan")).toThrow(
    "Unsupported loan application flow: unknownLoan",
  );
});

test("strict product policy details use backend canonical keys only", () => {
  const metadata = {
    requestedProductName: "Education Loan",
    requestedProductSlug: "education-loan",
    productVariant: "education-loan",
    metaFlowKey: "educationLoan",
  };
  expect(
    buildCanonicalLoanPolicyDetails({
      flowKey: "educationLoan",
      loanType: "education_loan",
      values: {
        fullName: "Student User",
        phone: "9876543210",
        institution: "Example University",
        country: "India",
        courseName: "MBA",
        duration: "24 months",
        loanAmount: "500000",
      },
      metadata,
    }),
  ).toEqual({
    courseName: "MBA",
    instituteName: "Example University",
    countryOfStudy: "India",
    courseDuration: "24 months",
    totalCourseFee: 500000,
    ...metadata,
  });
});

test("shared backend types retain the correct customer-facing product name", () => {
  expect(
    resolveLoanProductDisplayName({
      loanType: "home_loan",
      policyDetails: { productVariant: "construction-loan" },
    }),
  ).toBe("Construction Loan");
  expect(
    resolveLoanProductDisplayName({
      loanType: "vehicle_loan",
      policyDetails: { metaFlowKey: "usedCarLoan" },
    }),
  ).toBe("Used Car Loan");
  expect(resolveLoanProductDisplayName({ loanType: "Vechile Loan" })).toBe(
    "Car Loan",
  );
});
