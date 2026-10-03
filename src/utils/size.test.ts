import { describe, expect, it } from "vitest";
import {
  formatSize,
  getUnitBytes,
  toBytes,
  toReadableSize,
  type ReadableSize,
} from "./size";

const KB = 1024;
const MB = KB * KB;
const HALF = 0.5;
const ONE_AND_A_HALF = 1.5;
const NOT_A_WHOLE_UNIT = 1500;
const MANY_KB = 1536;

describe("size", () => {
  describe("getUnitBytes", () => {
    it("knows the size of each unit", () => {
      expect(getUnitBytes("bytes")).toBe(1);
      expect(getUnitBytes("KB")).toBe(KB);
      expect(getUnitBytes("MB")).toBe(MB);
    });
  });

  describe("toReadableSize", () => {
    it.each<[number, ReadableSize]>([
      [0, { value: 0, unit: "MB" }],
      [MB, { value: 1, unit: "MB" }],
      [ONE_AND_A_HALF * MB, { value: MANY_KB, unit: "KB" }],
      [KB, { value: 1, unit: "KB" }],
      [NOT_A_WHOLE_UNIT, { value: NOT_A_WHOLE_UNIT, unit: "bytes" }],
      [1, { value: 1, unit: "bytes" }],
    ])("reads %i bytes as %o", (bytes, readable) => {
      expect(toReadableSize(bytes)).toEqual(readable);
    });

    it("never rounds", () => {
      for (const bytes of [0, 1, KB - 1, KB + 1, MB - 1, MB + KB]) {
        expect(toBytes(toReadableSize(bytes))).toBe(bytes);
      }
    });
  });

  describe("toBytes", () => {
    it("converts whole and fractional units", () => {
      expect(toBytes({ value: 2, unit: "MB" })).toBe(2 * MB);
      expect(toBytes({ value: ONE_AND_A_HALF, unit: "MB" })).toBe(
        ONE_AND_A_HALF * MB,
      );
      expect(toBytes({ value: HALF, unit: "KB" })).toBe(HALF * KB);
      expect(toBytes({ value: NOT_A_WHOLE_UNIT, unit: "bytes" })).toBe(
        NOT_A_WHOLE_UNIT,
      );
    });
  });

  describe("formatSize", () => {
    it.each([
      [MB, "1 MB"],
      [2 * MB, "2 MB"],
      [ONE_AND_A_HALF * MB, "1,536 KB"],
      [KB, "1 KB"],
      [NOT_A_WHOLE_UNIT, "1,500 bytes"],
      [0, "0 MB"],
    ])("formats %i bytes as %s", (bytes, text) => {
      expect(formatSize(bytes)).toBe(text);
    });
  });
});
