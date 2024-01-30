import React, { FC, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../constants";
import { useQueryClient } from "@tanstack/react-query";

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

export interface Account {
  title: string;
  name: string;
  default?: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  token: string;
  accounts: Account[];
  current_account: string;
}

export interface AuthContextProps {
  authorized: boolean;
  authLoading: boolean;
  user: AuthUser | null;
  switchAccount: (newToken: string, newAccount: string) => void;
  setUser: (user: AuthUser, remember?: boolean) => void;
  logout: () => void;
}

const initialState: AuthContextProps = {
  authorized: false,
  authLoading: false,
  user: null,
  setUser: () => undefined,
  switchAccount: () => undefined,
  logout: () => undefined,
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

  useEffect(() => {
    const maybeSavedState = getFromLocalStorage(AUTH_STORAGE_KEY);

    maybeSavedState
      ? setUser(maybeSavedState)
      : localStorage.removeItem(AUTH_STORAGE_KEY);

    setLoading(false);
  }, []);

  const handleSetUser = (user: AuthUser, remember?: boolean) => {
    setUser(user);
    if (remember) {
      setToLocalStorage(AUTH_STORAGE_KEY, user);
    }
  };

  const handleSwitchAccount = (newToken: string, newAccount: string) => {
    const maybeSavedState = getFromLocalStorage(AUTH_STORAGE_KEY);
    const newUser = {
      ...user!,
      current_account: newAccount,
      token: newToken,
    };
    setUser(newUser);
    queryClient.removeQueries();
    queryClient.refetchQueries();
    if (maybeSavedState) {
      setToLocalStorage(AUTH_STORAGE_KEY, newUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate(`${ROOT_PATH}login`, { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authorized: null !== user,
        authLoading: loading,
        logout: handleLogout,
        setUser: handleSetUser,
        switchAccount: handleSwitchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
