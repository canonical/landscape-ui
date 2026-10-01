import { availableSnapInfo } from "@/tests/mocks/snap";
import { assert, describe, expect, it } from "vitest";
import {
  getChannelConfinement,
  getChannelMapEntry,
  getChannelOptions,
} from "./helpers";

// Snap 3 publishes "latest" as amd64/strict and amd86/classic.
const multiArchSnapInfo = availableSnapInfo.find(
  ({ name }) => name === "Snap 3",
);
assert(multiArchSnapInfo, "Snap 3 fixture not found");
const multiArchChannelMap = [...multiArchSnapInfo["channel-map"]];

describe("snaps helpers", () => {
  describe("getChannelOptions", () => {
    it("deduplicates a channel published for multiple architectures", () => {
      expect(getChannelOptions(multiArchChannelMap)).toHaveLength(1);
    });

    it("uses channel.name as both label and value", () => {
      const [option] = getChannelOptions(multiArchChannelMap);

      expect(option?.label).toBe("latest");
      expect(option?.value).toBe("latest");
    });

    it("sorts channels by risk order", () => {
      const options = getChannelOptions(multiArchChannelMap);

      expect(options.map(({ value }) => value)).toEqual(["latest"]);
    });
  });

  describe("getChannelMapEntry", () => {
    it("looks up a channel by name", () => {
      const entry = getChannelMapEntry(multiArchChannelMap, "latest");

      expect(entry?.channel.name).toBe("latest");
    });

    it("returns undefined when the channel is not found", () => {
      expect(
        getChannelMapEntry(multiArchChannelMap, "missing"),
      ).toBeUndefined();
    });
  });

  describe("getChannelConfinement", () => {
    it("returns classic when any architecture is classic, regardless of order", () => {
      expect(getChannelConfinement(multiArchChannelMap, "latest")).toBe(
        "classic",
      );
      expect(
        getChannelConfinement([...multiArchChannelMap].reverse(), "latest"),
      ).toBe("classic");
    });

    it("returns undefined when the channel is not found", () => {
      expect(
        getChannelConfinement(multiArchChannelMap, "missing"),
      ).toBeUndefined();
    });
  });
});
