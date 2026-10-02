import { describe, expect, it } from "vitest";
import { getRequestAction, hasNotification } from "./helpers";

describe("getRequestAction", () => {
  it("maps 'uninstall' to 'remove'", () => {
    expect(getRequestAction("uninstall")).toBe("remove");
  });

  it("maps 'change channel' to 'refresh'", () => {
    expect(getRequestAction("change channel")).toBe("refresh");
  });

  it("returns the action unchanged for other actions", () => {
    expect(getRequestAction("install")).toBe("install");
    expect(getRequestAction("refresh")).toBe("refresh");
    expect(getRequestAction("hold")).toBe("hold");
    expect(getRequestAction("unhold")).toBe("unhold");
  });
});

describe("hasNotification", () => {
  it("returns true for actions with a notification", () => {
    expect(hasNotification("hold")).toBe(true);
  });

  it("returns false for actions without a notification", () => {
    expect(hasNotification("uninstall")).toBe(false);
    expect(hasNotification("refresh")).toBe(false);
    expect(hasNotification("unhold")).toBe(false);
    expect(hasNotification("install")).toBe(false);
    expect(hasNotification("change channel")).toBe(false);
  });
});
