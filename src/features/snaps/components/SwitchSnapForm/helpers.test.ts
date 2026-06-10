import { describe, expect, it } from "vitest";
import { availableSnapInfo } from "@/tests/mocks/snap";
import {
  getChannelName,
  getChannelOptions,
  getChannelRevision,
} from "./helpers";

const [snapInfoEmpty, snapInfoWithChannels] = availableSnapInfo;

describe("SwitchSnapForm helpers", () => {
  describe("getChannelOptions", () => {
    it("returns empty array when snapInfo is null", () => {
      expect(getChannelOptions(null)).toEqual([]);
    });

    it("returns empty array when channel-map is empty", () => {
      expect(getChannelOptions(snapInfoEmpty)).toEqual([]);
    });

    it("returns sorted channel options", () => {
      const options = getChannelOptions(snapInfoWithChannels);
      expect(options.length).toBe(2);
      expect(options[0]).toHaveProperty("label");
      expect(options[0]).toHaveProperty("value");
    });

    it("formats option label as 'channel - architecture'", () => {
      const options = getChannelOptions(snapInfoWithChannels);
      const [firstOption] = options;
      expect(firstOption?.label).toMatch(/latest - amd/i);
    });
  });

  describe("getChannelName", () => {
    it("returns undefined when snapInfo is null", () => {
      expect(getChannelName(null, "latest - amd64")).toBeUndefined();
    });

    it("returns the channel name for a matching release value", () => {
      const options = getChannelOptions(snapInfoWithChannels);
      const firstValue = options[0]?.value ?? "";
      const channelName = getChannelName(snapInfoWithChannels, firstValue);
      expect(channelName).toBe("latest");
    });

    it("returns undefined for non-matching release value", () => {
      expect(
        getChannelName(snapInfoWithChannels, "nonexistent - arch"),
      ).toBeUndefined();
    });
  });

  describe("getChannelRevision", () => {
    it("returns undefined when snapInfo is null", () => {
      expect(getChannelRevision(null, "latest - amd64")).toBeUndefined();
    });

    it("returns the revision as a string for a matching release value", () => {
      const options = getChannelOptions(snapInfoWithChannels);
      const firstValue = options[0]?.value ?? "";
      const revision = getChannelRevision(snapInfoWithChannels, firstValue);
      expect(typeof revision).toBe("string");
      expect(Number(revision)).toBeGreaterThan(0);
    });
  });
});
