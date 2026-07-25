import { expect, test, type Page } from "@playwright/test";
import insuranceBannerCatalog from "../src/data/insuranceBannerCatalog.json";

const productSlugs = insuranceBannerCatalog.map((product) => product.slug);

async function assertRenderedBanner(
  page: Page,
  slug: string,
  viewport: "desktop" | "mobile",
) {
  const response = await page.goto(`/products/${slug}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok(), `${slug} page should load`).toBeTruthy();

  const hero = page.locator(".product-hero-swiper");
  await expect(hero, `${slug} should render the product hero`).toBeVisible();

  const image = hero.locator("img").first();
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((element) => element.currentSrc))
    .toContain(
      `/assets/insurance-banners/rendered/${slug}-01-${viewport}.webp`,
    );

  const dimensions = await image.evaluate((element) => ({
    width: element.naturalWidth,
    height: element.naturalHeight,
  }));
  expect(dimensions).toEqual(
    viewport === "desktop"
      ? { width: 1600, height: 640 }
      : { width: 900, height: 1200 },
  );
}

test.describe("insurance product banners", () => {
  test("all desktop product pages use their product-specific banner", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const slug of productSlugs) {
      await assertRenderedBanner(page, slug, "desktop");
    }
  });

  test("all mobile product pages use their mobile art direction", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const slug of productSlugs) {
      await assertRenderedBanner(page, slug, "mobile");
    }
  });

  test("every generated slide asset is publicly available", async ({
    request,
  }) => {
    for (const slug of productSlugs) {
      for (const slide of ["01", "02"]) {
        for (const viewport of ["desktop", "mobile"]) {
          const response = await request.get(
            `/assets/insurance-banners/rendered/${slug}-${slide}-${viewport}.webp`,
          );
          expect(
            response.ok(),
            `${slug}-${slide}-${viewport} should be available`,
          ).toBeTruthy();
          expect(response.headers()["content-type"]).toBe("image/webp");
        }
      }
    }
  });

  test("insurance popup uses the same content-rich product artwork", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/products/life-insurance", {
      waitUntil: "domcontentloaded",
    });

    const popup = page.getByRole("dialog");
    await expect(popup).toBeVisible({ timeout: 10_000 });

    const popupImage = popup.locator("img");
    await expect(popupImage).toBeVisible();
    await expect
      .poll(() => popupImage.evaluate((element) => element.currentSrc))
      .toContain(
        "/assets/insurance-banners/rendered/life-insurance-01-desktop.webp",
      );
  });

  test("insurance guide tabs match the professional loan-page interaction", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/products/life-insurance", {
      waitUntil: "domcontentloaded",
    });

    const tablist = page.getByRole("tablist", {
      name: "Insurance information sections",
    });
    const coverageTab = tablist.getByRole("tab", { name: "Coverage" });
    await expect(coverageTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Quick links", { exact: true })).toBeVisible();
    await expect(
      page
        .locator("article")
        .getByRole("heading", { name: /Coverage/i }),
    ).toBeVisible();

    const eligibilityTab = tablist.getByRole("tab", { name: "Eligibility" });
    await eligibilityTab.click();
    await expect(eligibilityTab).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(/#eligibility$/);
    await expect(
      page
        .locator("article")
        .getByRole("heading", { name: /Eligibility/i }),
    ).toBeVisible();
  });
});
