import { expect, test, type Page } from "@playwright/test";

const sectionNames = [
  "Explore Loan Options products",
  "Explore Insurance Plans products",
  "Explore Credit Card Options products",
];

async function openProducts(page: Page) {
  const response = await page.goto("/products", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok(), "Products page should load").toBeTruthy();
  await expect(
    page.getByRole("heading", {
      name: "Fintaraa Products & Services",
      exact: true,
    }),
  ).toBeVisible();
}

test.describe("Products page homepage card system", () => {
  test("desktop keeps the full catalog grouped under category headings", async ({
    page,
  }) => {
    await openProducts(page);

    await expect(page.getByText("Showing 43 of 43 products")).toBeVisible();

    for (const name of sectionNames) {
      const region = page.getByRole("region", { name });
      await expect(region).toBeVisible();
      await expect(region.locator("a")).not.toHaveCount(0);
      await expect(region.locator("a img").first()).toBeVisible();
    }

    const personalLoanImage = page.getByRole("img", {
      name: "Personal Loan",
      exact: true,
    });
    await expect(personalLoanImage).toHaveAttribute(
      "src",
      /product-cards%2Floans%2Fpersonal-loan\.webp|product-cards\/loans\/personal-loan\.webp/,
    );
  });

  test("desktop uses a seven-column loan grid without a carousel", async ({
    page,
  }) => {
    const response = await page.goto("/products?category=Loans", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok(), "Products page should load").toBeTruthy();

    const loans = page.getByRole("region", {
      name: "Explore Loan Options products",
    });
    await expect(loans).toBeVisible();
    await expect(loans).toHaveClass(/lg:grid-cols-7/);
    await expect(loans.locator(".swiper")).toHaveCount(0);
    await expect(loans).not.toContainText("Managed");

    const cards = loans.locator("a");
    await expect(cards).toHaveCount(18);
    const firstRowTops = await cards.evaluateAll((items) =>
      items.slice(0, 7).map((item) => item.getBoundingClientRect().top),
    );
    expect(new Set(firstRowTops.map((top) => Math.round(top))).size).toBe(1);
  });

  test("Additional Services contains exactly the eight homepage services", async ({
    page,
  }) => {
    await openProducts(page);

    const services = page.getByRole("region", {
      name: "Explore Additional Services",
    });
    const expectedServices = [
      "CIBIL Score Check",
      "ITR Filing",
      "GST Registration & Return Filing",
      "MSME Registration",
      "Annual Compliance",
      "Project Report",
      "Tax Compliances",
      "Company Registration",
    ];

    await expect(services.locator("a")).toHaveCount(8);
    for (const service of expectedServices) {
      await expect(
        services.getByRole("heading", { name: service, exact: true }),
      ).toBeVisible();
    }

    await expect(services).not.toContainText("Digital Payments");
    await expect(services).not.toContainText("Mobile App Support");
  });

  test("mobile shows compact two-column carousel cards without page overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openProducts(page);

    const loans = page.getByRole("region", {
      name: "Explore Loan Options products",
    });
    await expect(loans.locator(".swiper")).toHaveClass(/swiper-initialized/);
    const firstSlide = loans.locator(".swiper-slide").first();
    const firstCard = firstSlide.locator("a");

    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByRole("img")).toBeVisible();

    const slideBox = await firstSlide.boundingBox();
    expect(slideBox).not.toBeNull();
    expect(slideBox!.width).toBeLessThan(190);
    expect(slideBox!.width).toBeGreaterThan(150);

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
      dimensions.clientWidth + 1,
    );
  });
});
