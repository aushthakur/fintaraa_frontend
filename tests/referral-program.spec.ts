import {
  expect,
  test,
  type Locator,
  type Page,
  type Route,
} from "@playwright/test";

test.describe.configure({ mode: "serial" });

const referralVisitUrl = /\/backend-api\/referrals\/track-visit\/?$/;
const sendOtpUrl = /\/backend-api\/user\/send-otp\/?$/;
const verifyOtpUrl = /\/backend-api\/user\/verify-otp\/?$/;
const referralSummaryUrl = /\/backend-api\/referrals\/summary\/?$/;
const referralHistoryUrl = /\/backend-api\/referrals\/history\/?$/;
const referralWalletUrl = /\/backend-api\/referrals\/wallet\/?$/;
const referralPayoutRequestsUrl =
  /\/backend-api\/referrals\/payout-requests\/?(?:\?.*)?$/;

type MockReferralWallet = {
  lifetimeCredited: number;
  reservedAmount: number;
  paidAmount: number;
  availableAmount: number;
  minimumPayoutAmount: number;
  canRequestPayout: boolean;
};

type MockPayoutRequest = {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  paidAt?: string;
  updatedAt?: string;
  adminReference?: string;
  adminNote?: string;
};

const defaultWallet: MockReferralWallet = {
  lifetimeCredited: 1500,
  reservedAmount: 0,
  paidAmount: 500,
  availableAmount: 1000,
  minimumPayoutAmount: 500,
  canRequestPayout: true,
};

const testUser = {
  _id: "referral-dashboard-user",
  id: "referral-dashboard-user",
  customerId: "FIN-REFERRAL-TEST",
  name: "Referral Test User",
  email: "referral-test@fintaraa.test",
  mobile: "9876543210",
  panCard: "ABCDE1234F",
  role: "user",
  status: "active",
  isMobileVerified: true,
};

const fulfillJson = (route: Route, payload: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify(payload),
  });

const referralStorage = () => ({
  sessionCode: sessionStorage.getItem("fintaraa_referral_code"),
  sessionVisitor: sessionStorage.getItem("fintaraa_referral_visitor_id"),
  persistentCode: localStorage.getItem("fintaraa_referral_code"),
  persistentVisitor: localStorage.getItem("fintaraa_referral_visitor_id"),
});

async function waitForReactHydration(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactProps$")),
      ),
    )
    .toBe(true);
}

async function mockReferralVisit(page: Page) {
  await mockLayoutApis(page);
  await page.route(referralVisitUrl, async (route) => {
    await fulfillJson(route, { success: true, data: null });
  });
}

async function mockLayoutApis(page: Page) {
  await page.route("**/backend-api/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname.replace(
      /^\/backend-api\/?/,
      "",
    );

    if (pathname === "user/get-current") {
      await fulfillJson(route, { success: true, data: testUser });
      return;
    }
    if (pathname === "user/notifications-stats") {
      await fulfillJson(route, {
        success: true,
        data: { read: 0, unread: 0, deleted: 0, total: 0 },
      });
      return;
    }
    if (
      pathname === "loan-pages/public" ||
      pathname === "insurance-pages/public" ||
      pathname === "popups/public"
    ) {
      await fulfillJson(route, { success: true, data: [] });
      return;
    }
    if (pathname === "seo-metadata/resolve") {
      await fulfillJson(route, { success: true, data: null });
      return;
    }

    await fulfillJson(route, { success: true, data: null });
  });
}

async function mockOtpFlow(page: Page, accountExisted: boolean) {
  await page.route(sendOtpUrl, async (route) => {
    await fulfillJson(route, {
      success: true,
      existed: accountExisted,
      expiresInSeconds: 300,
    });
  });

  await page.route(verifyOtpUrl, async (route) => {
    await fulfillJson(route, {
      success: true,
      token: "referral-test-token",
      accountExisted,
      needsProfileCompletion: !accountExisted,
      user: accountExisted
        ? {
            ...testUser,
            _id: "existing-user",
            id: "existing-user",
            name: "Existing User",
          }
        : {
            _id: "new-user",
            name: "User 3210",
            mobile: "9876543210",
          },
    });
  });
}

async function submitPhoneAndOtp(page: Page) {
  const submitButton = page.getByRole("button", {
    name: "Get OTP",
    exact: true,
  });
  await waitForReactHydration(submitButton);
  await page.getByLabel("Mobile number").fill("9876543210");
  await submitButton.click();
  await expect(page.getByRole("heading", { name: "Verify OTP" })).toBeVisible();
  await page.getByLabel("OTP code").fill("123456");
}

async function mockReferralDashboard(
  page: Page,
  summary: Record<string, unknown>,
  history: Record<string, unknown>[] = [],
  options: {
    wallet?: MockReferralWallet;
    payoutRequests?: MockPayoutRequest[];
    walletUnavailable?: boolean;
  } = {},
) {
  let wallet = { ...(options.wallet || defaultWallet) };
  let payoutRequests = [...(options.payoutRequests || [])];
  await page.addInitScript((user) => {
    localStorage.setItem("authType", "user");
    localStorage.setItem("token", "referral-dashboard-token");
    localStorage.setItem("user", JSON.stringify(user));
  }, testUser);
  await mockLayoutApis(page);
  await page.route(referralSummaryUrl, async (route) => {
    await fulfillJson(route, { success: true, data: summary });
  });
  await page.route(referralHistoryUrl, async (route) => {
    await fulfillJson(route, { success: true, data: history });
  });
  await page.route(referralWalletUrl, async (route) => {
    if (options.walletUnavailable) {
      await fulfillJson(
        route,
        { success: false, message: "Referral wallet unavailable" },
        503,
      );
      return;
    }
    await fulfillJson(route, { success: true, data: wallet });
  });
  await page.route(referralPayoutRequestsUrl, async (route) => {
    if (route.request().method() === "POST") {
      const { amount } = route.request().postDataJSON() as { amount: number };
      const request: MockPayoutRequest = {
        id: `payout-${payoutRequests.length + 1}`,
        amount,
        status: "pending",
        createdAt: "2026-08-01T12:00:00.000Z",
        updatedAt: "2026-08-01T12:00:00.000Z",
      };
      payoutRequests = [request, ...payoutRequests];
      wallet = {
        ...wallet,
        reservedAmount: wallet.reservedAmount + amount,
        availableAmount: wallet.availableAmount - amount,
        canRequestPayout: false,
      };
      await fulfillJson(route, { success: true, data: request }, 201);
      return;
    }
    await fulfillJson(route, {
      success: true,
      data: {
        result: payoutRequests,
        pagination: {
          totalItems: payoutRequests.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 20,
        },
      },
    });
  });
}

test.describe("referral signup attribution", () => {
  test("tracks a landing but does not persist an abandoned code beyond its referral URL", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("fintaraa_referral_code", "STALE-CODE");
      localStorage.setItem("fintaraa_referral_visitor_id", "stale-visitor");
    });
    await mockReferralVisit(page);

    const visitPromise = page.waitForRequest(referralVisitUrl);
    await page.goto("/login?ref=friend500", { waitUntil: "domcontentloaded" });
    const visit = await visitPromise;
    const visitPayload = visit.postDataJSON() as Record<string, unknown>;

    expect(visitPayload.referralCode).toBe("FRIEND500");
    expect(visitPayload.visitorId).toEqual(expect.any(String));
    expect(visitPayload.landingPath).toBe("/login?ref=friend500");
    await expect
      .poll(() => page.evaluate(referralStorage))
      .toEqual({
        sessionCode: "FRIEND500",
        sessionVisitor: visitPayload.visitorId,
        persistentCode: null,
        persistentVisitor: null,
      });

    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect
      .poll(() => page.evaluate(referralStorage))
      .toEqual({
        sessionCode: null,
        sessionVisitor: null,
        persistentCode: null,
        persistentVisitor: null,
      });
  });

  test("sends referral attribution only for an explicitly new account and clears it after OTP", async ({
    page,
  }) => {
    await mockReferralVisit(page);
    await mockOtpFlow(page, false);

    await page.goto("/login?ref=newfriend", { waitUntil: "domcontentloaded" });
    await submitPhoneAndOtp(page);
    const storedBeforeOtp = await page.evaluate(referralStorage);

    const verifyPromise = page.waitForRequest(verifyOtpUrl);
    await page
      .getByRole("button", { name: "Verify & setup account", exact: true })
      .click();
    const verifyPayload = (await verifyPromise).postDataJSON() as Record<
      string,
      unknown
    >;

    expect(verifyPayload.referralCode).toBe("NEWFRIEND");
    expect(verifyPayload.referralVisitorId).toBe(
      storedBeforeOtp.sessionVisitor,
    );
    await expect(
      page.getByRole("heading", { name: "Verify details" }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(referralStorage))
      .toEqual({
        sessionCode: null,
        sessionVisitor: null,
        persistentCode: null,
        persistentVisitor: null,
      });
  });

  test("never sends referral attribution for an existing account", async ({
    page,
  }) => {
    await mockReferralVisit(page);
    await mockOtpFlow(page, true);

    await page.goto("/login?ref=not-for-existing", {
      waitUntil: "domcontentloaded",
    });
    await submitPhoneAndOtp(page);

    const verifyPromise = page.waitForRequest(verifyOtpUrl);
    await page
      .getByRole("button", { name: "Verify & continue", exact: true })
      .click();
    const verifyPayload = (await verifyPromise).postDataJSON() as Record<
      string,
      unknown
    >;

    expect(verifyPayload.referralCode).toBeUndefined();
    expect(verifyPayload.referralVisitorId).toBeUndefined();
    await expect
      .poll(() => page.evaluate(referralStorage))
      .toEqual({
        sessionCode: null,
        sessionVisitor: null,
        persistentCode: null,
        persistentVisitor: null,
      });
  });

  test("tracks an authenticated referral landing without retaining signup attribution", async ({
    page,
  }) => {
    await page.addInitScript((user) => {
      if (location.pathname !== "/login") return;
      localStorage.setItem("authType", "user");
      localStorage.setItem("token", "existing-session-token");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("fintaraa_referral_code", "OLD-LOCAL");
      localStorage.setItem("fintaraa_referral_visitor_id", "old-local-visitor");
      sessionStorage.setItem("fintaraa_referral_code", "OLD-SESSION");
      sessionStorage.setItem(
        "fintaraa_referral_visitor_id",
        "old-session-visitor",
      );
    }, testUser);
    await mockReferralVisit(page);

    const visitPromise = page.waitForRequest(referralVisitUrl);
    await page.goto("/login?ref=analytics-only", {
      waitUntil: "domcontentloaded",
    });
    const visitPayload = (await visitPromise).postDataJSON() as Record<
      string,
      unknown
    >;

    expect(visitPayload.referralCode).toBe("ANALYTICS-ONLY");
    await expect
      .poll(() => new URL(page.url()).pathname)
      .not.toBe("/login");
    await expect
      .poll(() => page.evaluate(referralStorage))
      .toEqual({
        sessionCode: null,
        sessionVisitor: null,
        persistentCode: null,
        persistentVisitor: null,
      });
  });
});

test.describe("refer and earn page", () => {
  test("shows configured reward, minimum condition, lifecycle history, and share actions", async ({
    page,
  }) => {
    await mockReferralDashboard(
      page,
      {
        referralCode: "REFER750",
        rewardAmount: 750,
        minimumDisbursementAmount: 100000,
        programActive: true,
      },
      [
        {
          id: "referral-1",
          referredUser: { name: "Referred Friend" },
          createdAt: "2026-07-01T00:00:00.000Z",
          registeredAt: "2026-07-02T00:00:00.000Z",
          appliedAt: "2026-07-03T00:00:00.000Z",
          approvedAt: "2026-07-04T00:00:00.000Z",
          paidAt: "2026-07-05T00:00:00.000Z",
          rewardAmount: 750,
        },
      ],
    );

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByText(
        "Refer a friend, earn ₹750 when their loan is disbursed",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Minimum eligible loan disbursement: ₹1,00,000", {
        exact: true,
      }),
    ).toBeVisible();
    for (const heading of [
      "Referred",
      "Registered",
      "Applied",
      "Approved",
      "Reward Paid",
    ]) {
      await expect(
        page.getByRole("columnheader", { name: heading, exact: true }),
      ).toBeVisible();
    }
    await expect(page.getByText("Referred Friend", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "WhatsApp", exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "SMS", exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Copy Link", exact: true }),
    ).toBeEnabled();
  });

  test("removes reward promises and disables sharing while the program is paused", async ({
    page,
  }) => {
    await mockReferralDashboard(page, {
      referralCode: "PAUSED500",
      rewardAmount: 500,
      minimumDisbursementAmount: 50000,
      programActive: false,
    });

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Referral rewards currently paused" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "New referral sharing and reward eligibility are temporarily unavailable.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText(/Refer a friend, earn ₹500 when their loan is disbursed/),
    ).toHaveCount(0);
    for (const name of ["WhatsApp", "SMS", "Copy Link"]) {
      await expect(
        page.getByRole("button", { name, exact: true }),
      ).toBeDisabled();
    }
    const copyButtons = page.getByRole("button", { name: "Copy", exact: true });
    await expect(copyButtons).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(copyButtons.nth(index)).toBeDisabled();
    }
    await expect(
      page.getByRole("button", { name: "Share Now", exact: true }),
    ).toBeDisabled();
    const withdrawalAmount = page.getByLabel("Withdrawal amount", {
      exact: true,
    });
    await expect(withdrawalAmount).toBeEnabled();
    await withdrawalAmount.fill("500");
    await expect(
      page.getByRole("button", { name: "Request withdrawal", exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByText(
        "The referral program is paused, but rewards already credited to your available wallet can still be requested for payout.",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("validates and creates a manual wallet withdrawal request", async ({
    page,
  }) => {
    await mockReferralDashboard(page, {
      referralCode: "WALLET500",
      rewardAmount: 500,
      minimumDisbursementAmount: 0,
      programActive: true,
    });

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });
    const wallet = page.locator("[data-referral-wallet]");
    await expect(
      wallet.locator('[data-wallet-metric="Lifetime credited"]'),
    ).toContainText("₹1,500");
    await expect(
      wallet.locator('[data-wallet-metric="Available wallet"]'),
    ).toContainText("₹1,000");
    await expect(
      wallet.getByText(
        "Withdrawal requests are reviewed and paid manually by the Fintaraa admin team. Submitting a request does not trigger an automatic transfer.",
        { exact: true },
      ),
    ).toBeVisible();

    const amountInput = wallet.getByLabel("Withdrawal amount", {
      exact: true,
    });
    const submit = wallet.getByRole("button", {
      name: "Request withdrawal",
      exact: true,
    });
    await amountInput.fill("499");
    await expect(
      wallet.getByText("Minimum withdrawal request is ₹500.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(submit).toBeDisabled();

    await amountInput.fill("500.001");
    await expect(
      wallet.getByText(
        "Withdrawal amount can have at most two decimal places.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(submit).toBeDisabled();

    await amountInput.fill("1001");
    await expect(
      wallet.getByText(
        "Amount cannot exceed your available wallet balance of ₹1,000.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(submit).toBeDisabled();

    await amountInput.fill("600");
    await expect(submit).toBeEnabled();
    const requestPromise = page.waitForRequest(
      (request) =>
        referralPayoutRequestsUrl.test(request.url()) &&
        request.method() === "POST",
    );
    await submit.click();
    expect((await requestPromise).postDataJSON()).toEqual({ amount: 600 });

    await expect(
      wallet.getByText(
        "Withdrawal request submitted for manual admin review.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      wallet.locator('[data-wallet-metric="Reserved / pending"]'),
    ).toContainText("₹600");
    await expect(
      wallet.locator('[data-wallet-metric="Available wallet"]'),
    ).toContainText("₹400");
    const pendingRequest = wallet.locator(
      '[data-payout-request="payout-1"]',
    );
    await expect(pendingRequest).toContainText("₹600");
    await expect(pendingRequest).toContainText("Pending");
    await expect(submit).toBeDisabled();
  });

  test("shows approved, rejected, and paid request details and blocks a second active request", async ({
    page,
  }) => {
    await mockReferralDashboard(
      page,
      {
        referralCode: "STATUS500",
        rewardAmount: 500,
        minimumDisbursementAmount: 0,
        programActive: true,
      },
      [],
      {
        wallet: {
          lifetimeCredited: 2500,
          reservedAmount: 500,
          paidAmount: 1000,
          availableAmount: 1000,
          minimumPayoutAmount: 500,
          canRequestPayout: false,
        },
        payoutRequests: [
          {
            id: "approved-request",
            amount: 500,
            status: "approved",
            createdAt: "2026-07-10T12:00:00.000Z",
            approvedAt: "2026-07-11T12:00:00.000Z",
            updatedAt: "2026-07-11T12:00:00.000Z",
            adminReference: "APP-500",
            adminNote: "Approved for manual payment",
          },
          {
            id: "rejected-request",
            amount: 600,
            status: "rejected",
            createdAt: "2026-06-10T12:00:00.000Z",
            rejectedAt: "2026-06-11T12:00:00.000Z",
            updatedAt: "2026-06-11T12:00:00.000Z",
            adminNote: "Bank details need review",
          },
          {
            id: "paid-request",
            amount: 1000,
            status: "paid",
            createdAt: "2026-05-10T12:00:00.000Z",
            paidAt: "2026-05-12T12:00:00.000Z",
            updatedAt: "2026-05-12T12:00:00.000Z",
            adminReference: "UTR123456",
            adminNote: "Paid manually",
          },
        ],
      },
    );

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });
    const wallet = page.locator("[data-referral-wallet]");
    for (const [id, status] of [
      ["approved-request", "Approved"],
      ["rejected-request", "Rejected"],
      ["paid-request", "Paid"],
    ]) {
      await expect(
        wallet.locator(`[data-payout-request="${id}"]`),
      ).toContainText(status);
    }
    await expect(
      wallet.locator('[data-payout-request="approved-request"]'),
    ).toContainText("APP-500");
    await expect(
      wallet.locator('[data-payout-request="rejected-request"]'),
    ).toContainText("Bank details need review");
    await expect(
      wallet.locator('[data-payout-request="paid-request"]'),
    ).toContainText("UTR123456");
    await expect(
      wallet.getByText("You already have an active approved request for ₹500.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      wallet.getByRole("button", {
        name: "Request withdrawal",
        exact: true,
      }),
    ).toBeDisabled();
  });

  test("enforces the ten crore payout ceiling even when wallet balance is higher", async ({
    page,
  }) => {
    await mockReferralDashboard(
      page,
      {
        referralCode: "HIGHBALANCE",
        rewardAmount: 500,
        minimumDisbursementAmount: 0,
        programActive: true,
      },
      [],
      {
        wallet: {
          lifetimeCredited: 150_000_000,
          reservedAmount: 0,
          paidAmount: 0,
          availableAmount: 150_000_000,
          minimumPayoutAmount: 500,
          canRequestPayout: true,
        },
      },
    );

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });
    const wallet = page.locator("[data-referral-wallet]");
    const amountInput = wallet.getByLabel("Withdrawal amount", {
      exact: true,
    });
    const submit = wallet.getByRole("button", {
      name: "Request withdrawal",
      exact: true,
    });

    await expect(amountInput).toHaveAttribute("max", "100000000");
    await amountInput.fill("100000000.01");
    await expect(
      wallet.getByText("Maximum withdrawal request is ₹10,00,00,000.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(submit).toBeDisabled();

    await amountInput.fill("100000000");
    await expect(submit).toBeEnabled();
  });

  test("disables withdrawal controls when the wallet API is unavailable", async ({
    page,
  }) => {
    await mockReferralDashboard(
      page,
      {
        referralCode: "NOWALLET",
        rewardAmount: 500,
        minimumDisbursementAmount: 0,
        programActive: true,
      },
      [],
      { walletUnavailable: true },
    );

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });
    const wallet = page.locator("[data-referral-wallet]");
    await expect(
      wallet.getByText(
        "Referral withdrawals are temporarily unavailable. Please try again later.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      wallet.getByLabel("Withdrawal amount", { exact: true }),
    ).toBeDisabled();
    await expect(
      wallet.getByRole("button", {
        name: "Request withdrawal",
        exact: true,
      }),
    ).toBeDisabled();
  });

  test("does not promise a fallback reward when current terms fail to load", async ({
    page,
  }) => {
    await page.addInitScript((user) => {
      localStorage.setItem("authType", "user");
      localStorage.setItem("token", "referral-dashboard-token");
      localStorage.setItem("user", JSON.stringify(user));
    }, testUser);
    await mockLayoutApis(page);
    await page.route(referralSummaryUrl, async (route) => {
      await fulfillJson(
        route,
        { success: false, message: "Referral terms unavailable" },
        503,
      );
    });
    await page.route(referralHistoryUrl, async (route) => {
      await fulfillJson(route, { success: true, data: [] });
    });

    await page.goto("/refer-and-earn", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        name: "Referral details temporarily unavailable",
      }),
    ).toBeVisible();
    await expect(page.getByText(/Refer a friend, earn ₹500/)).toHaveCount(0);
    await expect(
      page.getByText(
        "Current referral reward terms could not be loaded. Please try again shortly.",
        { exact: true },
      ),
    ).toBeVisible();
  });
});
