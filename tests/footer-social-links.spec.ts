import { expect, test } from "@playwright/test";

const officialSocialLinks = [
  {
    label: "Follow Fintaraa on Facebook",
    href: "https://www.facebook.com/fintaraa",
  },
  {
    label: "Follow Fintaraa on Instagram",
    href: "https://www.instagram.com/fintaraa/",
  },
  {
    label: "Follow Fintaraa on LinkedIn",
    href: "https://www.linkedin.com/company/fintaraa/",
  },
  {
    label: "Follow Fintaraa on X",
    href: "https://x.com/fintaraa",
  },
] as const;

test("footer links to every verified official Fintaraa social profile", async ({
  page,
}) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const socialNavigation = page.getByRole("navigation", {
    name: "Fintaraa social media",
  });
  await expect(socialNavigation).toBeVisible();

  for (const social of officialSocialLinks) {
    const link = socialNavigation.getByRole("link", { name: social.label });
    await expect(link).toHaveAttribute("href", social.href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link.locator("svg")).toHaveCount(1);
  }
});
