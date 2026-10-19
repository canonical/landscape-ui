import { describe, expect, it } from "vitest";
import { buildEditUserPayload, hasEditUserChanges } from "./helpers";
import type { EditUserFormValues } from "./types";

const initialValues: EditUserFormValues = {
  name: "Bob",
  password: "",
  confirmPassword: "",
  location: "Office",
  homePhoneNumber: "555-0001",
  workPhoneNumber: "555-0002",
  primaryGroupValue: "1",
  additionalGroupValue: [],
};

const build = (
  changes: Partial<EditUserFormValues>,
  primaryGroupName?: string,
) =>
  buildEditUserPayload(
    1,
    "bob",
    { ...initialValues, ...changes },
    initialValues,
    primaryGroupName,
  );

describe("buildEditUserPayload", () => {
  it("returns an identity-only payload when nothing changed", () => {
    expect(build({}, "bob")).toEqual({ computer_ids: [1], username: "bob" });
  });

  it("sends null for a cleared location", () => {
    expect(build({ location: "" })).toEqual({
      computer_ids: [1],
      username: "bob",
      location: null,
    });
  });

  it("sends null for cleared phone numbers", () => {
    expect(build({ homePhoneNumber: "", workPhoneNumber: "" })).toEqual({
      computer_ids: [1],
      username: "bob",
      home_phone: null,
      work_phone: null,
    });
  });

  it("sends the string for changed non-empty values", () => {
    expect(
      build({
        location: "Home",
        homePhoneNumber: "",
        workPhoneNumber: "555-0100",
      }),
    ).toEqual({
      computer_ids: [1],
      username: "bob",
      location: "Home",
      home_phone: null,
      work_phone: "555-0100",
    });
  });

  it("sends only the changed name", () => {
    expect(build({ name: "Bob B" })).toEqual({
      computer_ids: [1],
      username: "bob",
      name: "Bob B",
    });
  });

  it("never sends name, password or primary_groupname as null or empty", () => {
    const payload = build({ name: "", password: "", primaryGroupValue: "2" });

    expect(payload).not.toHaveProperty("name");
    expect(payload).not.toHaveProperty("password");
    expect(payload).not.toHaveProperty("primary_groupname");
  });
});

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

  it("returns true when a profile field is cleared", () => {
    expect(
      hasEditUserChanges({
        computer_ids: [1],
        username: "user1",
        location: null,
      }),
    ).toBe(true);
  });
});
