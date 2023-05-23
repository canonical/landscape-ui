import React, { FC, ReactNode, useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "_landscape_auth";

export interface AuthUser {
  email: string;
  name: string;
  token: string;
}

export interface AuthContextProps {
  authorized: boolean;
  authLoading: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser, remember?: boolean) => void;
  logout: () => void;
}

const initialState: AuthContextProps = {
  authorized: false,
  authLoading: false,
  user: null,
  setUser: () => undefined,
  logout: () => undefined,
};

export const AuthContext = React.createContext<AuthContextProps>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const maybeSavedState = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!maybeSavedState) {
      setLoading(false);
      return undefined;
    }

    const savedState = JSON.parse(maybeSavedState);

    if (!savedState) {
      setLoading(false);
      localStorage.removeItem(AUTH_STORAGE_KEY);

      return;
    }

    setUser({
      name: savedState.name ?? "",
      email: savedState.email ?? "",
      token: savedState.token ?? "",
    });
  }, []);

  const handleSetUser = (user: AuthUser, remember?: boolean) => {
    setUser(user);

    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authorized: null !== user,
        authLoading: loading,
        logout: handleLogout,
        setUser: handleSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
