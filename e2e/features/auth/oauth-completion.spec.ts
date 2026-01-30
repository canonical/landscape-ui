import { expect, test } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

const baseAuthResponse = {
  accounts: [
    {
      classic_dashboard_url: "",
      default: true,
      name: "existing-account",
      subdomain: null,
      title: "Existing Account Inc.",
    },
  ],
  current_account: "existing-account",
  email: "existing-account@example.com",
  has_password: true,
  name: "Existing Account",
  token: "existing-account-token",
  invitation_id: null,
  attach_code: null,
};

test("should fallback to homepage when OIDC return_to is unsafe external", async ({
  page,
}) => {
  await page.route("**/auth/handle-code**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...baseAuthResponse,
        return_to: {
          external: true,
          url: "https://example.com",
        },
      }),
    });
  });

  await navigateTo(page, "/handle-auth/oidc", {
    code: "mock-code",
    state: "mock-state",
  });

  await expect(page).toHaveURL(/overview/);
});

test("should redirect to internal return_to after OIDC completion", async ({
  page,
}) => {
  await page.route("**/auth/handle-code**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...baseAuthResponse,
        return_to: {
          external: false,
          url: "/scripts",
        },
      }),
    });
  });

  await navigateTo(page, "/handle-auth/oidc", {
    code: "mock-code",
    state: "mock-state",
  });

  await expect(page).toHaveURL(/\/scripts/);
});

test("should fallback to homepage when Ubuntu One return_to is unsafe external", async ({
  page,
}) => {
  await page.route("**/auth/ubuntu-one/complete**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...baseAuthResponse,
        return_to: {
          external: true,
          url: "https://example.com",
        },
      }),
    });
  });

  await navigateTo(page, "/handle-auth/ubuntu-one", {
    code: "mock-code",
    state: "mock-state",
  });

  await expect(page).toHaveURL(/overview/);
});

test("should redirect to internal return_to after Ubuntu One completion", async ({
  page,
}) => {
  await page.route("**/auth/ubuntu-one/complete**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...baseAuthResponse,
        return_to: {
          external: false,
          url: "/scripts",
        },
      }),
    });
  });

  await navigateTo(page, "/handle-auth/ubuntu-one", {
    code: "mock-code",
    state: "mock-state",
  });

  await expect(page).toHaveURL(/\/scripts/);
});
