import { expect, test, type Page } from "@playwright/test";
import { formFlows } from "../src/components/application/flows";

const homeLoanApplicant = {
  name: "Home Loan Applicant",
  email: "home-loan@example.com",
  mobile: "9876543210",
  panCard: "ABCDE1234F",
  aadhaarCard: "123456789012",
  dateOfBirth: "1990-01-01",
  gender: "male",
  bankDetails: {
    bankName: "Example Bank",
    accountType: "savings",
    accountNumber: "1234567890",
    ifscCode: "HDFC0001234",
  },
  kycProfile: {
    personalDetails: {
      fullName: "Home Loan Applicant",
      email: "home-loan@example.com",
      mobile: "9876543210",
      dateOfBirth: "1990-01-01",
      gender: "male",
      maritalStatus: "married",
      panNumber: "ABCDE1234F",
      aadhaarNumber: "123456789012",
      address: "12 Test Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    employmentDetails: {
      employmentType: "salaried",
      employerName: "Example Company",
      monthlyIncome: 100000,
      totalExperience: 5,
      officeAddress: "34 Office Road",
    },
  },
};

async function openHomeLoanApplication(page: Page) {
  await page.addInitScript((storedUser) => {
    localStorage.setItem("authType", "user");
    localStorage.setItem("token", "playwright-user-token");
    localStorage.setItem("user", JSON.stringify(storedUser));
  }, homeLoanApplicant);

  await page.route("**/backend-api/**", async (route) => {
    await route.fulfill({ json: { data: {} } });
  });
  await page.route("**/user/get-current*", async (route) => {
    await route.fulfill({ json: { data: homeLoanApplicant } });
  });
  await page.route("**/documents/document-catalog*", async (route) => {
    await route.fulfill({ json: { data: [] } });
  });
  await page.route("**/user/digilocker*", async (route) => {
    await route.fulfill({ json: { data: [] } });
  });

  const response = await page.goto("/apply/loan/home-loan", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "Apply for Home Loan" }),
  ).toBeVisible();
}

test.describe("Home loan application flow", () => {
  test("uses age across applications and keeps optional bank fields unmarked", () => {
    const allFields = Object.values(formFlows).flatMap((flow) =>
      flow.steps.flatMap((step) => step.fields),
    );
    const homeLoanFields = formFlows.homeLoan.steps.flatMap(
      (step) => step.fields,
    );

    expect(
      allFields.filter(
        (field) =>
          /date of birth|^dob$/i.test(field.label) ||
          /dateOfBirth|^dob$/i.test(field.key),
      ),
    ).toEqual([]);
    expect(
      homeLoanFields.find((field) => field.key === "age"),
    ).toEqual(
      expect.objectContaining({
        label: "Age",
        type: "number",
        required: true,
      }),
    );
    for (const flowKey of ["healthInsurance", "groupInsurance"]) {
      expect(
        formFlows[flowKey].steps
          .flatMap((step) => step.fields)
          .find((field) => field.key === "applicantAge"),
      ).toEqual(
        expect.objectContaining({
          label: "Age",
          type: "number",
          required: true,
        }),
      );
    }

    for (const key of ["accountType", "accountNumber", "ifscCode"]) {
      expect(homeLoanFields.find((field) => field.key === key)?.required).toBe(
        undefined,
      );
    }
  });

  test("shows Age and optional bank labels on the applicant page", async ({
    page,
  }) => {
    await openHomeLoanApplication(page);

    await expect(
      page.locator('[data-application-field="age"]'),
    ).toContainText("Age*");
    await expect(page.getByText("Date of Birth", { exact: true })).toHaveCount(
      0,
    );

    for (const key of ["accountType", "accountNumber", "ifscCode"]) {
      await expect(
        page.locator(`[data-application-field="${key}"] > span`),
      ).not.toContainText("*");
    }
  });

  test("keeps co-applicants after applicant documents in the flow definition", () => {
    const steps = formFlows.homeLoan.steps;
    const applicantStep = steps.find((step) => step.key === "applicant");
    const documentIndex = steps.findIndex((step) => step.key === "documents");
    const coApplicantIndex = steps.findIndex(
      (step) => step.key === "coApplicant",
    );
    const coApplicantStep = steps[coApplicantIndex];
    const interestPreference = steps
      .flatMap((step) => step.fields)
      .find((field) => field.key === "interestPreference");

    expect(
      applicantStep?.fields.some(
        (field) =>
          field.key === "coApplicant" || field.key === "coApplicants",
      ),
    ).toBeFalsy();
    expect(coApplicantIndex).toBeGreaterThan(documentIndex);
    expect(coApplicantStep.fields).toEqual([
      expect.objectContaining({
        key: "coApplicants",
        type: "coApplicants",
      }),
    ]);
    expect(coApplicantStep.fields[0].required).toBeUndefined();
    expect(interestPreference).toEqual(
      expect.objectContaining({
        type: "select",
        options: [
          { label: "Fixed", value: "fixed" },
          { label: "Floating", value: "floating" },
        ],
      }),
    );
  });

  test("reveals co-applicant after documents and displays the application number after submission", async ({
    page,
  }) => {
    await openHomeLoanApplication(page);

    await expect(
      page.getByRole("button", { name: "Add co-applicant", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Continue" }).click();

    await page
      .getByRole("combobox", { name: "Property Category*" })
      .selectOption("residential");
    await page
      .getByRole("combobox", { name: "Property Type*" })
      .selectOption("apartment");
    await page.getByRole("combobox", { name: "State*" }).selectOption("Delhi");
    await page.locator('[data-application-field="city"] input').fill("Delhi");
    await page
      .locator('[data-application-field="estimate"] input')
      .fill("7500000");
    await page
      .locator('[data-application-field="loanAmount"] input')
      .fill("6000000");
    await page.getByRole("button", { name: "Continue" }).click();

    const interestPreference = page.getByRole("combobox", {
      name: "Interest Preference",
    });
    await expect(interestPreference).toBeVisible();
    await expect(interestPreference.locator("option")).toHaveText([
      "Select interest preference",
      "Fixed",
      "Floating",
    ]);
    await interestPreference.selectOption("floating");
    await page
      .getByRole("checkbox", {
        name: "I authorize bureau check for eligibility*",
      })
      .check();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByRole("button", { name: "Add co-applicant", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Continue" }).click();

    const addCoApplicant = page
      .getByRole("button", { name: "Add co-applicant", exact: true })
      .first();
    await expect(addCoApplicant).toBeVisible();
    await addCoApplicant.click();

    await expect(
      page.getByText("Co-applicant 1", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Select documents", { exact: true }),
    ).toBeVisible();

    await page.route("**/backend-api/loanquery", async (route) => {
      await route.fulfill({
        json: { data: { loanId: "LN-TRACK-0001" } },
      });
    });
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await page
      .getByRole("checkbox", {
        name: /I agree that Fintaraa may contact me/i,
      })
      .check();
    await page
      .getByRole("button", { name: "Submit Application", exact: true })
      .click();

    const successNotice = page.locator("form").getByRole("status");
    await expect(successNotice).toContainText("Application Number");
    await expect(successNotice).toContainText("LN-TRACK-0001");
    await expect(
      successNotice.getByRole("link", { name: "Track this application" }),
    ).toHaveAttribute(
      "href",
      "/application-status?applicationId=LN-TRACK-0001",
    );
  });
});
