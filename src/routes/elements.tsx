import type { ComponentType, FC, LazyExoticComponent } from "react";
import { lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

const Loadable = <P extends object>(
  Component: LazyExoticComponent<ComponentType<P>> | ComponentType<P>,
): FC<P> => {
  const SuspenseWrapper: FC<P> = (props) => (
    <Suspense fallback={<LoadingState />}>
      <Component {...props} />
    </Suspense>
  );

  const name = Component.name || "LazyComponent";
  SuspenseWrapper.displayName = `Loadable(${name})`;

  return SuspenseWrapper;
};

export const OidcAuthPage = Loadable(
  lazy(() => import("@/pages/auth/handle/oidc")),
);
export const UbuntuOneAuthPage = Loadable(
  lazy(() => import("@/pages/auth/handle/ubuntu-one")),
);
export const InvitationPage = Loadable(
  lazy(() => import("@/pages/auth/invitation")),
);
export const AccountCreationPage = Loadable(
  lazy(() => import("@/pages/auth/account-creation")),
);
export const NoAccessPage = Loadable(
  lazy(() => import("@/pages/auth/NoAccess")),
);
export const LoginPage = Loadable(lazy(() => import("@/pages/auth/login")));
export const SupportLoginPage = Loadable(
  lazy(() => import("@/pages/auth/support-login")),
);
export const AttachPage = Loadable(
  lazy(() => import("@/pages/auth/attach/AttachPage")),
);
export const PageNotFound = Loadable(
  lazy(() => import("@/pages/PageNotFound")),
);
export const EnvError = Loadable(lazy(() => import("@/pages/EnvError")));
export const DashboardPage = Loadable(lazy(() => import("@/pages/dashboard")));
export const OverviewPage = Loadable(
  lazy(() => import("@/pages/dashboard/overview")),
);
export const ActivitiesPage = Loadable(
  lazy(() => import("@/pages/dashboard/activities")),
);
export const ScriptsPage = Loadable(
  lazy(() => import("@/pages/dashboard/scripts")),
);
export const EventsLogPage = Loadable(
  lazy(() => import("@/pages/dashboard/events-log")),
);
export const AlertNotificationsPage = Loadable(
  lazy(() => import("@/pages/dashboard/alert-notifications")),
);
export const InstancesPage = Loadable(
  lazy(() => import("@/pages/dashboard/instances/InstancesPage")),
);
export const SingleInstance = Loadable(
  lazy(() => import("@/pages/dashboard/instances/[single]")),
);
export const DistributionsPage = Loadable(
  lazy(() => import("@/pages/dashboard/repositories/mirrors")),
);
export const RepositoryProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/repository-profiles")),
);
export const GPGKeysPage = Loadable(
  lazy(() => import("@/pages/dashboard/repositories/gpg-keys")),
);
export const APTSourcesPage = Loadable(
  lazy(() => import("@/pages/dashboard/repositories/apt-sources")),
);
export const PackageProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/package-profiles")),
);
export const RemovalProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/removal-profiles")),
);
export const UpgradeProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/upgrade-profiles")),
);
export const WslProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/wsl-profiles")),
);
export const SecurityProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/security-profiles")),
);
export const RebootProfilesPage = Loadable(
  lazy(() => import("@/pages/dashboard/profiles/reboot-profiles")),
);
export const AccessGroupsPage = Loadable(
  lazy(() => import("@/pages/dashboard/settings/access-group")),
);
export const AdministratorsPage = Loadable(
  lazy(() => import("@/pages/dashboard/settings/administrators")),
);
export const EmployeesPage = Loadable(
  lazy(() => import("@/pages/dashboard/settings/employees")),
);
export const RolesPage = Loadable(
  lazy(() => import("@/pages/dashboard/settings/roles")),
);
export const GeneralOrganisationSettings = Loadable(
  lazy(() => import("@/pages/dashboard/settings/general")),
);
export const IdentityProvidersPage = Loadable(
  lazy(() => import("@/pages/dashboard/settings/identity-providers")),
);
export const GeneralSettings = Loadable(
  lazy(() => import("@/pages/dashboard/account/general")),
);
export const Alerts = Loadable(
  lazy(() => import("@/pages/dashboard/account/alerts")),
);
export const ApiCredentials = Loadable(
  lazy(() => import("@/pages/dashboard/account/api-credentials")),
);
