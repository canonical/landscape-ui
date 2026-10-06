import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL } from "@/constants";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { authResponse } from "@/tests/mocks/auth";
import { saasEnv, selfHostedEnv } from "@/tests/mocks/env";
import { renderHookWithProviders } from "@/tests/render";
import server from "@/tests/server";

vi.mock("@/hooks/useEnv");

/** Serves `GET /me` for a signed-in user; `undefined` omits `global_roles`. */
const serveMe = (globalRoles: string[] | undefined) => {
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({ ...authResponse, global_roles: globalRoles }),
    ),
  );
};

const renderAuth = async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: renderHookWithProviders(),
  });

  await waitFor(() => {
    expect(result.current.authorized).toBe(true);
    expect(result.current.authLoading).toBe(false);
  });

  return result;
};

describe("AuthProvider super admin gating (integration)", () => {
  beforeEach(() => {
    vi.mocked(useEnv).mockReturnValue(saasEnv);
  });

  it.each([
    ["no staff role", [], { isSuperAdmin: false, canManageAccounts: false }],
    [
      "SupportProvider",
      ["SupportProvider"],
      { isSuperAdmin: true, canManageAccounts: false },
    ],
    [
      "AccountManager",
      ["AccountManager"],
      { isSuperAdmin: true, canManageAccounts: true },
    ],
    [
      "both staff roles",
      ["AccountManager", "SupportProvider"],
      { isSuperAdmin: true, canManageAccounts: true },
    ],
  ])("derives the gates for %s", async (_, globalRoles, expected) => {
    serveMe(globalRoles);

    const result = await renderAuth();

    expect(result.current).toMatchObject(expected);
  });

  it("ignores global roles other than the staff ones", async () => {
    serveMe(["Operator"]);

    const result = await renderAuth();

    expect(result.current).toMatchObject({
      isSuperAdmin: false,
      canManageAccounts: false,
    });
  });

  it.each([
    ["SupportProvider", ["SupportProvider"]],
    ["AccountManager", ["AccountManager"]],
  ])("ignores %s on a self-hosted deployment", async (_, globalRoles) => {
    vi.mocked(useEnv).mockReturnValue(selfHostedEnv);
    serveMe(globalRoles);

    const result = await renderAuth();

    expect(result.current.user?.global_roles).toEqual(globalRoles);
    expect(result.current).toMatchObject({
      isSuperAdmin: false,
      canManageAccounts: false,
    });
  });

  it("defaults global_roles to [] when GET /me omits the field", async () => {
    serveMe(undefined);

    const result = await renderAuth();

    expect(result.current.user?.global_roles).toEqual([]);
    expect(result.current).toMatchObject({
      isSuperAdmin: false,
      canManageAccounts: false,
    });
  });
});
