import type { Page } from "@playwright/test";
import { expect, test } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";
import { InvitationPage } from "./invitation.page";

const INVITATION_ID = "test-invitation-id";
const ACCOUNT_TITLE = "Acme Corp";

const invitationSummary = {
  account_title: ACCOUNT_TITLE,
  secure_id: INVITATION_ID,
};

const loginMethods = {
  oidc: {
    available: false,
    configurations: [],
  },
  pam: {
    available: false,
    enabled: false,
  },
  password: {
    available: true,
    enabled: true,
  },
  standalone_oidc: {
    available: false,
    enabled: false,
  },
  ubuntu_one: {
    available: false,
    enabled: false,
  },
};

const authStateResponse = {
  accounts: [],
  current_account: "",
  email: "invited.user@example.com",
  has_password: true,
  name: "Invited User",
  token: "test-token",
  return_to: null,
  attach_code: null,
  self_hosted: false,
  identity_source: "local",
  invitation_id: null,
};

const authStateWithAccountsResponse = {
  ...authStateResponse,
  accounts: [
    {
      classic_dashboard_url: "",
      default: true,
      name: "test-account",
      subdomain: null,
      title: ACCOUNT_TITLE,
    },
  ],
  current_account: "test-account",
};

const mockAuthState = async (
  page: Page,
  authorized: boolean,
): Promise<void> => {
  await page.route("**/me", async (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
    }

    if (authorized) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(authStateResponse),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
};

const mockAuthStateWithAccounts = async (page: Page): Promise<void> => {
  await page.route("**/me", async (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(authStateWithAccountsResponse),
    });
  });
};

const mockInvitationSummary = async (
  page: Page,
  status = 200,
): Promise<void> => {
  await page.route("**/invitations/*/summary", async (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
    }

    if (status !== 200) {
      return route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not found" }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(invitationSummary),
    });
  });
};

const mockLoginMethods = async (page: Page): Promise<void> => {
  await page.route("**/login/methods", async (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(loginMethods),
    });
  });
};

const mockAcceptInvitation = async (page: Page): Promise<void> => {
  await page.route("**/accept-invitation", async (route) => {
    if (route.request().method() !== "POST") {
      return route.continue();
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
};

const mockRejectInvitation = async (page: Page): Promise<void> => {
  await page.route("**/reject-invitation", async (route) => {
    if (route.request().method() !== "POST") {
      return route.continue();
    }

    return route.fulfill({
      status: 204,
      body: "",
    });
  });
};

test("shows invitation welcome for unauthenticated users", async ({ page }) => {
  await mockAuthState(page, false);
  await mockInvitationSummary(page);
  await mockLoginMethods(page);

  await navigateTo(page, `/accept-invitation/${INVITATION_ID}`);

  const invitationPage = new InvitationPage(page);

  await expect(invitationPage.heading).toHaveText(
    `You have been invited to ${ACCOUNT_TITLE}`,
  );
  await expect(invitationPage.emailInput).toBeVisible();
  await expect(invitationPage.passwordInput).toBeVisible();
});

test.fail(
  "allows logged-in users with accounts to view invitation (known issue)",
  async ({ page }) => {
    await mockAuthStateWithAccounts(page);
    await mockInvitationSummary(page);
    await mockRejectInvitation(page);

    const invitationSummaryResponse = page.waitForResponse((response) => {
      return (
        response.url().includes("/invitations/") &&
        response.url().includes("/summary") &&
        response.status() === 200
      );
    });
    const authStateResponse = page.waitForResponse((response) => {
      return response.url().endsWith("/me") && response.status() === 200;
    });

    await Promise.all([
      invitationSummaryResponse,
      authStateResponse,
      navigateTo(page, `/accept-invitation/${INVITATION_ID}`),
    ]);

    const invitationPage = new InvitationPage(page);
    await expect(invitationPage.rejectButton).toBeVisible();
  },
);

test("accepts invitation when authorized", async ({ page }) => {
  await mockAuthState(page, true);
  await mockInvitationSummary(page);
  await mockAcceptInvitation(page);

  const invitationSummaryResponse = page.waitForResponse((response) => {
    return (
      response.url().includes("/invitations/") &&
      response.url().includes("/summary") &&
      response.status() === 200
    );
  });
  const authStateResponse = page.waitForResponse((response) => {
    return response.url().endsWith("/me") && response.status() === 200;
  });

  await Promise.all([
    invitationSummaryResponse,
    authStateResponse,
    navigateTo(page, `/accept-invitation/${INVITATION_ID}`),
  ]);

  const invitationPage = new InvitationPage(page);
  await expect(invitationPage.heading).toHaveText(
    `You have been invited as an administrator for ${ACCOUNT_TITLE}`,
  );

  const requestPromise = page.waitForRequest((request) => {
    return (
      request.method() === "POST" && request.url().includes("accept-invitation")
    );
  });

  await Promise.all([requestPromise, invitationPage.acceptButton.click()]);

  const request = await requestPromise;
  expect(request.postDataJSON()).toEqual({ invitation_id: INVITATION_ID });
});

test("shows rejected state after rejecting invitation", async ({ page }) => {
  await mockAuthState(page, true);
  await mockInvitationSummary(page);
  await mockRejectInvitation(page);

  const invitationSummaryResponse = page.waitForResponse((response) => {
    return (
      response.url().includes("/invitations/") &&
      response.url().includes("/summary") &&
      response.status() === 200
    );
  });
  const authStateResponse = page.waitForResponse((response) => {
    return response.url().endsWith("/me") && response.status() === 200;
  });

  await Promise.all([
    invitationSummaryResponse,
    authStateResponse,
    navigateTo(page, `/accept-invitation/${INVITATION_ID}`),
  ]);

  const invitationPage = new InvitationPage(page);
  await expect(invitationPage.rejectButton).toBeVisible();

  const rejectRequest = page.waitForRequest((request) => {
    return (
      request.method() === "POST" && request.url().includes("reject-invitation")
    );
  });

  await Promise.all([rejectRequest, invitationPage.rejectButton.click()]);

  const request = await rejectRequest;
  expect(request.postDataJSON()).toEqual({ invitation_id: INVITATION_ID });

  await expect(invitationPage.heading).toHaveText(
    "You have rejected the invitation",
  );
});

test("shows error when invitation is not found", async ({ page }) => {
  await mockAuthState(page, false);
  await mockInvitationSummary(page, 404);
  await mockLoginMethods(page);

  await navigateTo(page, `/accept-invitation/${INVITATION_ID}`);

  const invitationPage = new InvitationPage(page);
  await expect(invitationPage.heading).toHaveText("Invitation not found");

  await invitationPage.backToLoginButton.click();
  await expect(page).toHaveURL(/\/login/);
});
