import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { authResponse } from "@/tests/mocks/auth";
import { renderHookWithProviders } from "@/tests/render";
import server from "@/tests/server";

// Self-hosted needs no case of its own: Canonical staff cannot log in there,
// so every self-hosted user has no staff role, which is the first case below.

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
  });

  return result;
};

describe("AuthProvider super admin gating (integration)", () => {
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
