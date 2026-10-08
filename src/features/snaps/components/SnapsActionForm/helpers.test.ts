import { describe, expect, it } from "vitest";
import {
  getActionVerb,
  getChangeChannelVerb,
  getRequestAction,
  hasNotification,
} from "./helpers";

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

describe("getChangeChannelVerb", () => {
  it("returns 'change channel or revision' when both modes are present", () => {
    expect(getChangeChannelVerb(["channel", "revision"])).toBe(
      "change channel or revision",
    );
  });

  it("returns 'change revision' when only revision mode is present", () => {
    expect(getChangeChannelVerb(["revision"])).toBe("change revision");
  });

  it("returns 'change channel' when only channel mode is present", () => {
    expect(getChangeChannelVerb(["channel"])).toBe("change channel");
  });

  it("defaults to 'change channel' when changeModes is empty", () => {
    expect(getChangeChannelVerb([])).toBe("change channel");
  });
});

describe("getActionVerb", () => {
  it("returns the appropriate change channel verb for 'change channel' action", () => {
    expect(getActionVerb("change channel", ["revision"])).toBe(
      "change revision",
    );
    expect(getActionVerb("change channel", ["channel", "revision"])).toBe(
      "change channel or revision",
    );
    expect(getActionVerb("change channel", ["channel"])).toBe("change channel");
    expect(getActionVerb("change channel", [])).toBe("change channel");
  });

  it("returns the original action for non-change-channel actions", () => {
    expect(getActionVerb("install", ["revision"])).toBe("install");
    expect(getActionVerb("uninstall", ["channel", "revision"])).toBe(
      "uninstall",
    );
    expect(getActionVerb("refresh")).toBe("refresh");
    expect(getActionVerb("hold")).toBe("hold");
    expect(getActionVerb("unhold")).toBe("unhold");
  });
});
