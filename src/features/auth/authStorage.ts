import type { AuthStateResponse } from "./api/types";

const STORAGE_KEY = "_landscape_authUser";

export const getStoredAuthUser = (): AuthStateResponse | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthStateResponse;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setStoredAuthUser = (user: AuthStateResponse): void => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredAuthUser = (): void => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const getStoredAuthToken = (): string | null => {
  const stored = getStoredAuthUser();
  if (stored && "token" in stored && typeof stored.token === "string") {
    return stored.token;
  }
  return null;
};
