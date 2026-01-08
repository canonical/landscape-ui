import type { FC, ReactNode } from "react";
import { createContext, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@/features/auth";
import { redirectToExternalUrl, useGetAuthState } from "@/features/auth";
import Redirecting from "@/components/layout/Redirecting";
import type { FeatureKey } from "@/types/FeatureKey";
import useFeatures from "@/hooks/useFeatures";
import { ROUTES } from "@/libs/routes";

const AUTH_QUERY_KEY = ["authUser"];

export interface AuthContextProps {
  authLoading: boolean;
  authorized: boolean;
  hasAccounts: boolean;
  logout: () => void;
  redirectToExternalUrl: (url: string, options?: { replace: boolean }) => void;
  setUser: (user: AuthUser) => void;
  user: AuthUser | null;
  isFeatureEnabled: (feature: FeatureKey) => boolean;
}

const initialState: AuthContextProps = {
  authLoading: false,
  authorized: false,
  hasAccounts: false,
  logout: () => undefined,
  redirectToExternalUrl: () => undefined,
  setUser: () => undefined,
  isFeatureEnabled: () => false,
  user: null,
};

export const AuthContext = createContext<AuthContextProps>(initialState);

interface AuthProviderProps {
  readonly children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const isGetAuthStateQueryEnabled = !pathname.includes("handle-auth");

  const { user, isLoading: isAuthLoading } = useGetAuthState({
    enabled: isGetAuthStateQueryEnabled,
  });

  const { isFeatureEnabled, isFeaturesLoading } = useFeatures(
    user?.email ?? null,
  );

  const handleLogout = useCallback(() => {
    queryClient.setQueryData(AUTH_QUERY_KEY, null);

    navigate(ROUTES.auth.login(), { replace: true });

    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== AUTH_QUERY_KEY[0],
    });
  }, [navigate, queryClient]);

  const handleSetUser = useCallback(
    (newUser: AuthUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, newUser);
    },
    [queryClient],
  );

  const handleExternalRedirect = useCallback(
    (url: string, options?: { replace: boolean }) => {
      setIsRedirecting(true);
      redirectToExternalUrl(url, options);
    },
    [],
  );

  if (isRedirecting) {
    return <Redirecting />;
  }

  return (
    <AuthContext.Provider
      value={{
        isFeatureEnabled,
        user,
        authLoading: isAuthLoading || isFeaturesLoading,
        authorized: null !== user,
        hasAccounts: !!user?.accounts.length,
        logout: handleLogout,
        redirectToExternalUrl: handleExternalRedirect,
        setUser: handleSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
