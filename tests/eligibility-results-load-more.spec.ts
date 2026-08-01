import { expect, test } from "@playwright/test";

const noMatchUrl =
  "/eligibility-results?product=loan&loanType=instant-loan&amount=999999999&salaryType=Salaried&monthlyIncome=0&cibilScore=300&tenureYears=30";

test("eligibility result cards load six at a time", async ({ page }) => {
  const response = await page.goto(noMatchUrl, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBeTruthy();

  const heading = page.getByRole("heading", {
    name: "Closest partner options",
    exact: true,
  });
  const section = heading.locator("xpath=ancestor::section[1]");
  const cards = section.locator("article");

  await expect(cards).toHaveCount(6);
  await expect(section.getByText("Showing 6 of 11", { exact: true })).toBeVisible();

  await section.getByRole("button", { name: "Load 5 more" }).click();

  await expect(cards).toHaveCount(11);
  await expect(
    section.getByRole("button", { name: /Load \d+ more/ }),
  ).toHaveCount(0);
  await expect(
    page.getByText("View full partner criteria (11)", { exact: true }),
  ).toBeVisible();
});
