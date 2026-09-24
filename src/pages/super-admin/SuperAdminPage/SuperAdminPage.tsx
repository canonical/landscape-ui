import type { FC } from "react";
import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import { getSameOriginPath } from "@/features/auth";
import { ROUTES } from "@/libs/routes";
import SuperAdminTemplate from "@/templates/super-admin";

/** The normal-view path the "Super admin" entry was clicked on, if any. */
const getReturnTo = (state: unknown): string => {
  const returnTo =
    typeof state === "object" && state !== null && "returnTo" in state
      ? getSameOriginPath(String(state.returnTo))
      : null;

  return returnTo && !returnTo.startsWith(ROUTES.superAdmin.root())
    ? returnTo
    : ROUTES.root.root();
};

const SuperAdminPage: FC = () => {
  const { state } = useLocation();

  // Read once on entry: navigating within super admin mode keeps the origin.
  const [returnTo] = useState(() => getReturnTo(state));

  return (
    <SuperAdminTemplate returnTo={returnTo}>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </SuperAdminTemplate>
  );
};

export default SuperAdminPage;
