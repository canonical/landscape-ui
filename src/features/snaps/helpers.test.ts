import { availableSnapInfo } from "@/tests/mocks/snap";
import { assert, describe, expect, it } from "vitest";
import {
  getChannelConfinement,
  getChannelMapEntry,
  getChannelOptions,
  isValidRevision,
} from "./helpers";
import type { AvailableSnapInfo } from "./types";

type ChannelMapEntry = AvailableSnapInfo["channel-map"][number];

// Snap 3 publishes "latest" as amd64/strict and amd86/classic.
const multiArchSnapInfo = availableSnapInfo.find(
  ({ name }) => name === "Snap 3",
);
assert(multiArchSnapInfo, "Snap 3 fixture not found");
const multiArchChannelMap = [...multiArchSnapInfo["channel-map"]];

const distinctRiskChannelMap: ChannelMapEntry[] = [
  {
    channel: {
      architecture: "amd64",
      name: "latest/edge",
      "released-at": "2022-06-01T00:00:00Z",
      risk: "edge",
      track: "latest",
    },
    confinement: "strict",
    revision: 4,
    version: "1.3.0",
  },
  {
    channel: {
      architecture: "amd64",
      name: "latest/beta",
      "released-at": "2022-03-01T00:00:00Z",
      risk: "beta",
      track: "latest",
    },
    confinement: "strict",
    revision: 3,
    version: "1.2.0",
  },
  {
    channel: {
      architecture: "amd64",
      name: "latest/unrecognized-b",
      "released-at": "2022-07-01T00:00:00Z",
      risk: "custom",
      track: "latest",
    },
    confinement: "strict",
    revision: 5,
    version: "1.4.0",
  },
  {
    channel: {
      architecture: "amd64",
      name: "latest/candidate",
      "released-at": "2022-01-01T00:00:00Z",
      risk: "candidate",
      track: "latest",
    },
    confinement: "strict",
    revision: 2,
    version: "1.1.0",
  },
  {
    channel: {
      architecture: "amd64",
      name: "latest/stable",
      "released-at": "2021-08-01T00:00:00Z",
      risk: "stable",
      track: "latest",
    },
    confinement: "strict",
    revision: 1,
    version: "1.0.0",
  },
  {
    channel: {
      architecture: "amd64",
      name: "latest/unrecognized-a",
      "released-at": "2022-07-01T00:00:00Z",
      risk: "special",
      track: "latest",
    },
    confinement: "strict",
    revision: 6,
    version: "1.5.0",
  },
];

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

    it("sorts channels by risk order with unrecognized risks placed last", () => {
      const options = getChannelOptions(distinctRiskChannelMap);

      expect(options.map(({ value }) => value)).toEqual([
        "latest/stable",
        "latest/candidate",
        "latest/beta",
        "latest/edge",
        "latest/unrecognized-a",
        "latest/unrecognized-b",
      ]);
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

  describe("isValidRevision", () => {
    it("returns true for positive integers", () => {
      expect(isValidRevision("1")).toBe(true);
      expect(isValidRevision("123")).toBe(true);
      expect(isValidRevision(" 42 ")).toBe(true);
    });

    it("returns false for non-positive or non-integer values", () => {
      expect(isValidRevision("0")).toBe(false);
      expect(isValidRevision("-5")).toBe(false);
      expect(isValidRevision("1.5")).toBe(false);
      expect(isValidRevision("abc")).toBe(false);
      expect(isValidRevision("")).toBe(false);
      expect(isValidRevision("   ")).toBe(false);
    });
  });
});
