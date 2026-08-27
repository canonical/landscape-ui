import { describe, expect, it } from "vitest";
import { hasEditUserChanges } from "./helpers";

describe("hasEditUserChanges", () => {
  it("returns false for an identity-only payload", () => {
    expect(hasEditUserChanges({ computer_ids: [1], username: "user1" })).toBe(
      false,
    );
  });

  it("returns true when a profile field changes", () => {
    expect(
      hasEditUserChanges({
        computer_ids: [1],
        username: "user1",
        location: "London",
      }),
    ).toBe(true);
  });
});
