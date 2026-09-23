import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderHookWithAppProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { useEditStaffAccountWslLimits } from "./useEditStaffAccountWslLimits";
import { useGetStaffAccountWslLimits } from "./useGetStaffAccountWslLimits";

describe("useEditStaffAccountWslLimits", () => {
  it("replaces the limits and refreshes the cached ones", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const limits = {
      max_windows_host_machines: 500,
      max_wsl_child_instances_per_host: 5,
      max_wsl_child_instance_profiles: 50,
    };

    const { result } = renderHook(
      () => ({
        limits: useGetStaffAccountWslLimits("acme"),
        edit: useEditStaffAccountWslLimits(),
      }),
      { wrapper: renderHookWithAppProviders() },
    );

    await waitFor(() => {
      expect(result.current.limits.isGettingWslLimits).toBe(false);
    });

    await act(async () => {
      await result.current.edit.editWslLimits({ name: "acme", ...limits });
    });

    await waitFor(() => {
      expect(result.current.limits.wslLimits).toEqual(limits);
    });
  });
});
