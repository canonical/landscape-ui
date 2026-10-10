import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useAuth from "@/hooks/useAuth";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { authUser } from "@/tests/mocks/auth";
import { useRestoreOwnAccount } from "./useRestoreOwnAccount";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useSwitchAccount");

const FOREIGN_ACCOUNT = "acme";

const signInAs = (currentAccount: string) => {
  vi.mocked(useAuth, { partial: true }).mockReturnValue({
    user: { ...authUser, current_account: currentAccount },
  });
};

describe("useRestoreOwnAccount", () => {
  const switchAccount = vi.fn<(name: string) => Promise<void>>();

  beforeEach(() => {
    switchAccount.mockReset().mockResolvedValue(undefined);
    vi.mocked(useSwitchAccount, { partial: true }).mockReturnValue({
      switchAccount,
    });
  });

  it("hides the account from the render a late switch lands in", async () => {
    signInAs(authUser.current_account);
    const seen: (string | null)[] = [];

    const { rerender } = renderHook(() => {
      const restore = useRestoreOwnAccount();

      seen.push(restore.leavingAccount);

      return restore;
    });

    expect(seen).toEqual([null]);

    // The entry switch lands after the person came back.
    signInAs(FOREIGN_ACCOUNT);
    rerender();

    await waitFor(() => {
      expect(switchAccount).toHaveBeenCalledWith(authUser.current_account);
    });
    // Every render since, including the one before the switch started.
    expect(seen.slice(1)).not.toContain(null);
    expect(seen.at(-1)).toBe(FOREIGN_ACCOUNT);
  });
});
