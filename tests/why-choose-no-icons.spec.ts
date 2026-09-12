import { expect, test, type Locator, type Page } from "@playwright/test";

async function expectNoVisualIcons(block: Locator) {
  await expect(block).toBeVisible();
  await expect(block.locator("svg, img")).toHaveCount(0);
}

async function openPage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.ok(), `${path} should load`).toBeTruthy();
}

test.describe("Why Fintaraa sections", () => {
  test("home and blog keep trust stats while cards stay icon-free", async ({
    page,
  }) => {
    for (const path of ["/", "/blog"]) {
      await openPage(page, path);

      const reasons = page.getByRole("region", {
        name: "Why choose Fintaraa",
      });
      const section = reasons.locator("xpath=ancestor::section[1]");

      await expect(reasons.locator("article")).toHaveCount(5);
      await expectNoVisualIcons(section);
      await expect(section).toContainText("2M+");
      await expect(section).toContainText("Happy customers");
      await expect(section).toContainText("50+");
      await expect(section).toContainText("Partner banks & NBFCs");
      await expect(section).toContainText("₹50,000 Cr+");
      await expect(section).toContainText("Processed successfully");
      await expect(section).toContainText("24-48 hrs");
      await expect(section).toContainText("Average approval time");
      await expect(section).toContainText("4.8/5");
      await expect(section).toContainText("Customer rating");

      for (const serial of ["01", "02", "03", "04", "05"]) {
        await expect(
          section.getByText(serial, { exact: true }),
        ).toHaveCount(0);
      }
    }
  });

  test("DSA and careers Why Choose cards do not render icons", async ({
    page,
  }) => {
    for (const path of ["/become-dsa", "/careers"]) {
      await openPage(page, path);

      const label = page.getByText("Why Choose Fintaraa?", { exact: true });
      const section = label.locator("xpath=ancestor::section[1]");

      await expectNoVisualIcons(section);
    }
  });

  test("DSA partner benefits remove card icons and the headline count", async ({
    page,
  }) => {
    await openPage(page, "/become-dsa");

    const heading = page.getByRole("heading", {
      name: "Why Partner with Fintaraa?",
      exact: true,
    });
    const benefitGrid = heading.locator("xpath=following-sibling::div[1]");

    await expectNoVisualIcons(benefitGrid);
    await expect(benefitGrid).not.toContainText("50+ Bank Tie-ups");
    await expect(benefitGrid).toContainText("Bank & NBFC Tie-ups");
  });

  test("franchise Why Choose cards do not render icons or badge images", async ({
    page,
  }) => {
    await openPage(page, "/franchise");

    const label = page.getByText("Why choose Fintaraa", { exact: true });
    const section = label.locator("xpath=ancestor::section[1]");

    await expectNoVisualIcons(section);
  });

  test("about and credit-card Why Fintaraa cards are text-only", async ({
    page,
  }) => {
    await openPage(page, "/about-us");

    const aboutHeading = page.getByRole("heading", {
      name: "Why Fintaraa stands out.",
      exact: true,
    });
    const aboutSection = aboutHeading.locator("xpath=ancestor::section[1]");
    await expectNoVisualIcons(aboutSection);

    for (const serial of ["01", "02", "03", "04", "05"]) {
      await expect(
        aboutSection.getByText(serial, { exact: true }),
      ).toHaveCount(0);
    }

    await openPage(page, "/credit-cards");

    const cardsHeading = page.getByRole("heading", {
      name: "Why choose Fintaraa for Credit Cards?",
      exact: true,
    });
    const cardsBlock = cardsHeading.locator("xpath=parent::div[1]");
    await expectNoVisualIcons(cardsBlock);
  });

  test("bank Why Apply block has no icons, avatars, or customer counter", async ({
    page,
  }) => {
    await openPage(page, "/banks/hdfc-bank");

    const heading = page.getByRole("heading", {
      name: "Why Apply on Fintaraa?",
      exact: true,
    });
    const block = heading.locator("xpath=parent::div[1]");

    await expectNoVisualIcons(block);
    await expect(block).not.toContainText("50,000+");
    await expect(block).not.toContainText("Happy Customers");
  });
});
