import { ProfilesContext } from "@/context/profiles";
import type { AdditionalProviders, TestProviderProps } from "@/tests/render";
import { createElement, type ComponentProps } from "react";

type ProfilesContextValue = ComponentProps<
  typeof ProfilesContext.Provider
>["value"];

const noopRemoveProfile: ProfilesContextValue["removeProfile"] = async () => {
  throw new Error("removeProfile is not configured");
};

export const withProfilesContext = (
  overrides: Partial<ProfilesContextValue> = {},
): AdditionalProviders => {
  const contextValue: ProfilesContextValue = {
    isProfileLimitReached: false,
    setIsProfileLimitReached: () => undefined,
    profileLimit: 0,
    setProfileLimit: () => undefined,
    removeProfile: noopRemoveProfile,
    setRemoveProfile: () => undefined,
    isRemovingProfile: false,
    setIsRemovingProfile: () => undefined,
    ...overrides,
  };

  function ProfilesContextWrapper({ children }: TestProviderProps) {
    return createElement(
      ProfilesContext.Provider,
      { value: contextValue },
      children,
    );
  }

  return ProfilesContextWrapper;
};
