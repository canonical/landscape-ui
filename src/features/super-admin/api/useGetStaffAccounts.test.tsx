import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderHookWithAppProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { useGetStaffAccounts } from "./useGetStaffAccounts";

describe("useGetStaffAccounts", () => {
  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  it("returns the requested page and the total count", async () => {
    const { result } = renderHook(
      () => useGetStaffAccounts({ limit: 2, offset: 2 }),
      { wrapper: renderHookWithAppProviders() },
    );

    await waitFor(() => {
      expect(result.current.isGettingStaffAccounts).toBe(false);
    });

    expect(result.current.staffAccountsCount).toBe(6);
    expect(result.current.staffAccounts.map(({ account }) => account)).toEqual([
      "initech",
      "jane-free-1",
    ]);
  });

  it("passes the search through", async () => {
    const { result } = renderHook(
      () => useGetStaffAccounts({ search: "lumbergh" }),
      { wrapper: renderHookWithAppProviders() },
    );

    await waitFor(() => {
      expect(result.current.isGettingStaffAccounts).toBe(false);
    });

    expect(result.current.staffAccounts.map(({ account }) => account)).toEqual([
      "initech",
    ]);
  });
});
