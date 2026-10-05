/* eslint @typescript-eslint/no-magic-numbers: 0 */
import { describe, it, expect } from "vitest";
import { formatSecondsRemaining, getEtaLabel } from "./helpers";

describe("formatSecondsRemaining", () => {
  it('formats seconds as "Xs" when under a minute', () => {
    expect(formatSecondsRemaining(30)).toBe("30s");
  });

  it("rounds to the nearest second", () => {
    expect(formatSecondsRemaining(30.7)).toBe("31s");
  });

  it("clamps to zero for negative values", () => {
    expect(formatSecondsRemaining(-5)).toBe("0s");
  });

  it('formats as "Xm" for whole minutes', () => {
    expect(formatSecondsRemaining(120)).toBe("2m");
  });

  it('formats as "Xm Ys" for minutes with remainder', () => {
    expect(formatSecondsRemaining(150)).toBe("2m 30s");
  });

  it('formats as "Xh Ym" for hours with remainder minutes', () => {
    expect(formatSecondsRemaining(19800)).toBe("5h 30m");
  });

  it('formats as "Xh" for whole hours', () => {
    expect(formatSecondsRemaining(7200)).toBe("2h");
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
    expect(getEtaLabel(120)).toBe("2m");
  });
});
