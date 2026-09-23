import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderHookWithAppProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { useGetStaffAccount } from "./useGetStaffAccount";

describe("useGetStaffAccount", () => {
  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  it("returns the account in full", async () => {
    const { result } = renderHook(() => useGetStaffAccount("acme"), {
      wrapper: renderHookWithAppProviders(),
    });

    await waitFor(() => {
      expect(result.current.isGettingStaffAccount).toBe(false);
    });

    expect(result.current.staffAccount).toMatchObject({
      account: "acme",
      company: "ACME Corp",
      disabled_reason: null,
      max_people_count: 10,
      max_attachment_size: 1048576,
    });
  });

  it("returns null for an unknown account", async () => {
    const { result } = renderHook(() => useGetStaffAccount("no-such-account"), {
      wrapper: renderHookWithAppProviders(),
    });

    await waitFor(() => {
      expect(result.current.isGettingStaffAccount).toBe(false);
    });

    expect(result.current.staffAccount).toBeNull();
  });
});
