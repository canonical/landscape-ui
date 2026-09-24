import type { FC, ReactNode } from "react";
import { Navigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import LoadingState from "@/components/layout/LoadingState";
import { ROUTES } from "@/libs/routes";

interface Props {
  readonly children: ReactNode;
}

/** Renders `children` for Canonical staff only; everyone else goes to `/`. */
export const SuperAdminGuard: FC<Props> = ({ children }) => {
  const { authLoading, isSuperAdmin } = useAuth();

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isSuperAdmin) {
    return <Navigate to={ROUTES.root.root()} replace />;
  }

  return <>{children}</>;
};
