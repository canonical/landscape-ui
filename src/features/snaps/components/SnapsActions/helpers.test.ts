import { installedSnaps } from "@/tests/mocks/snap";
import { describe, expect, it } from "vitest";
import { getSelectedSnaps, getSnapName } from "./helpers";

describe("SnapsActions helpers", () => {
  describe("getSnapName", () => {
    it("returns the snap name for a single snap", () => {
      expect(getSnapName([installedSnaps[0]])).toBe("Snap 1");
    });

    it("returns a count label for multiple snaps", () => {
      expect(getSnapName([...installedSnaps])).toBe("4 snaps");
    });
  });

  describe("getSelectedSnaps", () => {
    it("returns snaps whose ids are in selectedSnapIds", () => {
      const result = getSelectedSnaps([...installedSnaps], ["1", "3"]);
      expect(result).toHaveLength(2);
      expect(result.map((s) => s.snap.id)).toEqual(["1", "3"]);
    });

    it("returns an empty array when no ids match", () => {
      expect(getSelectedSnaps([...installedSnaps], ["99"])).toHaveLength(0);
    });

    it("returns all snaps when all ids match", () => {
      const ids = installedSnaps.map((s) => s.snap.id);
      expect(getSelectedSnaps([...installedSnaps], ids)).toHaveLength(
        installedSnaps.length,
      );
    });
  });
});
