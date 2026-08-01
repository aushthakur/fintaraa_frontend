import { expect, test } from "@playwright/test";
import {
  buildInsurancePayload,
  buildLoanPayload,
} from "../src/components/application/payload";

const rcLookup = {
  idNumber: "DL10CW7560",
  report: { rc_number: "DL10CW7560", owner_name: "Test Owner" },
  fetchedAt: "2026-08-01T00:00:00.000Z",
};

test("website loan submissions retain the verified RC snapshot", () => {
  const payload = buildLoanPayload("vehicleLoan", {
    fullName: "Test Customer",
    carRegistrationNumber: "DL10CW7560",
    rcLookup,
  });
  expect(payload.rcLookup).toEqual(rcLookup);
  expect(payload.policyDetails.rcLookup).toBeUndefined();
});

test("website vehicle-insurance submissions retain the verified RC snapshot", () => {
  const payload = buildInsurancePayload("vehicleInsurance", {
    fullName: "Test Customer",
    registrationNumber: "DL10CW7560",
    rcLookup,
  });
  expect(payload.rcLookup).toEqual(rcLookup);
  expect(payload.policyDetails.rcLookup).toBeUndefined();
});
