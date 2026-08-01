import { expect, test } from "@playwright/test";

const pageUrl = "/products/instant-loan";

test("renders every instant-loan lender and captures a callback lead", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route("**/backend-api/contact-requests", async (route) => {
    expect(route.request().method()).toBe("POST");
    const payload = route.request().postDataJSON();
    expect(payload.formSource).toBe("instant_loan_marketplace");
    expect(payload.message).toContain("Instant Loan lead");
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: { _id: "test-lead" } }),
    });
  });

  const response = await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  await expect(
    page.getByRole("heading", {
      name: "Compare Instant Loans from all partner banks",
    }),
  ).toBeVisible();

  const lenderHeading = page.getByRole("heading", {
    name: "All Instant Loan Banks & NBFCs",
  });
  const lenderSection = lenderHeading.locator("xpath=ancestor::section[1]");
  const lenderCards = lenderSection.locator("article");
  const initialLenderCount = await lenderCards.count();
  expect(initialLenderCount).toBe(6);
  await expect(
    lenderSection.getByText(/Showing 6 of \d+ partner lenders/),
  ).toBeVisible();
  const countText = await lenderSection
    .getByText(/Showing 6 of \d+ partner lenders/)
    .textContent();
  const totalLenders = Number(countText?.match(/of (\d+)/)?.[1]);
  expect(totalLenders).toBeGreaterThan(7);
  await expect(
    lenderCards.first().getByRole("link", { name: /Apply now/i }),
  ).toHaveAttribute("href", /\/apply\/loan\/instant-loan/);

  await lenderSection
    .getByRole("button", { name: "Load 6 more lenders" })
    .click();
  await expect(lenderCards).toHaveCount(Math.min(12, totalLenders));

  const search = lenderSection.getByRole("searchbox", {
    name: "Search banks and NBFCs",
  });
  await search.fill("no-such-lender-123");
  await expect(lenderSection.getByText("No lender found")).toBeVisible();
  await lenderSection.getByRole("button", { name: "Clear search" }).click();
  await expect(lenderCards).toHaveCount(initialLenderCount);

  await lenderCards.first().getByRole("button", { name: "Get callback" }).click();
  await expect(page.getByLabel("Preferred Bank / NBFC (optional)")).not.toHaveValue("");

  await page.getByLabel("Full Name *").fill("Rishabh Gupta");
  await page.getByLabel("Mobile Number *").fill("9876543210");
  await page.getByLabel("Email Address *").fill("rishabh@example.com");
  await page.getByLabel("City *").fill("New Delhi");
  await page.getByLabel("Required Amount *").selectOption({ index: 2 });
  await page.getByLabel("Employment Type *").selectOption("Salaried");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Get matched with lenders" }).click();

  await expect(
    page.getByText(
      "Request submitted successfully. Our loan expert will contact you shortly.",
    ),
  ).toBeVisible();

  const desktopHasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(desktopHasOverflow).toBeFalsy();
  await page.screenshot({
    path: "/tmp/instant-loan-marketplace-desktop.png",
    fullPage: true,
  });
});

test("instant-loan marketplace stays uncluttered on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  await expect(
    page.getByRole("heading", {
      name: "Compare Instant Loans from all partner banks",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Find the right instant loan" }),
  ).toBeVisible();

  const mobileHasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(mobileHasOverflow).toBeFalsy();
  await page.screenshot({
    path: "/tmp/instant-loan-marketplace-mobile.png",
    fullPage: true,
  });
});
