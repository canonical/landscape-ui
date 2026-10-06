import { expect, test } from "../../support/fixtures/auth";
import { USER } from "../../support/constants";
import { login } from "../../support/helpers/auth";
import {
  navigateTo,
  navigateToSidebarLink,
} from "../../support/helpers/navigation";
import { SuperAdminPage } from "./super-admin.page";

test.describe("non-staff users", () => {
  test("have no entry and are sent back from super admin mode", async ({
    authenticatedPage: page,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await expect(superAdmin.entryLink).toHaveCount(0);

    await navigateTo(page, "/super-admin/accounts");

    await expect(page).toHaveURL(/\/overview/);
    await expect(superAdmin.navigation).toHaveCount(0);
  });
});

// Super admin mode is a SaaS tool. Self-hosted deployments never grant the
// staff roles, and the UI ignores them there anyway.
test.describe("@self-hosted", () => {
  test("ignores global roles on a self-hosted deployment", async ({
    staffPage: page,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
    await expect(superAdmin.entryLink).toHaveCount(0);

    await navigateTo(page, "/super-admin/accounts");

    await expect(page).toHaveURL(/\/overview/);
    await expect(superAdmin.navigation).toHaveCount(0);
  });
});

test.describe("@saas Canonical staff", () => {
  test("enter super admin mode from the sidebar and return to where they left", async ({
    staffPage: page,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await navigateToSidebarLink(page, "Activities");
    await expect(page).toHaveURL(/\/activities/);

    await superAdmin.entryLink.click();

    await expect(page).toHaveURL(/\/super-admin\/accounts$/);
    await expect(superAdmin.navigation).toBeVisible();
    await expect(
      superAdmin.navigation.getByRole("link", { name: "Accounts" }),
    ).toBeVisible();
    await expect(
      superAdmin.navigation.getByRole("link", { name: "People" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Accounts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Activities" })).toHaveCount(0);

    await page.getByRole("link", { name: "Back to main view" }).click();

    await expect(page).toHaveURL(/\/activities/);
    await expect(superAdmin.entryLink).toBeVisible();
  });

  test("browse the accounts and open one", async ({ staffPage: page }) => {
    const superAdmin = new SuperAdminPage(page);

    await superAdmin.goToAccounts();

    await expect(superAdmin.accountRows).toHaveCount(6);
    await expect(
      superAdmin.accountRow("initech").getByLabel("status"),
    ).toHaveText("Disabled");

    await superAdmin.search("glob");

    await expect(page).toHaveURL(/search=glob/);
    await expect(superAdmin.accountRows).toHaveCount(1);
    await expect(superAdmin.accountRow("globex")).toBeVisible();

    await superAdmin
      .accountRow("globex")
      .getByRole("link", { name: "globex" })
      .click();

    await expect(page).toHaveURL(/\/super-admin\/accounts\/globex/);
    await expect(
      page.getByRole("heading", { name: "Globex Corporation" }),
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Info" })).toBeVisible();
  });

  test("toggle a feature and find it kept after a reload", async ({
    staffPage: page,
    staffApi,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await superAdmin.goToAccount("acme");
    await page.getByRole("tab", { name: "Features" }).click();

    const featureSwitch = page.getByRole("switch").first();
    await expect(featureSwitch).toBeEnabled();

    const featureName = await featureSwitch.getAttribute("aria-label");
    const wasEnabled = await featureSwitch.isChecked();

    // The slider sits over the input: its label takes the click.
    await featureSwitch.locator("..").click();

    const confirmation = page.getByRole("dialog");
    await expect(confirmation).toContainText(featureName ?? "");
    await confirmation
      .getByRole("button", { name: wasEnabled ? "Disable" : "Enable" })
      .click();

    await expect(confirmation).toHaveCount(0);
    await expect(featureSwitch).toBeChecked({ checked: !wasEnabled });
    expect(staffApi.patches).toHaveLength(1);

    await page.reload();

    const reloadedSwitch = page.getByRole("switch", {
      name: featureName ?? "",
    });
    await expect(reloadedSwitch).toBeChecked({ checked: !wasEnabled });
  });

  test("edit an account and find the change kept after a reload", async ({
    staffPage: page,
    staffApi,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await superAdmin.goToAccount("globex");
    await page.getByRole("button", { name: "Edit" }).click();

    const form = page.getByRole("complementary");
    await form.getByLabel("Subdomain").fill("globex-support");
    await form.getByRole("button", { name: "Save changes" }).click();

    const confirmation = page.getByRole("dialog");
    await expect(confirmation).toContainText("Subdomain");
    await confirmation.getByRole("button", { name: "Save changes" }).click();

    await expect(confirmation).toHaveCount(0);
    expect(staffApi.patches).toEqual([{ subdomain: "globex-support" }]);
    await expect(page.getByText("globex-support")).toBeVisible();

    await page.reload();

    await expect(page.getByText("globex-support")).toBeVisible();
  });

  test("enter an account in a support session and exit back to its page", async ({
    staffPage: page,
    staffApi,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await superAdmin.goToAccounts();
    await superAdmin.openRowActions("acme");
    await page.getByRole("menuitem", { name: "Enter acme" }).click();

    await expect(page).toHaveURL(
      /\/super-admin\/accounts\/acme\/session\/events-log/,
    );
    expect(staffApi.switches).toEqual(["acme"]);

    await expect(superAdmin.supportSession).toContainText("ACME Corp");
    await expect(page.getByText("Organization")).toBeVisible();
    await expect(page.getByText("ACME Corp").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Events log" }),
    ).toBeVisible();
    await expect(superAdmin.navigation).toHaveCount(0);

    await page.getByRole("button", { name: "Profiles" }).click();
    await page.getByRole("link", { name: "Repository profiles" }).click();

    await expect(page).toHaveURL(/\/session\/profiles\/repository/);
    await expect(superAdmin.supportSession).toBeVisible();

    await page.reload();

    await expect(superAdmin.supportSession).toContainText("ACME Corp");
    await expect(page).toHaveURL(/\/session\/profiles\/repository/);

    await superAdmin.supportSession
      .getByRole("button", { name: "Exit to super admin" })
      .click();

    await expect(page).toHaveURL(/\/super-admin\/accounts\/acme$/);
    await expect(superAdmin.supportSession).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "ACME Corp" }),
    ).toBeVisible();

    // The session went back to the person's own account on the way out.
    expect(staffApi.switches).toHaveLength(2);
    expect(staffApi.switches[1]).not.toBe("acme");
  });

  test("search people and invitations, and enter an account from a person", async ({
    staffPage: page,
    staffApi,
  }) => {
    const superAdmin = new SuperAdminPage(page);

    await superAdmin.goToPeople();

    const prompt = page.getByText("Search for a user or a pending invitation");
    await expect(prompt).toBeVisible();

    // Too short to search by: the server wants three characters.
    await superAdmin.search("ja");
    await expect(prompt).toBeVisible();

    await superAdmin.search("jane");

    await expect(superAdmin.personRows).toHaveCount(2);
    await expect(superAdmin.invitationRows).toHaveCount(2);

    const janeRow = superAdmin.personRows.first();
    await expect(janeRow.getByRole("link", { name: "acme" })).toBeVisible();
    await expect(janeRow.getByRole("link", { name: "globex" })).toBeVisible();
    await expect(janeRow).toContainText("(invited)");

    await page.getByRole("button", { name: "Type" }).click();
    await page.getByRole("button", { name: "Invitations" }).click();

    await expect(page).toHaveURL(/type=invitation/);
    await expect(superAdmin.personRows).toHaveCount(0);
    await expect(superAdmin.invitationRows).toHaveCount(2);

    await page.getByRole("button", { name: "Type" }).click();
    await page.getByRole("button", { name: "All" }).click();

    await expect(superAdmin.personRows).toHaveCount(2);

    await janeRow.getByRole("button", { name: "Jane Doe actions" }).click();
    await page.getByRole("menuitem", { name: "Enter jane-free-1" }).click();

    await expect(page).toHaveURL(
      /\/super-admin\/accounts\/jane-free-1\/session\/events-log/,
    );
    await expect(superAdmin.supportSession).toContainText(
      "Jane's free account",
    );
    expect(staffApi.switches).toEqual(["jane-free-1"]);
  });

  test.describe("on the read tier", () => {
    test.use({ staffApiMock: { globalRoles: ["SupportProvider"] } });

    test("can look but not change", async ({ staffPage: page }) => {
      const superAdmin = new SuperAdminPage(page);

      await superAdmin.goToAccount("acme");

      await expect(
        page.getByRole("heading", { name: "ACME Corp" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Enter account" }),
      ).toBeVisible();

      await page.getByRole("tab", { name: "Features" }).click();

      await expect(
        page.getByText("Only account managers can change features."),
      ).toBeVisible();
      await expect(page.getByRole("switch").first()).toBeDisabled();
    });
  });

  test.describe("without an account of their own", () => {
    test.use({ staffApiMock: { withoutOwnAccounts: true } });

    test("land in super admin mode and stay there", async ({
      page,
      staffApi: _staffApi,
    }) => {
      const superAdmin = new SuperAdminPage(page);

      await login(page, USER.email, USER.password);

      await expect(page).toHaveURL(/\/super-admin\/accounts$/);
      await expect(superAdmin.navigation).toBeVisible();

      await page.getByRole("link", { name: "Back to main view" }).click();

      await expect(page).toHaveURL(/\/super-admin\/accounts$/);
    });
  });
});
