import { isAxiosError } from "axios";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROOT_PATH } from "@/constants";
import useNotify from "@/hooks/useNotify";
import { AuthUser, useUnsigned } from "@/features/auth";
import { SelectOption } from "@/types/SelectOption";

export interface AuthContextProps {
  account:
    | {
        switchable: false;
      }
    | {
        current: string;
        options: SelectOption[];
        switch: (newToken: string, newAccount: string) => void;
        switchable: true;
      };
  authLoading: boolean;
  authorized: boolean;
  isOidcAvailable: boolean;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  user: AuthUser | null;
}

const initialState: AuthContextProps = {
  account: {
    switchable: false,
  },
  authLoading: false,
  authorized: false,
  isOidcAvailable: false,
  logout: () => undefined,
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
    const newUser = {
      ...user!,
      current_account: newAccount,
      token: newToken,
    };

    setUser(newUser);
  };

  const account = useMemo<AuthContextProps["account"]>(() => {
    if (
      !user ||
      user.accounts.some(
        ({ subdomain }) =>
          !!subdomain && location.hostname.startsWith(subdomain),
      )
    ) {
      return {
        switchable: false,
      };
    }

    const options: SelectOption[] = user.accounts
      .filter(({ subdomain }) => !subdomain)
      .map(({ title, name }) => ({
        label: title,
        value: name,
      }));

    return options.length > 1
      ? {
          current: options.some(({ value }) => value === user.current_account)
            ? user.current_account
            : options[0].value,
          options,
          switch: handleSwitchAccount,
          switchable: true,
        }
      : {
          switchable: false,
        };
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate(`${ROOT_PATH}login`, { replace: true });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "authUser",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        authLoading: loading,
        authorized: null !== user,
        logout: handleLogout,
        setUser: handleSetUser,
        isOidcAvailable: !!getLoginMethodsQueryResult?.data.oidc.available,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
