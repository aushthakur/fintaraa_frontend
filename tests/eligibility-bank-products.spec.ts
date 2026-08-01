import { expect, test } from "@playwright/test";

const instantLoanResultsUrl =
  "/eligibility-results?product=loan&loanType=instant-loan&amount=1000000&salaryType=Salaried&monthlyIncome=50000&cibilScore=720&tenureYears=5";

test("shows bank-product credit cards with external apply destinations", async ({
  page,
}) => {
  const response = await page.goto(instantLoanResultsUrl, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBeTruthy();

  const instantHeading = page.getByRole("heading", {
    name: "Instant loan partner offers",
    exact: true,
  });
  const instantSection = instantHeading.locator("xpath=ancestor::section[1]");
  const instantCards = instantSection.locator(
    'article[data-bank-product-type="loan"]',
  );

  await expect(instantCards).toHaveCount(6);
  await expect(
    instantSection.getByText(/Showing 6 of \d+/, { exact: true }),
  ).toBeVisible();
  await expect(
    instantCards.first().getByRole("link", { name: "Apply on bank site" }),
  ).toHaveAttribute("href", /^https:\/\//);

  const personalHeading = page.getByRole("heading", {
    name: "Other personal loan options",
    exact: true,
  });
  const personalSection = personalHeading.locator(
    "xpath=ancestor::section[1]",
  );
  await expect(personalSection.locator("article")).toHaveCount(6);
  await expect(
    personalSection.getByText(/Showing 6 of \d+/, { exact: true }),
  ).toBeVisible();

  const heading = page.getByRole("heading", {
    name: "Credit cards from partner banks",
    exact: true,
  });
  const section = heading.locator("xpath=ancestor::section[1]");
  const cards = section.locator(
    'article[data-bank-product-type="credit_card"]',
  );

  await expect(cards).toHaveCount(6);
  await expect(
    section.getByText("Showing 6 of 35", { exact: true }),
  ).toBeVisible();

  const firstApplyLink = cards
    .first()
    .getByRole("link", { name: "Apply on bank site" });
  await expect(firstApplyLink).toHaveAttribute("href", /^https:\/\//);
  await expect(firstApplyLink).toHaveAttribute("target", "_blank");

  await section.getByRole("button", { name: "Load 6 more" }).click();
  await expect(cards).toHaveCount(12);

  await expect(page.locator('a[href^="/apply/loan/instant-loan"]')).toHaveCount(
    0,
  );
});
