import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/libs/routes";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";

interface Props {
  readonly children: ReactNode;
  /**
   * Whether the route needs an account. Super admin mode does not: staff
   * without accounts of their own work there.
   */
  readonly requireAccount?: boolean;
}

export const AuthGuard: FC<Props> = ({ children, requireAccount = true }) => {
  const { authorized, authLoading, hasAccounts, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (authLoading) return;

    if (!authorized) {
      const redirectTo = `${pathname}${search}`;
      // Clear sensitive queries on logout/redirect
      queryClient.removeQueries({
        predicate: (q) => q.queryKey[0] !== "authUser",
      });
      navigate(ROUTES.auth.login({ "redirect-to": redirectTo }), {
        replace: true,
      });
      return;
    }

    if (requireAccount && !hasAccounts) {
      // Staff without accounts of their own have super admin mode to go to.
      navigate(
        isSuperAdmin ? ROUTES.superAdmin.root() : ROUTES.auth.createAccount(),
        { replace: true },
      );
    }
  }, [
    authorized,
    authLoading,
    hasAccounts,
    isSuperAdmin,
    requireAccount,
    pathname,
    search,
    navigate,
    queryClient,
  ]);

  if (authLoading) return <LoadingState />;

  return authorized && (hasAccounts || !requireAccount) ? (
    <>{children}</>
  ) : (
    <Redirecting />
  );
};
