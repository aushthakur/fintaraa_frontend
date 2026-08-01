import { expect, test } from "@playwright/test";

test.describe("About company pages", () => {
  test("About Us keeps all five stand-out items in one aligned desktop row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    const response = await page.goto("/about-us", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBeTruthy();

    const heading = page.getByRole("heading", {
      name: "Why Fintaraa stands out.",
      exact: true,
    });
    const section = heading.locator("xpath=ancestor::section[1]");
    const cards = section.locator("article");

    await expect(cards).toHaveCount(5);

    const boxes = await cards.evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return { top: Math.round(box.top), height: Math.round(box.height) };
      }),
    );

    expect(new Set(boxes.map(({ top }) => top)).size).toBe(1);
    expect(new Set(boxes.map(({ height }) => height)).size).toBe(1);
  });

  test("Awards & Recognitions exposes separate awards and certificate content", async ({
    page,
  }) => {
    const response = await page.goto("/awards-and-recognitions", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBeTruthy();

    await expect(
      page.getByRole("navigation", { name: "Awards and certificates" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Awards & recognitions/ }),
    ).toHaveAttribute("href", "#awards");
    await expect(
      page.getByRole("link", { name: /^Certificates/ }),
    ).toHaveAttribute("href", "#certificates");

    const awards = page.getByRole("region", {
      name: "Progress worth recognising",
    });
    const certificates = page.getByRole("region", {
      name: "Certificates & credentials",
    });

    await expect(awards.locator("article")).toHaveCount(3);
    await expect(certificates.locator("article")).toHaveCount(3);
    await expect(certificates).toContainText(
      "Only verified records should appear as certificates.",
    );
  });
});
