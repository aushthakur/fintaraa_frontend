import { expect, test, type Page, type Route } from "@playwright/test";

const fulfill = (route: Route, data: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify({ success: status < 400, data }),
  });

const agencyProfile = {
  _id: "dsa-object-id",
  agencyId: "DSA000123",
  referralCode: "RISHABH123",
  name: "Rishabh Partner",
  businessName: "Rishabh Finance",
  mobile: "9876543210",
  email: "partner@fintaraa.test",
  role: "agency",
  status: "active",
  agentProfileCompleted: true,
  profileCompletion: {
    completedFields: 17,
    totalFields: 17,
    completionPercent: 100,
    missingFields: [],
    isComplete: true,
  },
  kycProfile: {
    personalDetails: {
      fullName: "Rishabh Partner",
      mobile: "9876543210",
      email: "partner@fintaraa.test",
    },
  },
};

async function authenticatePartner(page: Page) {
  await page.addInitScript((profile) => {
    localStorage.setItem("authType", "agency");
    localStorage.setItem("agencyToken", "dsa-workspace-token");
    localStorage.setItem("agencyUser", JSON.stringify(profile));
  }, agencyProfile);
}

test("approved DSA can use dashboard, commissions, payout, referral, leaderboard, and training", async ({
  page,
}) => {
  await authenticatePartner(page);
  let payoutRequests: Record<string, unknown>[] = [];

  await page.route("**/backend-api/**", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname.replace(
      /^\/backend-api\/?/,
      "",
    );
    if (pathname.startsWith("dsa/")) {
      expect(request.headers().authorization).toBe(
        "Bearer dsa-workspace-token",
      );
    }

    if (pathname === "agency/current") return fulfill(route, agencyProfile);
    if (pathname === "agency/leads/summary") {
      return fulfill(route, {
        summary: { totalLeads: 12, activePipelineCount: 4 },
        stageCounts: { preLogin: 2, login: 2, sanction: 3, disbursed: 5 },
        loanTypeBreakdown: [],
      });
    }
    if (pathname === "agency/leads/events") return fulfill(route, { result: [] });
    if (pathname === "form-submit-clicks/my/summary") {
      return fulfill(route, { byAction: [], byFormType: [], recentIncomplete: [] });
    }
    if (pathname === "dsa/me") {
      return fulfill(route, {
        ...agencyProfile,
        onboardingStatus: "approved",
        profileCompletion: 100,
        hasPayoutProfile: true,
        payoutProfile: {
          method: "bank_transfer",
          maskedDestination: "••••4321",
          accountHolder: "Rishabh Partner",
          bankName: "Test Bank",
          ifsc: "TEST0001234",
        },
      });
    }
    if (pathname === "dsa/dashboard") {
      return fulfill(route, {
        kpis: {
          totalApplications: 12,
          activeApplications: 4,
          approvedApplications: 8,
          rejectedApplications: 1,
          disbursedApplications: 5,
          totalDisbursedAmount: 2500000,
          projectedCommission: 50000,
          earnedCommission: 35000,
          paidCommission: 10000,
          pendingCommission: 15000,
          availablePayout: payoutRequests.length ? 0 : 25000,
          approvalRate: 66.67,
          conversionRate: 41.67,
        },
        payoutBalances: {
          earnedAmount: 25000,
          paidAmount: 10000,
          pendingRequestedAmount: payoutRequests.length ? 25000 : 0,
          availableToRequest: payoutRequests.length ? 0 : 25000,
        },
        payoutStats: {
          totalRequests: payoutRequests.length,
          pendingRequests: payoutRequests.length,
          approvedRequests: 0,
          paidRequests: 0,
          failedRequests: 0,
        },
      });
    }
    if (pathname === "dsa/commissions") {
      return fulfill(route, {
        items: [
          {
            id: "commission-1",
            applicationId: "FIN-LOAN-1",
            customerName: "Aman Customer",
            loanType: "home_loan",
            disbursedAmount: 1000000,
            commissionAmount: 15000,
            status: "earned",
            createdAt: "2026-07-30T10:00:00.000Z",
          },
        ],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
      });
    }
    if (pathname === "dsa/payouts" && request.method() === "POST") {
      expect(request.postDataJSON()).toEqual({
        amount: 25000,
        method: "bank_transfer",
      });
      const payout = {
        id: "payout-1",
        amount: 25000,
        method: "bank_transfer",
        destinationMasked: "••••4321",
        status: "pending",
        createdAt: "2026-08-01T10:00:00.000Z",
        updatedAt: "2026-08-01T10:00:00.000Z",
      };
      payoutRequests = [payout];
      return fulfill(route, payout, 201);
    }
    if (pathname === "dsa/payouts") {
      return fulfill(route, {
        items: payoutRequests,
        pagination: {
          page: 1,
          limit: 50,
          total: payoutRequests.length,
          totalPages: 1,
        },
      });
    }
    if (pathname === "dsa/referral-link") {
      return fulfill(route, {
        referralCode: "RISHABH123",
        shareUrl: "https://fintaraa.com/apply?dsa=RISHABH123",
        whatsappUrl:
          "https://wa.me/?text=Apply%20with%20RISHABH123",
        smsText: "Apply using my Fintaraa DSA link",
      });
    }
    if (pathname === "dsa/leaderboard") {
      return fulfill(route, {
        period: "month",
        items: [
          {
            rank: 1,
            agencyId: "DSA000123",
            businessName: "Rishabh Finance",
            applications: 12,
            approvalRate: 66.67,
            revenue: 35000,
            isCurrentDsa: true,
          },
        ],
      });
    }
    if (pathname === "dsa/training") {
      return fulfill(route, {
        items: [
          {
            id: "training-1",
            title: "Home Loan Product Guide",
            type: "pdf",
            description: "Eligibility and documentation guide.",
            url: "https://cdn.fintaraa.test/home-loan-guide.pdf",
          },
        ],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
      });
    }

    return fulfill(route, null);
  });

  await page.goto("/partner/profile", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "DSA Workspace" }).click();
  await expect(page.getByTestId("dsa-workspace")).toBeVisible();
  await expect(page.getByText("Applications submitted")).toBeVisible();
  await expect(page.getByText("₹35,000", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Commissions" }).click();
  await expect(page.getByText("Aman Customer")).toBeVisible();
  await expect(page.getByText("FIN-LOAN-1")).toBeVisible();

  await page.getByRole("button", { name: "Referral link" }).click();
  await expect(page.getByText("RISHABH123", { exact: true })).toBeVisible();
  await expect(
    page.locator('input[value*="apply?dsa=RISHABH123"]'),
  ).toBeVisible();

  await page.getByRole("button", { name: "Leaderboard" }).click();
  await expect(page.getByText("Rishabh Finance (You)")).toBeVisible();

  await page.getByRole("button", { name: "Training" }).click();
  await expect(page.getByText("Home Loan Product Guide")).toBeVisible();

  await page.getByRole("button", { name: "Payouts" }).click();
  await page.getByLabel("Payout amount").fill("25000");
  await page.getByRole("button", { name: "Request payout" }).click();
  await expect(
    page.getByText("Payout request submitted for admin approval."),
  ).toBeVisible();
  await expect(page.getByText("₹25,000", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Pending", { exact: true })).toBeVisible();
});

test("pending DSA sees approval gate and protected workspace APIs are not called", async ({
  page,
}) => {
  await authenticatePartner(page);
  const protectedCalls: string[] = [];

  await page.route("**/backend-api/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname.replace(
      /^\/backend-api\/?/,
      "",
    );
    if (pathname === "agency/current") return fulfill(route, agencyProfile);
    if (pathname === "agency/leads/summary") {
      return fulfill(route, { summary: {}, stageCounts: {}, loanTypeBreakdown: [] });
    }
    if (pathname === "agency/leads/events") return fulfill(route, { result: [] });
    if (pathname === "form-submit-clicks/my/summary") return fulfill(route, {});
    if (pathname === "dsa/me") {
      return fulfill(route, {
        ...agencyProfile,
        status: "pending_verification",
        onboardingStatus: "pending",
        profileCompletion: 82,
        hasPayoutProfile: false,
      });
    }
    if (/^dsa\/(dashboard|commissions|payouts|referral-link|leaderboard|training)/.test(pathname)) {
      protectedCalls.push(pathname);
      return fulfill(route, null, 403);
    }
    return fulfill(route, null);
  });

  await page.goto("/partner/profile", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "DSA Workspace" }).click();
  await expect(page.getByText("DSA approval is pending")).toBeVisible();
  await expect(page.getByText("Profile completion: 82%")).toBeVisible();
  expect(protectedCalls).toEqual([]);
});

test("partner changes the login mobile only through authenticated OTP verification", async ({
  page,
}) => {
  await authenticatePartner(page);
  let currentMobile = "9876543210";
  const requests: Array<{ path: string; body: Record<string, unknown> }> = [];

  await page.route("**/backend-api/**", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname.replace(
      /^\/backend-api\/?/,
      "",
    );
    if (pathname === "agency/current") {
      return fulfill(route, { ...agencyProfile, mobile: currentMobile });
    }
    if (pathname === "dsa/mobile-change/send-otp") {
      const body = request.postDataJSON() as Record<string, unknown>;
      requests.push({ path: pathname, body });
      return fulfill(route, { mobile: body.mobile, expiresInSeconds: 300 });
    }
    if (pathname === "dsa/mobile-change/verify-otp") {
      const body = request.postDataJSON() as Record<string, unknown>;
      requests.push({ path: pathname, body });
      currentMobile = String(body.mobile);
      return fulfill(route, {
        ...agencyProfile,
        mobile: currentMobile,
        onboardingStatus: "approved",
      });
    }
    return fulfill(route, null);
  });

  await page.goto("/partner/profile/complete", {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: "Change number with OTP" }).click();
  await page.getByLabel("New mobile number").fill("9123456789");
  await page.getByRole("button", { name: "Send OTP" }).click();
  await expect(page.getByText("OTP sent to the new mobile number.")).toBeVisible();
  await page.getByLabel("Mobile change OTP").fill("123456");
  await page.getByRole("button", { name: "Verify and update" }).click();

  await expect(
    page.getByText("Login mobile number updated and verified successfully."),
  ).toBeVisible();
  await expect(page.locator("#partner-mobile")).toHaveValue("9123456789");
  expect(requests).toEqual([
    {
      path: "dsa/mobile-change/send-otp",
      body: { mobile: "9123456789" },
    },
    {
      path: "dsa/mobile-change/verify-otp",
      body: { mobile: "9123456789", otp: "123456" },
    },
  ]);
});
