import { expect, test } from "@playwright/test";

test.describe("purpose-led product and eligibility pages", () => {
  test("eligibility results clearly distinguish matches from approvals", async ({
    page,
  }) => {
    await page.goto(
      "/eligibility-results?loanType=personal-loan&amount=1000000&cibilScore=720&salaryType=Salaried&tenureYears=5",
      { waitUntil: "domcontentloaded" },
    );

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Your Personal Loan partner matches",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/indicative matches from active Fintaraa partner criteria/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Update Matches" }),
    ).toBeVisible();

    const fullCriteria = page.locator("details").filter({
      hasText: "View full partner criteria",
    });
    await expect(fullCriteria).not.toHaveAttribute("open", "");
    await fullCriteria.locator("summary").click();
    await expect(fullCriteria).toHaveAttribute("open", "");
  });

  test("a product deep link opens the requested guide section", async ({
    page,
  }) => {
    await page.goto("/products/personal-loan#documents", {
      waitUntil: "domcontentloaded",
    });

    const tablist = page.getByRole("tablist", {
      name: "Loan information sections",
    });
    await expect(
      tablist.getByRole("tab", { name: /Documents/i }),
    ).toHaveAttribute("aria-selected", "true");
  });
});

