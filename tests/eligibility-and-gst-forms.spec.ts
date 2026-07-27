import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.ok(), `${path} should load`).toBeTruthy();
}

test.describe("Eligibility and GST form updates", () => {
  test("homepage eligibility form offers tenure through 30 years", async ({
    page,
  }) => {
    await open(page, "/");

    const tenure = page.getByRole("combobox", {
      name: "Tenure",
      exact: true,
    });
    await expect(tenure.locator("option")).toHaveCount(30);
    await expect(tenure.locator("option").last()).toHaveText("30 Years");
  });

  test("salary/income is present and forwarded to eligibility results", async ({
    page,
  }) => {
    await open(page, "/");

    const income = page
      .getByLabel("Monthly Salary / Income", { exact: true })
      .first();
    const tenure = page.getByLabel("Tenure", { exact: true }).first();

    await income.fill("75000");
    await tenure.selectOption({ label: "30 Years" });

    const checkOffers = page
      .getByRole("link", { name: "Check Offers", exact: true })
      .first();
    await expect(checkOffers).toHaveAttribute("href", /monthlyIncome=75000/);
    await expect(checkOffers).toHaveAttribute("href", /tenureYears=30/);

    await checkOffers.click();
    await expect(page).toHaveURL(/monthlyIncome=75000/);
    await expect(page).toHaveURL(/tenureYears=30/);
    await expect(
      page.getByRole("textbox", { name: "Monthly income", exact: true }),
    ).toHaveValue("75000");
    await expect(
      page.getByRole("spinbutton", { name: "Tenure", exact: true }),
    ).toHaveAttribute("max", "30");
  });

  test("GST registration lists every Indian state and union territory", async ({
    page,
  }) => {
    await open(page, "/gst-registration");

    const state = page.getByRole("combobox", { name: "State", exact: true });
    await expect(state).toBeVisible();
    await expect(state.locator("option")).toHaveCount(37);

    for (const territory of [
      "Andaman and Nicobar Islands",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Jammu and Kashmir",
      "Ladakh",
      "Lakshadweep",
      "Puducherry",
    ]) {
      await expect(state.locator("option", { hasText: territory })).toHaveCount(
        1,
      );
    }
  });
});
