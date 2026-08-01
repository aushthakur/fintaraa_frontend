import { expect, test } from "@playwright/test";

const userId = "64b000000000000000000001";
const ticketId = "64b000000000000000000101";
const agentId = "64b000000000000000000201";

test("redirects logged-out visitors to login before rendering support", async ({
  page,
}) => {
  await page.goto("/support", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/login\?referrer=%2Fsupport$/);
  await expect(
    page.getByRole("heading", { name: "One request, one clear conversation" }),
  ).toHaveCount(0);
});

test("creates a canonical support ticket and sends chat text", async ({
  page,
}) => {
  await page.addInitScript(
    ({ storedUserId }) => {
      localStorage.setItem("authType", "user");
      localStorage.setItem("token", "playwright-support-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: storedUserId,
          name: "Support Test User",
          mobile: "9876543210",
        }),
      );
    },
    { storedUserId: userId },
  );

  // Keep layout-level API calls from invalidating the synthetic auth session;
  // support endpoints are registered below and take precedence over this route.
  await page.route("**/backend-api/**", async (route) => {
    await route.fulfill({ status: 200, json: { data: { result: [] } } });
  });

  let sentMessage: Record<string, unknown> | null = null;
  let createdTicket: Record<string, unknown> | null = null;
  const ticket = {
    _id: ticketId,
    title: "Document status help",
    status: "in_progress",
    priority: "medium",
    tags: ["document_verification_support"],
    assigneeId: agentId,
    assigneeName: "Fintaraa Support",
    assignee: {
      _id: agentId,
      name: "Fintaraa Support",
    },
    requester: {
      _id: userId,
      name: "Support Test User",
    },
    createdAt: "2026-07-29T09:00:00.000Z",
    updatedAt: "2026-07-29T09:00:00.000Z",
    interactions: [],
  };

  await page.route("**/support/tickets**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (request.method() === "POST" && path.endsWith("/interactions")) {
      sentMessage = request.postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            ...ticket,
            interactions: [
              {
                initiator: userId,
                receiver: agentId,
                initiatorType: "User",
                receiverType: "Agent",
                action: "commented",
                content: sentMessage.content,
                timestamp: "2026-07-29T09:10:00.000Z",
              },
            ],
          },
        },
      });
      return;
    }

    if (request.method() === "POST") {
      createdTicket = request.postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        json: {
          success: true,
          message: "Ticket generated successfully",
          data: {
            ...ticket,
            _id: "64b000000000000000000102",
            title: createdTicket.title,
            tags: createdTicket.tags,
          },
        },
      });
      return;
    }

    if (path.endsWith(`/${ticketId}`)) {
      await route.fulfill({ status: 200, json: { data: ticket } });
      return;
    }

    await route.fulfill({
      status: 200,
      json: {
        data: {
          result: [ticket],
          pagination: {
            totalItems: 1,
            totalPages: 1,
            currentPage: 1,
            itemsPerPage: 5,
          },
        },
      },
    });
  });

  const response = await page.goto("/support", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBeTruthy();

  const messageBox = page.getByRole("textbox", { name: "Support message" });
  await expect(messageBox).toBeVisible();
  await expect(messageBox).toBeEnabled();
  await messageBox.fill("Please share the current verification status.");
  await messageBox.press("Enter");

  await expect
    .poll(() => sentMessage)
    .toMatchObject({
      ticketId,
      content: "Please share the current verification status.",
      action: "commented",
    });
  expect(sentMessage).not.toHaveProperty("initiator");
  expect(sentMessage).not.toHaveProperty("receiver");
  await expect(
    page.getByText("Please share the current verification status."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Create ticket" }).click();
  await page
    .getByPlaceholder("Example: Need help with document verification")
    .fill("KYC document needs review");
  await page.getByRole("combobox", { name: "Category" }).selectOption({
    label: "Document verification",
  });
  await page
    .getByPlaceholder(
      "Describe the issue, application ID, product, and expected help",
    )
    .fill("My PAN was uploaded yesterday but the status is still pending.");
  await page
    .getByRole("checkbox", {
      name: /I agree that Fintaraa may contact me on WhatsApp/i,
    })
    .check();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Create ticket", exact: true })
    .click();

  await expect
    .poll(() => createdTicket)
    .toMatchObject({
      title: "KYC document needs review",
      tags: ["document_verification_support"],
      formSource: "website_support_ticket",
    });
});
