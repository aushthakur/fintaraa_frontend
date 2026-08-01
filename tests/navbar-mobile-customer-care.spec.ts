import { expect, test } from "@playwright/test";
import { CALL_PHONE } from "../src/data/company";

test("mobile top bar shows a tap-to-call customer-care number", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/about-us", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBeTruthy();

  const callLink = page.getByRole("link", {
    name: `Call customer care at ${CALL_PHONE.display}`,
  });

  await expect(callLink).toBeVisible();
  await expect(callLink).toHaveAttribute("href", CALL_PHONE.href);
  await expect(callLink).toContainText(CALL_PHONE.national);
  await expect(
    page.getByText("30+ trusted institutions", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page
      .locator("header")
      .getByRole("link", { name: /customercare@fintaraa\.com|Support/ }),
  ).toBeVisible();
});
