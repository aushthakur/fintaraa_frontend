import { expect, test } from "@playwright/test";

test.describe("navbar dropdown navigation", () => {
  test("desktop mega menu closes immediately after a destination click", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const navbar = page.locator("nav.mobile-site-nav");
    await navbar.getByRole("link", { name: "Loans", exact: true }).hover();

    const loanDropdown = page.locator('[data-nav-dropdown="Loans"]');
    await expect(loanDropdown).toHaveAttribute("data-state", "open");
    await expect(loanDropdown).toBeVisible();

    await loanDropdown
      .getByRole("link", { name: "Education Loan", exact: true })
      .click();

    await expect(page).toHaveURL(/\/products\/education-loan$/);
    await expect(
      page.locator('[data-nav-dropdown="Loans"]'),
    ).toHaveAttribute("data-state", "closed");
    await expect(page.locator('[data-nav-dropdown="Loans"]')).toHaveCSS(
      "opacity",
      "0",
    );
  });

  test("credit card in the Loans dropdown opens the dedicated cards page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const navbar = page.locator("nav.mobile-site-nav");
    await navbar.getByRole("link", { name: "Loans", exact: true }).hover();

    const creditCardLink = page
      .locator('[data-nav-dropdown="Loans"]')
      .getByRole("link", { name: "Credit Card", exact: true });

    await expect(creditCardLink).toHaveAttribute("href", "/credit-cards");
    await creditCardLink.click();
    await expect(page).toHaveURL(/\/credit-cards$/);
  });

  test("long loan labels wrap without crossing into the next column", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const navbar = page.locator("nav.mobile-site-nav");
    await navbar.getByRole("link", { name: "Loans", exact: true }).hover();

    const loanDropdown = page.locator('[data-nav-dropdown="Loans"]');
    await expect(loanDropdown).toHaveAttribute("data-state", "open");

    const securedColumn = loanDropdown.locator(
      '[data-nav-section="Home & Secured"]',
    );
    const businessColumn = loanDropdown.locator(
      '[data-nav-section="Business & Industry"]',
    );
    const longLabel = securedColumn.getByText(
      "Balance Transfer Loan + Top up Loan",
      { exact: true },
    );

    await expect(longLabel).toHaveCSS("white-space", "normal");

    const layout = await longLabel.evaluate((label, nextColumn) => {
      const range = document.createRange();
      range.selectNodeContents(label);
      const lineRects = Array.from(range.getClientRects());
      const nextColumnLeft = (nextColumn as HTMLElement).getBoundingClientRect().left;

      return {
        lineCount: lineRects.length,
        furthestTextEdge: Math.max(...lineRects.map((rect) => rect.right)),
        nextColumnLeft,
      };
    }, await businessColumn.elementHandle());

    expect(layout.lineCount).toBeGreaterThan(1);
    expect(layout.furthestTextEdge).toBeLessThanOrEqual(layout.nextColumnLeft);
  });

  test("mobile menu and expanded section reset after navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Toggle menu" }).click();
    const loansToggle = page.locator(
      'button[aria-controls="mobile-nav-loans"]',
    );
    await loansToggle.click();
    await expect(loansToggle).toHaveAttribute("aria-expanded", "true");

    await page
      .getByRole("link", { name: "Education Loan", exact: true })
      .click();
    await expect(page).toHaveURL(/\/products\/education-loan$/);
    await expect(page.getByText("Explore Fintaraa", { exact: true })).toBeHidden();

    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(
      page.locator('button[aria-controls="mobile-nav-loans"]'),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
