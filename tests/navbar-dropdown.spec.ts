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
