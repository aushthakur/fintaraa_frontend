import { expect, test, type Page } from "@playwright/test";
import { formFlows } from "../src/components/application/flows";

const user = {
  name: "Test Applicant",
  email: "applicant@example.com",
  mobile: "9876543210",
  panCard: "ABCDE1234F",
  monthlyIncome: 50000,
  kycProfile: {
    employmentDetails: {
      employmentType: "salaried",
      monthlyIncome: 50000,
    },
  },
};

async function openPersonalLoanApplication(page: Page) {
  await page.addInitScript((storedUser) => {
    localStorage.setItem("authType", "user");
    localStorage.setItem("token", "playwright-user-token");
    localStorage.setItem("user", JSON.stringify(storedUser));
  }, user);

  await page.route("**/backend-api/**", async (route) => {
    await route.fulfill({ json: { data: {} } });
  });
  await page.route("**/user/get-current*", async (route) => {
    await route.fulfill({ json: { data: user } });
  });
  await page.route("**/documents/document-catalog*", async (route) => {
    await route.fulfill({ json: { data: [] } });
  });
  await page.route("**/user/digilocker*", async (route) => {
    await route.fulfill({ json: { data: [] } });
  });

  const response = await page.goto("/apply/loan/personal-loan", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "Apply for Personal Loan" }),
  ).toBeVisible();
}

test.describe("Personal loan application fields", () => {
  test("keeps declaration checkboxes in the details step instead of a separate page", () => {
    const declarationSteps = Object.entries(formFlows).flatMap(
      ([flowKey, flow]) =>
        flow.steps
          .filter(
            (step) =>
              /declaration/i.test(step.key) ||
              /declaration/i.test(step.title),
          )
          .map((step) => `${flowKey}:${step.key}`),
    );

    expect(declarationSteps).toEqual([]);

    const personalDetails = formFlows.personalLoan.steps[0];
    expect(personalDetails.title).toBe("Personal Details");
    expect(personalDetails.fields.slice(-3).map((field) => field.key)).toEqual([
      "consentKyc",
      "consentBureau",
      "consentCommunication",
    ]);
    expect(
      personalDetails.fields.slice(-3).every((field) => field.type === "checkbox"),
    ).toBeTruthy();

    const vehicleDetails = formFlows.vehicleLoan.steps[0];
    expect(vehicleDetails.fields.slice(-2).map((field) => field.key)).toEqual([
      "insuranceConsent",
      "creditConsent",
    ]);
  });

  test("shows the requested conditional fields and document controls", async ({
    page,
  }) => {
    await openPersonalLoanApplication(page);

    const preferredContactTime = page.getByRole("combobox", {
      name: "Preferred Contact Time",
    });
    await expect(preferredContactTime).toBeVisible();
    await expect(preferredContactTime.locator("option")).toHaveText([
      "Select preferred contact time",
      "Morning",
      "Afternoon",
      "Evening",
    ]);
    await page
      .getByRole("checkbox", { name: "I consent to digital KYC" })
      .check();
    await page
      .getByRole("checkbox", {
        name: "I allow credit bureau pull for offer eligibility",
      })
      .check();
    await page
      .getByRole("checkbox", {
        name: "I agree to receive updates on SMS/Email/WhatsApp",
      })
      .check();
    await page.getByRole("button", { name: "Continue" }).click();

    const incomeField = page.locator('[data-application-field="income"]');
    await expect(incomeField).toContainText("Monthly Income*");

    const emiField = page.locator('[data-application-field="emiBurden"]');
    await expect(emiField).toHaveCount(0);

    await page
      .getByRole("combobox", { name: "Do you have existing loans?" })
      .selectOption("yes");
    await expect(emiField).toBeVisible();

    await page
      .getByRole("combobox", { name: "Do you have existing loans?" })
      .selectOption("no");
    await expect(emiField).toHaveCount(0);

    await page
      .locator('[data-application-field="amount"] input')
      .fill("500000");
    await page
      .locator('[data-application-field="tenure"] input')
      .fill("36");
    await page.getByRole("button", { name: "Continue" }).click();

    for (const label of [
      "Aadhaar Card",
      "PAN Card",
      "Salary Slip",
      "Bank Statement",
      "CIBIL Report",
    ]) {
      await expect(
        page
          .locator("section")
          .filter({ hasText: new RegExp(label, "i") })
          .first(),
      ).toBeVisible();
    }

    const cibilCard = page.locator(
      'section[data-document-upload="cibil_report"]',
    );
    await cibilCard.locator('input[type="file"]').setInputFiles({
      name: "cibil-report.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.7\ntrailer\n<< /Encrypt 2 0 R >>\n%%EOF"),
    });

    await expect(
      cibilCard.getByRole("button", { name: "View Document" }),
    ).toBeVisible();
    await expect(cibilCard.getByText("Enter Password")).toBeVisible();
    await expect(
      cibilCard.getByPlaceholder("Enter document password"),
    ).toBeVisible();
  });
});
