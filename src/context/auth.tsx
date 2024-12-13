import { isAxiosError } from "axios";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROOT_PATH } from "@/constants";
import useNotify from "@/hooks/useNotify";
import { AuthUser, redirectToExternalUrl, useUnsigned } from "@/features/auth";
import { SelectOption } from "@/types/SelectOption";
import Redirecting from "@/components/layout/Redirecting";

export interface AuthContextProps {
  account: {
    current: string;
    options: SelectOption[];
    switch: (newToken: string, newAccount: string) => void;
  };
  authLoading: boolean;
  authorized: boolean;
  isOidcAvailable: boolean;
  logout: () => void;
  redirectToExternalUrl: (url: string, options?: { replace: boolean }) => void;
  setUser: (user: AuthUser) => void;
  user: AuthUser | null;
}

const initialState: AuthContextProps = {
  account: {
    current: "",
    options: [],
    switch: () => undefined,
  },
  authLoading: false,
  authorized: false,
  isOidcAvailable: false,
  logout: () => undefined,
  redirectToExternalUrl: () => undefined,
  setUser: () => undefined,
  user: null,
};

export const AuthContext = React.createContext<AuthContextProps>(initialState);

interface AuthProviderProps {
  children: ReactNode;
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

  const isGetAuthStateQueryEnabled = !pathname.includes("handle-auth");

  useEffect(() => {
    if (isGetAuthStateQueryEnabled) {
      return;
    }

    setLoading(false);
  }, [isGetAuthStateQueryEnabled]);

  const { data: getAuthStateQueryResult } = getAuthStateQuery(
    {},
    { enabled: isGetAuthStateQueryEnabled },
  );

  useEffect(() => {
    if (!getAuthStateQueryResult) {
      return;
    }

    if ("current_account" in getAuthStateQueryResult.data) {
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

  useEffect(() => {
    if (!isAuthError) {
      return;
    }

    handleLogout();
  }, [isAuthError]);

  const handleSetUser = (user: AuthUser) => {
    setUser(user);
  };

  const handleSwitchAccount = (newToken: string, newAccount: string) => {
    if (!user) {
      return;
    }

    const newUser = {
      ...user,
      current_account: newAccount,
      token: newToken,
    };

    setUser(newUser);
  };

  const account = useMemo<AuthContextProps["account"]>(() => {
    if (!user) {
      return initialState.account;
    }

    const options: SelectOption[] = user.accounts
      .filter(({ subdomain }) => !subdomain)
      .map(({ title, name }) => ({
        label: title,
        value: name,
      }));

    return {
      current: options.some(({ value }) => value === user.current_account)
        ? user.current_account
        : options[0].value,
      options,
      switch: handleSwitchAccount,
    };
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate(`${ROOT_PATH}login`, { replace: true });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "authUser",
    });
  };

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
        account,
        authLoading: loading,
        authorized: null !== user,
        isOidcAvailable: !!getLoginMethodsQueryResult?.data.oidc.available,
        logout: handleLogout,
        redirectToExternalUrl: handleExternalRedirect,
        setUser: handleSetUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
