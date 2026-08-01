import { expect, test } from "@playwright/test";
import { getTrustedPartnersByCategory } from "../src/data/trustedPartners";

const loanPartnerCount = getTrustedPartnersByCategory("loan").length;

test("home loan tabs render every available loan partner", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const section = page.locator(
    'section[aria-labelledby="home-loan-offers-heading"]',
  );
  await expect(section).toContainText(
    "Home Loans from 7.10%* Only with Fintaraa",
  );
  await section.scrollIntoViewIfNeeded();

  const homeLoanCarousel = section.getByRole("region", {
    name: "Home Loan offers",
  });
  const homeLoanOffers = homeLoanCarousel.locator("a");

  await expect(homeLoanCarousel.locator(".swiper")).toHaveClass(
    /swiper-initialized/,
  );
  await expect(homeLoanOffers).toHaveCount(loanPartnerCount);
  expect(loanPartnerCount).toBeGreaterThan(7);
  await expect
    .poll(async () => {
      const tops = await homeLoanCarousel
        .locator("a")
        .evaluateAll((slides) =>
          slides.map((slide) =>
            Math.round(slide.getBoundingClientRect().top),
          ),
        );
      return new Set(tops).size;
    })
    .toBe(2);
  await expect(section.getByText("YES Bank", { exact: true })).toHaveCount(1);
  await expect(
    section.getByText("Shriram Finance", { exact: true }),
  ).toHaveCount(1);
  await expect
    .poll(async () =>
      homeLoanCarousel.evaluate((carousel) => {
        const bottom = carousel.getBoundingClientRect().bottom;
        return Array.from(carousel.querySelectorAll("a")).every(
          (card) => card.getBoundingClientRect().bottom <= bottom + 1,
        );
      }),
    )
    .toBe(true);

  await section.getByRole("button", { name: "Personal Loan" }).click();
  await expect(section).toContainText(
    "Personal Loans from 7.10%* Only with Fintaraa",
  );

  const personalLoanCarousel = section.getByRole("region", {
    name: "Personal Loan offers",
  });
  await expect(personalLoanCarousel.locator("a")).toHaveCount(loanPartnerCount);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(async () => {
      const tops = await personalLoanCarousel
        .locator("a")
        .evaluateAll((slides) =>
          slides.map((slide) =>
            Math.round(slide.getBoundingClientRect().top),
          ),
        );
      return new Set(tops).size;
    })
    .toBe(2);
});
