import { isAxiosError } from "axios";
import type { FC, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useNotify from "@/hooks/useNotify";
import type { AuthUser } from "@/features/auth";
import { redirectToExternalUrl, useUnsigned } from "@/features/auth";
import Redirecting from "@/components/layout/Redirecting";
import type { FeatureKey } from "@/types/FeatureKey";
import useFeatures from "@/hooks/useFeatures";
import { ROUTES } from "@/libs/routes";

const NOT_AUTHORIZED_CODE = 401;

export interface AuthContextProps {
  authLoading: boolean;
  authorized: boolean;
  hasAccounts: boolean;
  logout: () => void;
  redirectToExternalUrl: (url: string, options?: { replace: boolean }) => void;
  setAuthLoading: (loading: boolean) => void;
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
  setAuthLoading: () => undefined,
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { notify } = useNotify();
  const { getAuthStateQuery } = useUnsigned();
  const { isFeatureEnabled, isFeaturesLoading } = useFeatures(
    user?.email ?? null,
  );

  const isGetAuthStateQueryEnabled = !pathname.includes("handle-auth");

  useEffect(() => {
    if (isGetAuthStateQueryEnabled) {
      return;
    }

    setLoading(false);
  }, [isGetAuthStateQueryEnabled]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    setLoading(false);
  }, [loading, pathname]);

  const { data: getAuthStateQueryResult } = getAuthStateQuery(
    {},
    { enabled: isGetAuthStateQueryEnabled },
  );

  useEffect(() => {
    if (!getAuthStateQueryResult) {
      return;
    }

    if (
      "current_account" in getAuthStateQueryResult.data &&
      getAuthStateQueryResult.data.attach_code === null
    ) {
      setUser(getAuthStateQueryResult.data);
    }

    setLoading(false);
  }, [getAuthStateQueryResult]);

  const isAuthError = useMemo(
    () =>
      isAxiosError(notify.notification?.error) &&
      notify.notification.error.response?.status === NOT_AUTHORIZED_CODE,
    [notify.notification],
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    navigate(ROUTES.auth.login(), { replace: true });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "authUser",
    });
  }, [navigate, queryClient]);

  useEffect(() => {
    if (!isAuthError) {
      return;
    }

    handleLogout();
  }, [handleLogout, isAuthError]);

  const handleSetUser = (newUser: AuthUser) => {
    setUser(newUser);
  };

  const handleExternalRedirect = useCallback(
    (url: string, options?: { replace: boolean }) => {
      setIsRedirecting(true);
      redirectToExternalUrl(url, options);
    },
    [],
  );

  const handleAuthLoading = useCallback((newState: boolean) => {
    setLoading(newState);
  }, []);

  if (isRedirecting) {
    return <Redirecting />;
  }

  return (
    <AuthContext.Provider
      value={{
        isFeatureEnabled,
        user,
        authLoading: loading || isFeaturesLoading,
        authorized: null !== user,
        hasAccounts: !!user?.accounts.length,
        logout: handleLogout,
        redirectToExternalUrl: handleExternalRedirect,
        setAuthLoading: handleAuthLoading,
        setUser: handleSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
