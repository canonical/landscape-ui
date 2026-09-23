import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderHookWithAppProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { useEditStaffAccount } from "./useEditStaffAccount";
import { useGetStaffAccount } from "./useGetStaffAccount";

const NEW_MAX_PEOPLE_COUNT = 25;

describe("useEditStaffAccount", () => {
  beforeEach(() => {
    setStaffGlobalRoles(["AccountManager"]);
  });

  it("patches the account and refreshes its cached copy", async () => {
    const { result } = renderHook(
      () => ({
        account: useGetStaffAccount("globex"),
        edit: useEditStaffAccount(),
      }),
      { wrapper: renderHookWithAppProviders() },
    );

    await waitFor(() => {
      expect(result.current.account.staffAccount?.max_people_count).toBe(10);
    });

    await act(async () => {
      await result.current.edit.editStaffAccount({
        name: "globex",
        max_people_count: NEW_MAX_PEOPLE_COUNT,
      });
    });

    await waitFor(() => {
      expect(result.current.account.staffAccount?.max_people_count).toBe(
        NEW_MAX_PEOPLE_COUNT,
      );
    });
  });

  it("sends null through to clear a field", async () => {
    const { result } = renderHook(() => useEditStaffAccount(), {
      wrapper: renderHookWithAppProviders(),
    });

    const response = await act(async () =>
      result.current.editStaffAccount({
        name: "acme",
        salesforce_account_key: null,
      }),
    );

    expect(response.data.salesforce_account_key).toBeNull();
  });
});
