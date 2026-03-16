import type { FC, ReactNode } from "react";
import { createContext, useState } from "react";

interface ProfilesContextProps {
  isProfileLimitReached: boolean;
  setIsProfileLimitReached: (limitReached: boolean) => void;
}

const initialState = {
  isProfileLimitReached: false,
  setIsProfileLimitReached: () => undefined,
};

export const ProfilesContext =
  createContext<ProfilesContextProps>(initialState);

interface ProfilesProviderProps {
  readonly children: ReactNode;
}

export const ProfilesProvider: FC<ProfilesProviderProps> = ({ children }) => {
  const [isProfileLimitReached, setIsProfileLimitReached] = useState(false);

  return (
    <ProfilesContext.Provider
      value={{
        isProfileLimitReached,
        setIsProfileLimitReached,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};
