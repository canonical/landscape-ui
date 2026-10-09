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

  describe("while the deployment mode is still loading", () => {
    const pendingEnv = {
      ...saasEnv,
      envLoading: true,
      isSaas: false,
      isSelfHosted: false,
    };

    it.each([
      ["SaaS", saasEnv, true],
      ["self-hosted", selfHostedEnv, false],
    ])(
      "keeps staff loading until the mode resolves to %s",
      async (_, resolvedEnv, isSuperAdmin) => {
        vi.mocked(useEnv).mockReturnValue(pendingEnv);
        serveMe(["AccountManager"]);

        const { result, rerender } = renderHook(() => useAuth(), {
          wrapper: renderHookWithProviders(),
        });

        await waitFor(() => {
          expect(result.current.authorized).toBe(true);
        });
        expect(result.current.authLoading).toBe(true);
        expect(result.current.isSuperAdmin).toBe(false);

        vi.mocked(useEnv).mockReturnValue(resolvedEnv);
        rerender();

        await waitFor(() => {
          expect(result.current.authLoading).toBe(false);
        });
        expect(result.current.isSuperAdmin).toBe(isSuperAdmin);
        expect(result.current.canManageAccounts).toBe(isSuperAdmin);

        // With everything else settled, the mode alone holds the gates open.
        vi.mocked(useEnv).mockReturnValue(pendingEnv);
        rerender();

        expect(result.current.authLoading).toBe(true);
        expect(result.current.isSuperAdmin).toBe(false);
      },
    );

    it("does not make everyone else wait for the mode", async () => {
      vi.mocked(useEnv).mockReturnValue(pendingEnv);
      serveMe([]);

      const result = await renderAuth();

      expect(result.current.isSuperAdmin).toBe(false);
    });
  });
});
