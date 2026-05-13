import { afterEach, describe, expect, it } from "vitest";
import { authResponse, authUser } from "@/tests/mocks/auth";
import {
  clearStoredAuthUser,
  getStoredAuthToken,
  getStoredAuthUser,
  setStoredAuthUser,
} from "./authStorage";

const STORAGE_KEY = "_landscape_authUser";

describe("authStorage", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("round-trips the auth user through sessionStorage", () => {
    setStoredAuthUser(authResponse);

    expect(getStoredAuthUser()).toEqual(authResponse);
    expect(getStoredAuthToken()).toBe(authUser.token);
  });

  it("returns null when nothing is stored", () => {
    expect(getStoredAuthUser()).toBeNull();
    expect(getStoredAuthToken()).toBeNull();
  });

  it("clears the stored user", () => {
    setStoredAuthUser(authResponse);
    clearStoredAuthUser();

    expect(getStoredAuthUser()).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("recovers from malformed JSON by clearing the entry", () => {
    sessionStorage.setItem(STORAGE_KEY, "{not valid json");

    expect(getStoredAuthUser()).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("returns null token when stored value has no token field", () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({}));

    expect(getStoredAuthToken()).toBeNull();
  });
});
