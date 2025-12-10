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
}

export const AuthGuard: FC<Props> = ({ children }) => {
  const { authorized, authLoading, hasAccounts } = useAuth();
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

    if (!hasAccounts) {
      navigate(ROUTES.auth.createAccount(), { replace: true });
    }
  }, [
    authorized,
    authLoading,
    hasAccounts,
    pathname,
    search,
    navigate,
    queryClient,
  ]);

  if (authLoading) return <LoadingState />;

  return authorized && hasAccounts ? <>{children}</> : <Redirecting />;
};
