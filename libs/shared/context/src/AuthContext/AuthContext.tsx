import { Redirecting } from '@landscape/ui';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { FC, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useNotify } from '../NotifyContext';
import useUnsigned from './api/useUnsigned';
import { redirectToExternalUrl } from './helpers';
import { AuthUser } from './types';

export interface AuthContextProps {
  authLoading: boolean;
  authorized: boolean;
  isOidcAvailable: boolean;
  logout: () => void;
  redirectToExternalUrl: (url: string, options?: { replace: boolean }) => void;
  setAuthLoading: (loading: boolean) => void;
  setUser: (user: AuthUser) => void;
  user: AuthUser | null;
  isFeatureEnabled: (feature: string) => boolean;
}

const initialState: AuthContextProps = {
  authLoading: false,
  authorized: false,
  isOidcAvailable: false,
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
  const { getLoginMethodsQuery, getAuthStateQuery } = useUnsigned();

  const { data: getLoginMethodsQueryResult } = getLoginMethodsQuery();

  const isGetAuthStateQueryEnabled = !pathname.includes('handle-auth');

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
  }, [pathname]);

  const { data: getAuthStateQueryResult } = getAuthStateQuery(
    {},
    { enabled: isGetAuthStateQueryEnabled },
  );

  useEffect(() => {
    if (!getAuthStateQueryResult) {
      return;
    }

    if ('current_account' in getAuthStateQueryResult.data) {
      setUser(getAuthStateQueryResult.data);
    }

    setLoading(false);
  }, [getAuthStateQueryResult]);

  const isAuthError = useMemo(
    () =>
      isAxiosError(notify.notification?.error) &&
      notify.notification.error.response?.status === 401,
    [notify.notification],
  );

  const handleLogout = () => {
    setUser(null);
    navigate('/login', { replace: true });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== 'authUser',
    });
  };

  useEffect(() => {
    if (!isAuthError) {
      return;
    }

    handleLogout();
  }, [isAuthError]);

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

  const isFeatureEnabled = useCallback(
    (featureKey: string) => {
      if (!user) {
        return false;
      }

      const match = user.features.find((feature) => feature.key === featureKey);

      if (!match) {
        console.warn(
          `Feature ${featureKey} not found in the features response.`,
        );
        return false;
      }

      return match.enabled;
    },
    [user],
  );

  if (isRedirecting) {
    return <Redirecting />;
  }

  return (
    <AuthContext.Provider
      value={{
        isFeatureEnabled,
        user,
        authLoading: loading,
        authorized: null !== user,
        isOidcAvailable: !!getLoginMethodsQueryResult?.data.oidc.available,
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
