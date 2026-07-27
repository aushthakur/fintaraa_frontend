import { expect, test, type Page } from "@playwright/test";
import insuranceBannerCatalog from "../src/data/insuranceBannerCatalog.json";

const productSlugs = insuranceBannerCatalog.map((product) => product.slug);
const websiteBaseUrl =
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3101";

const imageUrl = (
  slug: string,
  slide: "01" | "02",
  viewport: "desktop" | "mobile",
) =>
  `${websiteBaseUrl}/assets/insurance-banners/rendered/${slug}-${slide}-${viewport}.webp`;

async function mockInsuranceBannerApi(page: Page, enabled = true) {
  await page.route("**/api/banner/public/**", async (route) => {
    const url = new URL(route.request().url());
    const type = url.pathname.split("/").pop();
    const slug = url.searchParams.get("productSlug") || "";

    if (!type?.startsWith("insurance_detail")) {
      await route.continue();
      return;
    }

    if (!enabled) {
      await route.fulfill({ json: { data: [] } });
      return;
    }

    const isPopup = type.includes("_popup_");
    const rows = isPopup
      ? [
          {
            _id: `${type}-${slug}`,
            productSlug: slug,
            title: `${slug} popup`,
            image: imageUrl(
              slug,
              "01",
              type.endsWith("_mobile") ? "mobile" : "desktop",
            ),
            priority: 1,
            status: "active",
          },
        ]
      : (["01", "02"] as const).map((slide, index) => ({
          _id: `insurance-detail-${slug}-${slide}`,
          productSlug: slug,
          title: `${slug} banner ${slide}`,
          image: imageUrl(slug, slide, "desktop"),
          mobileImage: imageUrl(slug, slide, "mobile"),
          displayDurationMs: 5000,
          priority: index + 1,
          status: "active",
        }));

    await route.fulfill({ json: { data: rows } });
  });
}

async function assertBackendBanner(
  page: Page,
  slug: string,
  viewport: "desktop" | "mobile",
) {
  const response = await page.goto(`/products/${slug}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok(), `${slug} page should load`).toBeTruthy();

  const hero = page.locator(".product-hero-swiper");
  await expect(hero, `${slug} should render the backend banner`).toBeVisible();

  const image = hero.locator("img").first();
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate((element) => (element as HTMLImageElement).currentSrc),
    )
    .toContain(
      `/assets/insurance-banners/rendered/${slug}-01-${viewport}.webp`,
    );

  const dimensions = await image.evaluate((element) => {
    const htmlImage = element as HTMLImageElement;
    return {
      width: htmlImage.naturalWidth,
      height: htmlImage.naturalHeight,
    };
  });
  expect(dimensions).toEqual(
    viewport === "desktop"
      ? { width: 1600, height: 640 }
      : { width: 900, height: 1200 },
  );
}

test.describe("insurance product banners", () => {
  test.beforeEach(async ({ page }) => {
    await mockInsuranceBannerApi(page);
  });

  test("all desktop product pages use their product-specific backend banner", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const slug of productSlugs) {
      await assertBackendBanner(page, slug, "desktop");
    }
  });

  test("all mobile product pages use the backend mobile image", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const slug of productSlugs) {
      await assertBackendBanner(page, slug, "mobile");
    }
  });

  test("does not inject a local banner when the backend has no record", async ({
    page,
  }) => {
    await page.unroute("**/api/banner/public/**");
    await mockInsuranceBannerApi(page, false);
    await page.goto("/products/life-insurance", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByLabel("Loading Life Insurance banners")).toHaveCount(
      0,
    );
    await expect(page.locator(".product-hero-swiper")).toHaveCount(0);
  });

  test("insurance popup uses its device-specific backend record", async ({
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
      .poll(() =>
        popupImage.evaluate(
          (element) => (element as HTMLImageElement).currentSrc,
        ),
      )
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
      page.locator("article").getByRole("heading", { name: /Coverage/i }),
    ).toBeVisible();

    const eligibilityTab = tablist.getByRole("tab", { name: "Eligibility" });
    await eligibilityTab.click();
    await expect(eligibilityTab).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(/#eligibility$/);
    await expect(
      page.locator("article").getByRole("heading", { name: /Eligibility/i }),
    ).toBeVisible();
  });
});
