import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderHookWithAppProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { useGetStaffAccountWslLimits } from "./useGetStaffAccountWslLimits";

describe("useGetStaffAccountWslLimits", () => {
  it("returns the account's limits", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const { result } = renderHook(() => useGetStaffAccountWslLimits("acme"), {
      wrapper: renderHookWithAppProviders(),
    });

    await waitFor(() => {
      expect(result.current.isGettingWslLimits).toBe(false);
    });

    expect(result.current.wslLimits).toEqual({
      max_windows_host_machines: 1000,
      max_wsl_child_instances_per_host: 10,
      max_wsl_child_instance_profiles: 100,
    });
  });
});
