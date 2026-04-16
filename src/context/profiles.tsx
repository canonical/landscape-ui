import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";
import { createContext, useCallback, useRef, useState } from "react";

export interface RemoveProfileParams {
  id: number;
  name: string;
}

type RemoveProfileFn = UseMutateAsyncFunction<
  unknown,
  unknown,
  RemoveProfileParams
>;

const noopRemoveProfile: RemoveProfileFn = async () => {
  throw new Error("removeProfile is not configured");
};

interface ProfilesContextProps {
  isProfileLimitReached: boolean;
  setIsProfileLimitReached: (limitReached: boolean) => void;
  profileLimit: number;
  setProfileLimit: (limit: number) => void;
  removeProfile: RemoveProfileFn;
  setRemoveProfile: (removalFn: RemoveProfileFn) => void;
  isRemovingProfile: boolean;
  setIsRemovingProfile: (isRemoving: boolean) => void;
}

const initialState = {
  isProfileLimitReached: false,
  setIsProfileLimitReached: () => undefined,
  profileLimit: 0,
  setProfileLimit: () => undefined,
  removeProfile: noopRemoveProfile,
  setRemoveProfile: () => undefined,
  isRemovingProfile: false,
  setIsRemovingProfile: () => undefined,
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
  const removeProfileRef = useRef<RemoveProfileFn>(noopRemoveProfile);
  const [isRemovingProfile, setIsRemovingProfile] = useState(false);

  const removeProfile: RemoveProfileFn = useCallback(
    (variables, options) => removeProfileRef.current(variables, options),
    [],
  );

  const setRemoveProfile: ProfilesContextProps["setRemoveProfile"] =
    useCallback((removalFn) => {
      removeProfileRef.current = removalFn;
    }, []);

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
        removeProfile,
        setRemoveProfile,
        isRemovingProfile,
        setIsRemovingProfile,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};
