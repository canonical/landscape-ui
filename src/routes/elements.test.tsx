import { describe, expect, it } from "vitest";
import type { FC, ReactElement } from "react";
import * as Pages from "./elements";

const getLazyElementType = (
  Page: FC,
): {
  _payload: unknown;
  _init: (payload: unknown) => unknown;
} => {
  const element = Page({}) as ReactElement<{ children: ReactElement }>;
  const lazyElement = element.props.children;
  return lazyElement.type as unknown as {
    _payload: unknown;
    _init: (payload: unknown) => unknown;
  };
};

const resolveLoadableImport = async (Page: FC) => {
  const lazyType = getLazyElementType(Page);
  try {
    lazyType._init(lazyType._payload);
  } catch (error) {
    if (error instanceof Promise) {
      await error;
      return;
    }

    throw error;
  }
};

describe("route elements", () => {
  it("sets loadable display names", () => {
    expect(Pages.LoginPage.displayName).toContain("Loadable(");
    expect(Pages.PageNotFound.displayName).toContain("Loadable(");
    expect(Pages.DashboardPage.displayName).toContain("Loadable(");
  });

  it("exports wrapped route components", () => {
    const exportedPages = [
      Pages.OidcAuthPage,
      Pages.UbuntuOneAuthPage,
      Pages.InvitationPage,
      Pages.AccountCreationPage,
      Pages.NoAccessPage,
      Pages.LoginPage,
      Pages.SupportLoginPage,
      Pages.AttachPage,
      Pages.PageNotFound,
      Pages.EnvError,
      Pages.DashboardPage,
      Pages.OverviewPage,
      Pages.ActivitiesPage,
      Pages.ScriptsPage,
      Pages.EventsLogPage,
      Pages.AlertNotificationsPage,
      Pages.InstancesPage,
      Pages.SingleInstance,
      Pages.RepositoryProfilesPage,
      Pages.PackageProfilesPage,
      Pages.RemovalProfilesPage,
      Pages.UpgradeProfilesPage,
      Pages.WslProfilesPage,
      Pages.SecurityProfilesPage,
      Pages.RebootProfilesPage,
      Pages.AccessGroupsPage,
      Pages.AdministratorsPage,
      Pages.EmployeesPage,
      Pages.RolesPage,
      Pages.GeneralOrganisationSettings,
      Pages.IdentityProvidersPage,
      Pages.GeneralSettings,
      Pages.Alerts,
      Pages.ApiCredentials,
    ];

    for (const exportedPage of exportedPages) {
      expect(typeof exportedPage).toBe("function");
    }
  });

  it("resolves lazy imports for exported route components", async () => {
    const exportedPages = [
      Pages.OidcAuthPage,
      Pages.UbuntuOneAuthPage,
      Pages.InvitationPage,
      Pages.AccountCreationPage,
      Pages.NoAccessPage,
      Pages.LoginPage,
      Pages.SupportLoginPage,
      Pages.AttachPage,
      Pages.PageNotFound,
      Pages.EnvError,
      Pages.DashboardPage,
      Pages.OverviewPage,
      Pages.ActivitiesPage,
      Pages.ScriptsPage,
      Pages.EventsLogPage,
      Pages.AlertNotificationsPage,
      Pages.InstancesPage,
      Pages.SingleInstance,
      Pages.RepositoryProfilesPage,
      Pages.PackageProfilesPage,
      Pages.RemovalProfilesPage,
      Pages.UpgradeProfilesPage,
      Pages.WslProfilesPage,
      Pages.SecurityProfilesPage,
      Pages.RebootProfilesPage,
      Pages.AccessGroupsPage,
      Pages.AdministratorsPage,
      Pages.EmployeesPage,
      Pages.RolesPage,
      Pages.GeneralOrganisationSettings,
      Pages.IdentityProvidersPage,
      Pages.GeneralSettings,
      Pages.Alerts,
      Pages.ApiCredentials,
    ] as const;

    for (const exportedPage of exportedPages) {
      await resolveLoadableImport(exportedPage);
    }
  });
});
