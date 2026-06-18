/* eslint @typescript-eslint/no-magic-numbers: 0 */
import { describe, it, expect } from "vitest";
import { formatSecondsRemaining, getEtaLabel } from "./helpers";

describe("formatSecondsRemaining", () => {
  it('formats seconds as "Xs left" when under a minute', () => {
    expect(formatSecondsRemaining(30)).toBe("30s left");
  });

  it("rounds to the nearest second", () => {
    expect(formatSecondsRemaining(30.7)).toBe("31s left");
  });

  it("clamps to zero for negative values", () => {
    expect(formatSecondsRemaining(-5)).toBe("0s left");
  });

  it('formats as "Xm left" for whole minutes', () => {
    expect(formatSecondsRemaining(120)).toBe("2m left");
  });

  it('formats as "Xm Ys left" for minutes with remainder', () => {
    expect(formatSecondsRemaining(150)).toBe("2m 30s left");
  });
});

describe("getEtaLabel", () => {
  it('returns "Estimating..." when secondsRemaining is null', () => {
    expect(getEtaLabel(null)).toBe("Estimating...");
  });

  it('returns "Almost done" when within threshold', () => {
    expect(getEtaLabel(3)).toBe("Almost done");
  });

  it("delegates to formatSecondsRemaining for larger values", () => {
    expect(getEtaLabel(120)).toBe("2m left");
  });
});
