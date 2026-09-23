import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderHookWithAppProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { useGetStaffPeople } from "./useGetStaffPeople";

describe("useGetStaffPeople", () => {
  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  it("stays idle until the search is 3 characters long", async () => {
    const { result, rerender } = renderHook(
      ({ search }) => useGetStaffPeople({ search }),
      {
        initialProps: { search: "ja" },
        wrapper: renderHookWithAppProviders(),
      },
    );

    expect(result.current.isGettingStaffPeople).toBe(false);
    expect(result.current.staffPeople).toEqual([]);

    rerender({ search: "jane" });

    await waitFor(() => {
      expect(result.current.staffPeopleCount).toBe(4);
    });
  });

  it("passes the type filter through", async () => {
    const { result } = renderHook(
      () => useGetStaffPeople({ search: "jane", type: "invitation" }),
      { wrapper: renderHookWithAppProviders() },
    );

    await waitFor(() => {
      expect(result.current.isGettingStaffPeople).toBe(false);
    });

    expect(result.current.staffPeople.map(({ type }) => type)).toEqual([
      "invitation",
      "invitation",
    ]);
  });
});
