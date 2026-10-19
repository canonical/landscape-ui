import LoadingState from "@/components/layout/LoadingState";
import { SupportSessionContainer } from "@/features/super-admin";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { Suspense } from "react";
import { Navigate, Outlet, useParams } from "react-router";

const SupportSessionPage: FC = () => {
  const { name = "" } = useParams<{ name: string }>();
  const { canEnterAccounts } = useAuth();

  // Entering is for support providers only: anyone else reaching a session
  // by URL gets the account's page, with no switch attempted.
  if (!canEnterAccounts) {
    return <Navigate to={ROUTES.superAdmin.account(name)} replace />;
  }

  return (
    <SupportSessionContainer name={name}>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </SupportSessionContainer>
  );
};

export default SupportSessionPage;
