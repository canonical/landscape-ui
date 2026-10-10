import { describe, expect, it } from "vitest";
import { getAuthTestingConfig } from "./config";

describe("getAuthTestingConfig", () => {
  it.each([undefined, "", "false"])("defaults to disabled for %s", (value) => {
    expect(
      getAuthTestingConfig({
        VITE_MSW_ENABLED: "true",
        VITE_MSW_AUTHENTICATION_TESTING: value,
        VITE_MSW_AUTH_LOGIN_ERROR: "unknown",
      }),
    ).toBeNull();
  });

  it("requires MSW to be explicitly enabled", () => {
    expect(
      getAuthTestingConfig({ VITE_MSW_AUTHENTICATION_TESTING: "true" }),
    ).toBeNull();
  });

  it("reads method toggles only in opt-in mode", () => {
    expect(
      getAuthTestingConfig({
        VITE_MSW_ENABLED: "true",
        VITE_MSW_AUTHENTICATION_TESTING: "true",
        VITE_MSW_ACCOUNT_EXISTS: "false",
        VITE_MSW_PAM_ENABLED: "true",
        VITE_MSW_PASSWORD_ENABLED: "false",
        VITE_MSW_OIDC_ENABLED: "true",
        VITE_MSW_UBUNTU_ONE_ENABLED: "false",
        VITE_MSW_INVITATION_ENABLED: "true",
        VITE_MSW_INVITATION_SIGNED_IN: "true",
      }),
    ).toMatchObject({
      accountExists: false,
      pamEnabled: true,
      passwordEnabled: false,
      oidcEnabled: true,
      ubuntuOneEnabled: false,
      invitationEnabled: true,
      invitationSignedIn: true,
      creationError: "none",
      loginError: "none",
      invitationError: "none",
    });
  });

  it("rejects unknown active error selectors", () => {
    expect(() =>
      getAuthTestingConfig({
        VITE_MSW_ENABLED: "true",
        VITE_MSW_AUTHENTICATION_TESTING: "true",
        VITE_MSW_AUTH_LOGIN_ERROR: "unknown",
      }),
    ).toThrow("VITE_MSW_AUTH_LOGIN_ERROR must be one of:");
  });
});
