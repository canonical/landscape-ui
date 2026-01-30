import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAuth from "@/hooks/useAuth";
import { HOMEPAGE_PATH } from "@/constants";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";

interface Props {
  readonly children: ReactNode;
}

export const GuestGuard: FC<Props> = ({ children }) => {
  const { authorized, authLoading, hasAccounts, safeRedirect } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!authorized || authLoading) return;
    if (!hasAccounts) return;

    const redirectTo = searchParams.get("redirect-to");

    if (!redirectTo) {
      navigate(HOMEPAGE_PATH, { replace: true });
      return;
    }

    safeRedirect(redirectTo, {
      external: searchParams.has("external"),
      replace: true,
    });
  }, [
    authorized,
    authLoading,
    hasAccounts,
    searchParams,
    navigate,
    safeRedirect,
  ]);

  if (authLoading) return <LoadingState />;

  return !authorized || !hasAccounts ? <>{children}</> : <Redirecting />;
};
