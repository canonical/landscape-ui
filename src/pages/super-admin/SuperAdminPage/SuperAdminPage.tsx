import type { FC } from "react";
import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { getSameOriginPath } from "@/features/auth";
import { useRestoreOwnAccount } from "@/features/super-admin";
import { ROUTES } from "@/libs/routes";
import SuperAdminTemplate from "@/templates/super-admin";

/** The normal-view path the "Super admin" entry was clicked on, if any. */
const getReturnTo = (state: unknown): string => {
  const returnTo =
    typeof state === "object" &&
    state !== null &&
    "returnTo" in state &&
    typeof state.returnTo === "string"
      ? getSameOriginPath(state.returnTo)
      : null;

  const superAdminRoot = ROUTES.superAdmin.root();
  const isInsideSuperAdmin =
    returnTo === superAdminRoot || returnTo?.startsWith(`${superAdminRoot}/`);

  return returnTo && !isInsideSuperAdmin ? returnTo : ROUTES.root.root();
};

const SuperAdminPage: FC = () => {
  const { state } = useLocation();

  // Read once on entry: navigating within super admin mode keeps the origin.
  const [returnTo] = useState(() => getReturnTo(state));

  // A support session left by any other way than its exit control.
  const { leavingAccount, restoreError, retryRestore } = useRestoreOwnAccount();

  const getContent = () => {
    if (leavingAccount) {
      return (
        <>
          <LoadingState />
          <p className="u-align-text--center u-text--muted">
            Leaving {leavingAccount}…
          </p>
        </>
      );
    }

    if (restoreError) {
      return (
        <EmptyState
          title={`Could not leave ${restoreError.account}`}
          body={restoreError.message}
          cta={[
            <Button
              key="retry"
              type="button"
              appearance="positive"
              onClick={retryRestore}
            >
              Try again
            </Button>,
          ]}
        />
      );
    }

    return (
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    );
  };

  return (
    <SuperAdminTemplate returnTo={returnTo}>{getContent()}</SuperAdminTemplate>
  );
};

export default SuperAdminPage;
