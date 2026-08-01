import { expect, test, type Locator, type Page } from "@playwright/test";

type ServiceType =
  | "gst_registration"
  | "itr_filing"
  | "company_registration"
  | "annual_compliance"
  | "roc_filing"
  | "tax_compliance"
  | "msme_registration"
  | "project_report"
  | "franchise_partner"
  | "dsa_partner";

const serviceRequestUrl = /\/(?:backend-api|api)\/service-requests\/?$/;

async function waitForReactHydration(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactProps$")),
      ),
    )
    .toBe(true);
}

async function mockServiceRequest(page: Page, serviceType: ServiceType) {
  const queryId = `FIN260729${serviceType.length.toString().padStart(4, "0")}`;

  await page.route(serviceRequestUrl, async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Service request created",
        data: {
          _id: `request-${serviceType}`,
          queryId,
          serviceType,
          status: "open",
          currentStage: "Request Submitted",
          currentStageIndex: 0,
          timeline: [
            {
              stage: "Request Submitted",
              status: "active",
              remarks: "Request received",
              updatedBy: "System",
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      }),
    });
  });

  return queryId;
}

async function submitAndReadPayload(
  page: Page,
  submitLabel: string,
  fillForm: (form: ReturnType<Page["locator"]>) => Promise<void>,
) {
  const submitButton = page
    .getByRole("button", { name: submitLabel, exact: true })
    .first();
  const form = submitButton.locator("xpath=ancestor::form");
  await expect(submitButton).toBeEnabled();
  await waitForReactHydration(submitButton);
  await fillForm(form);

  const requestPromise = page.waitForRequest(
    (request) =>
      serviceRequestUrl.test(request.url()) &&
      request.method() === "POST",
  );
  await submitButton.click();
  const request = await requestPromise;
  return request.postDataJSON() as Record<string, unknown>;
}

async function expectQueryIdOnlyInProgress(page: Page, queryId: string) {
  const successCard = page
    .getByText("Request Created Successfully", { exact: true })
    .locator(
      "xpath=ancestor::div[contains(concat(' ', normalize-space(@class), ' '), ' overflow-hidden ')][1]",
    );

  await expect(successCard).toBeVisible();
  await expect(successCard.getByText(queryId, { exact: true })).toHaveCount(0);
  await expect(
    page.getByText(`Query ID: ${queryId}`, { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.locator(`[data-service-query-id="${queryId}"]`),
  ).toHaveCount(1);
}

test.describe("financial service inquiry submissions", () => {
  test("ITR API errors remain visible for five seconds", async ({ page }) => {
    await page.route(serviceRequestUrl, async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 500,
        json: { message: "Unable to create service request." },
      });
    });
    await page.goto("/itr-filing", { waitUntil: "domcontentloaded" });

    await submitAndReadPayload(page, "Submit Inquiry", async (form) => {
      await form.getByLabel("Name", { exact: true }).fill("Rishabh Gupta");
      await form
        .getByLabel("Mobile Number", { exact: true })
        .fill("9876543210");
      await form.locator("select").nth(0).selectOption({ index: 1 });
      await form.locator("select").nth(1).selectOption({ index: 1 });
      await form.getByRole("checkbox").check();
    });

    const form = page
      .getByRole("button", { name: "Submit Inquiry", exact: true })
      .first()
      .locator("xpath=ancestor::form");
    const apiError = form.getByRole("alert");
    await expect(apiError).toContainText("Unable to create service request.");
    await page.waitForTimeout(4_500);
    await expect(apiError).toBeVisible();
    await page.waitForTimeout(700);
    await expect(apiError).toHaveCount(0);
  });

  test("ITR Filing submits and shows its generated query ID", async ({
    page,
  }) => {
    const queryId = await mockServiceRequest(page, "itr_filing");
    await page.goto("/itr-filing", { waitUntil: "domcontentloaded" });

    const submitButton = page
      .getByRole("button", { name: "Submit Inquiry", exact: true })
      .first();
    await expect(submitButton).toBeEnabled();
    await waitForReactHydration(submitButton);
    await submitButton
      .locator("xpath=ancestor::form")
      .evaluate((form: HTMLFormElement) => form.requestSubmit());
    const validationError = page.getByText("Enter a valid full name.", {
      exact: true,
    });
    await expect(validationError).toBeVisible();
    await page.waitForTimeout(5_100);
    await expect(validationError).toHaveCount(0);

    const payload = await submitAndReadPayload(
      page,
      "Submit Inquiry",
      async (form) => {
        await form.getByLabel("Name", { exact: true }).fill("Rishabh Gupta");
        await form
          .getByLabel("Mobile Number", { exact: true })
          .fill("9876543210");
        await form.locator("select").nth(0).selectOption({ index: 1 });
        await form.locator("select").nth(1).selectOption({ index: 1 });
        await form.getByRole("checkbox").check();
      },
    );

    expect(payload.serviceType).toBe("itr_filing");
    expect(payload.whatsappConsent).toBe(true);
    await expectQueryIdOnlyInProgress(page, queryId);
    await page.waitForTimeout(5_100);
    await expect(
      page.getByText("Request Created Successfully", { exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByText(`Query ID: ${queryId}`, { exact: true }).first(),
    ).toBeVisible();
  });

  test("GST registration submits and shows its generated query ID", async ({
    page,
  }) => {
    const queryId = await mockServiceRequest(page, "gst_registration");
    await page.goto("/gst-registration", { waitUntil: "domcontentloaded" });

    const payload = await submitAndReadPayload(
      page,
      "Submit Inquiry",
      async (form) => {
        await form
          .getByLabel("Business Name", { exact: true })
          .fill("Fintaraa Test Business");
        await form
          .getByLabel("Mobile Number", { exact: true })
          .fill("9876543210");
        for (const select of await form.getByRole("combobox").all()) {
          await select.selectOption({ index: 1 });
        }
        await form.getByRole("checkbox").check();
      },
    );

    expect(payload.serviceType).toBe("gst_registration");
    expect(payload.whatsappConsent).toBe(true);
    await expectQueryIdOnlyInProgress(page, queryId);
  });

  const businessForms: Array<{
    path: string;
    serviceType: ServiceType;
    submitLabel: string;
  }> = [
    {
      path: "/company-registration",
      serviceType: "company_registration",
      submitLabel: "Start Company Registration",
    },
    {
      path: "/annual-compliance",
      serviceType: "annual_compliance",
      submitLabel: "Request Compliance Support",
    },
    {
      path: "/roc-filing",
      serviceType: "roc_filing",
      submitLabel: "Request ROC Filing Support",
    },
    {
      path: "/tax-compliance",
      serviceType: "tax_compliance",
      submitLabel: "Request Tax Support",
    },
    {
      path: "/msme-registration",
      serviceType: "msme_registration",
      submitLabel: "Start MSME Registration",
    },
    {
      path: "/project-report",
      serviceType: "project_report",
      submitLabel: "Request Project Report",
    },
  ];

  for (const config of businessForms) {
    test(`${config.path} submits to the service-request backend`, async ({
      page,
    }) => {
      const queryId = await mockServiceRequest(page, config.serviceType);
      await page.goto(config.path, { waitUntil: "domcontentloaded" });

      const payload = await submitAndReadPayload(
        page,
        config.submitLabel,
        async (form) => {
          await form
            .getByLabel("Full Name", { exact: true })
            .fill("Rishabh Gupta");
          await form
            .getByLabel("Mobile Number", { exact: true })
            .fill("9876543210");
          await form
            .getByLabel("Email Address", { exact: true })
            .fill("rishabh@example.com");
          for (const select of await form.getByRole("combobox").all()) {
            await select.selectOption({ index: 1 });
          }
          await form.getByRole("checkbox").check();
        },
      );

      expect(payload.serviceType).toBe(config.serviceType);
      expect(payload.whatsappConsent).toBe(true);
      await expectQueryIdOnlyInProgress(page, queryId);
    });
  }

  const partnerForms: Array<{
    path: string;
    serviceType: ServiceType;
    submitLabel: string;
  }> = [
    {
      path: "/franchise",
      serviceType: "franchise_partner",
      submitLabel: "Apply For Franchise",
    },
    {
      path: "/become-dsa",
      serviceType: "dsa_partner",
      submitLabel: "Become a Partner",
    },
  ];

  for (const config of partnerForms) {
    test(`${config.path} submits to the service-request backend`, async ({
      page,
    }) => {
      const queryId = await mockServiceRequest(page, config.serviceType);
      await page.goto(config.path, { waitUntil: "domcontentloaded" });

      const payload = await submitAndReadPayload(
        page,
        config.submitLabel,
        async (form) => {
          await form
            .getByLabel("Full Name", { exact: true })
            .fill("Rishabh Gupta");
          await form
            .getByLabel("Mobile Number", { exact: true })
            .fill("9876543210");
          await form
            .getByLabel("Email Address", { exact: true })
            .fill("rishabh@example.com");
          await form.getByLabel("City", { exact: true }).fill("Delhi");
          for (const select of await form.getByRole("combobox").all()) {
            await select.selectOption({ index: 1 });
          }
          await form.getByRole("checkbox").check();
        },
      );

      expect(payload.serviceType).toBe(config.serviceType);
      expect(payload.source).toBe("website");
      expect(payload.platform).toBe("website");
      expect(payload.formSource).toBe(
        config.serviceType === "franchise_partner"
          ? "website_franchise_page"
          : "website_dsa_page",
      );
      expect(payload.whatsappConsent).toBe(true);
      if (config.serviceType === "dsa_partner") {
        const details = payload.details as Record<string, unknown>;
        expect(details.monthlyLoanAmount).toBe("Up to ₹10 lakh");
        expect(details["Monthly Loan Amount"]).toBe("Up to ₹10 lakh");
        expect(details).not.toHaveProperty("Monthly Lead Volume");
      }
      await expectQueryIdOnlyInProgress(page, queryId);
    });
  }
});
