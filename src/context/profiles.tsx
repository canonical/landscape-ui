import type { FC, ReactNode } from "react";
import { createContext, useState } from "react";

interface ProfilesContextProps {
  isProfileLimitReached: boolean;
  setIsProfileLimitReached: (limitReached: boolean) => void;
  profileLimit: number;
  setProfileLimit: (limit: number) => void;
}

const initialState = {
  isProfileLimitReached: false,
  setIsProfileLimitReached: () => undefined,
  profileLimit: 0,
  setProfileLimit: () => undefined,
};

export const ProfilesContext =
  createContext<ProfilesContextProps>(initialState);

interface ProfilesProviderProps {
  readonly children: ReactNode;
  readonly path: string;
}

export const ProfilesProvider: FC<ProfilesProviderProps> = ({
  children,
  path,
}) => {
  const [isProfileLimitReached, setIsProfileLimitReached] = useState(false);
  const [profileLimit, setProfileLimit] = useState(0);
  const [resetKey, setResetKey] = useState(path);

  if (path !== resetKey) {
    setIsProfileLimitReached(false);
    setResetKey(path);
  }

  return (
    <ProfilesContext.Provider
      value={{
        isProfileLimitReached,
        setIsProfileLimitReached,
        profileLimit,
        setProfileLimit,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};
