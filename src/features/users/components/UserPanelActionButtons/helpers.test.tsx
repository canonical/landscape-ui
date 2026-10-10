import { describe, expect, it } from "vitest";
import { users } from "@/tests/mocks/user";
import { getSelectedUsernames, getUserLockStatusCounts } from "./helpers";

describe("UserPanelActionButtons helpers", () => {
  it("returns selected usernames", () => {
    expect(getSelectedUsernames(users.slice(0, 2))).toEqual(
      users.slice(0, 2).map((user) => user.username),
    );
  });

  it("counts locked and unlocked users", () => {
    expect(getUserLockStatusCounts(users.slice(0, 5))).toEqual({
      locked: 2,
      unlocked: 3,
    });
  });
});
