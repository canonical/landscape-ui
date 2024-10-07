import { isAxiosError } from "axios";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROOT_PATH } from "@/constants";
import useNotify from "@/hooks/useNotify";
import { AuthUser, useAuthHandle } from "@/features/auth";
import { SelectOption } from "@/types/SelectOption";

const AUTH_STORAGE_KEY = "_landscape_auth";

function getFromLocalStorage(key: string) {
  const item = localStorage.getItem(key);

  if (!item) {
    return null;
  }

  try {
    const parsed: AuthUser = JSON.parse(item);

    return parsed;
  } catch {
    return null;
  }
}

function setToLocalStorage(key: string, value: AuthUser) {
  localStorage.setItem(key, JSON.stringify(value));
}

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
  setUser: (user: AuthUser, remember?: boolean) => void;
  updateUser: (user: AuthUser) => void;
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
  updateUser: () => undefined,
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
  const { notify } = useNotify();
  const { getLoginMethodsQuery } = useAuthHandle();

  const { data: getLoginMethodsQueryResult } = getLoginMethodsQuery();

  const isAuthError = useMemo(
    () =>
      isAxiosError(notify.notification?.error) &&
      notify.notification.error.response?.status === 401,
    [notify.notification],
  );

  useEffect(() => {
    const maybeSavedState = getFromLocalStorage(AUTH_STORAGE_KEY);

    if (maybeSavedState) {
      setUser(maybeSavedState);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthError) {
      return;
    }

    handleLogout();
  }, [isAuthError]);

  const handleSetUser = (user: AuthUser, remember?: boolean) => {
    setUser(user);
    if (remember) {
      setToLocalStorage(AUTH_STORAGE_KEY, user);
    }
  };

  const handleUpdateUser = (user: AuthUser) => {
    setUser(user);
    setToLocalStorage(AUTH_STORAGE_KEY, user);
  };

  const handleSwitchAccount = (newToken: string, newAccount: string) => {
    const maybeSavedState = getFromLocalStorage(AUTH_STORAGE_KEY);
    const newUser = {
      ...user!,
      current_account: newAccount,
      token: newToken,
    };

    setUser(newUser);

    if (maybeSavedState) {
      setToLocalStorage(AUTH_STORAGE_KEY, newUser);
    }
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
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate(`${ROOT_PATH}login`, { replace: true });
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        authLoading: loading,
        authorized: null !== user,
        logout: handleLogout,
        setUser: handleSetUser,
        updateUser: handleUpdateUser,
        isOidcAvailable: !!getLoginMethodsQueryResult?.data.oidc.available,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
