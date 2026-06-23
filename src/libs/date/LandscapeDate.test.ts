import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import date, { LandscapeDate } from "./index";

const FIXED_NOW = new Date("2024-03-15T10:30:00Z").getTime();

describe("LandscapeDate factory", () => {
  it("returns the current time when called with no arguments", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date().getTime()).toBe(FIXED_NOW);

    vi.useRealTimers();
  });

  it("returns the current time for undefined input (matching moment)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date(undefined).isValid()).toBe(true);
    expect(date(undefined).getTime()).toBe(FIXED_NOW);

    vi.useRealTimers();
  });

  it("treats null and empty string as invalid (matching moment)", () => {
    expect(date(null).isValid()).toBe(false);
    expect(date("").isValid()).toBe(false);
  });

  it("clones a Date instance", () => {
    const native = new Date("2024-01-02T03:04:05Z");
    expect(date(native).getTime()).toBe(native.getTime());
  });

  it("clones another LandscapeDate preserving the utc mode", () => {
    const utc = date("2024-01-02T03:04:05Z").utc();
    const clone = date(utc);
    expect(clone.format("HH:mm")).toBe(utc.format("HH:mm"));
  });
});

describe("validity", () => {
  it("flags unparseable strings as invalid", () => {
    expect(date("not-a-date").isValid()).toBe(false);
  });

  it("formats invalid dates as 'Invalid date'", () => {
    expect(date("nonsense").format("YYYY")).toBe("Invalid date");
  });
});

describe("strict ISO 8601 parsing", () => {
  it("accepts valid ISO strings", () => {
    expect(date("2024-03-15T10:30:00Z", date.ISO_8601, true).isValid()).toBe(
      true,
    );
    expect(date("2024-03-15", date.ISO_8601, true).isValid()).toBe(true);
    expect(
      date("2024-03-15T10:30:00+02:00", date.ISO_8601, true).isValid(),
    ).toBe(true);
  });

  it("rejects non-ISO strings in strict mode", () => {
    expect(date("03/15/2024", date.ISO_8601, true).isValid()).toBe(false);
    expect(date("15-03-2024", date.ISO_8601, true).isValid()).toBe(false);
    expect(date("garbage", date.ISO_8601, true).isValid()).toBe(false);
  });
});

describe("local parsing", () => {
  it("parses date-only strings as local midnight", () => {
    const parsed = date("2024-03-15");
    expect(parsed.format("YYYY-MM-DD")).toBe("2024-03-15");
    expect(parsed.format("HH:mm:ss")).toBe("00:00:00");
  });

  it("parses datetime-local strings without timezone as local time", () => {
    const parsed = date("2024-03-15T14:45");
    expect(parsed.format("YYYY-MM-DDTHH:mm")).toBe("2024-03-15T14:45");
  });
});

describe("formatting tokens", () => {
  const subject = date("2024-03-05T09:07:08Z").utc();

  it("formats common display patterns", () => {
    expect(subject.format("MMM D, YYYY")).toBe("Mar 5, 2024");
    expect(subject.format("MMM DD, YYYY, HH:mm")).toBe("Mar 05, 2024, 09:07");
    expect(subject.format("YYYY-MM-DD")).toBe("2024-03-05");
    expect(subject.format("YYYY-MM-DDTHH:mm:ss")).toBe("2024-03-05T09:07:08");
  });

  it("handles bracket literals", () => {
    expect(subject.format("YYYY-MM-DDTHH:mm:ss[Z]")).toBe(
      "2024-03-05T09:07:08Z",
    );
    expect(subject.format("YYYYMMDDTHHmmss")).toBe("20240305T090708");
    expect(subject.format("MMM DD, YYYY, HH:mm [UTC]")).toBe(
      "Mar 05, 2024, 09:07 UTC",
    );
  });

  it("formats weekday names for the calendar use case", () => {
    expect(subject.format("dddd")).toBe("Tuesday");
  });
});

describe("utc and local modes", () => {
  it("formats UTC fields in utc mode", () => {
    const subject = date("2024-03-15T23:30:00Z");
    expect(subject.utc().format("YYYY-MM-DDTHH:mm:ss")).toBe(
      "2024-03-15T23:30:00",
    );
  });

  it("utc(true) keeps the wall-clock time", () => {
    const subject = date("2024-03-15T14:00:00");
    const keptLocal = subject.utc(true);
    expect(keptLocal.format("YYYY-MM-DDTHH:mm:ss")).toBe(
      "2024-03-15T14:00:00",
    );
  });

  it("toISOString always returns UTC", () => {
    expect(date("2024-03-15T10:30:00Z").toISOString()).toBe(
      "2024-03-15T10:30:00.000Z",
    );
  });
});

describe("comparisons", () => {
  const earlier = date("2024-03-15T10:00:00Z");
  const later = date("2024-03-15T12:00:00Z");

  it("compares with isAfter / isSameOrAfter / isSameOrBefore", () => {
    expect(later.isAfter(earlier)).toBe(true);
    expect(earlier.isAfter(later)).toBe(false);
    expect(later.isSameOrAfter(earlier)).toBe(true);
    expect(earlier.isSameOrBefore(later)).toBe(true);
    expect(earlier.isSameOrBefore(earlier)).toBe(true);
  });

  it("isAfter() with no argument compares to now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date("2025-01-01T00:00:00Z").isAfter()).toBe(true);
    expect(date("2020-01-01T00:00:00Z").isAfter()).toBe(false);

    vi.useRealTimers();
  });

  it("diff returns milliseconds by default and supports days", () => {
    expect(later.diff(earlier)).toBe(2 * 60 * 60 * 1000);
    expect(
      date("2024-03-20T00:00:00Z").diff(date("2024-03-15T00:00:00Z"), "days"),
    ).toBe(5);
  });
});

describe("arithmetic", () => {
  const subject = date("2024-03-15T10:00:00Z").utc();

  it("adds and subtracts units", () => {
    expect(subject.add(5, "minutes").format("HH:mm")).toBe("10:05");
    expect(subject.add(2, "days").format("YYYY-MM-DD")).toBe("2024-03-17");
    expect(subject.subtract(1, "day").format("YYYY-MM-DD")).toBe("2024-03-14");
  });
});

describe("calendar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-15T12:00:00Z").getTime());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const formats = {
    sameElse: "MMM DD, YYYY, HH:mm [UTC]",
    lastWeek: "[Last] dddd, HH:mm [UTC]",
    sameDay: "[Today], HH:mm [UTC]",
    lastDay: "[Yesterday], HH:mm [UTC]",
  };

  it("uses the sameDay label for today", () => {
    expect(date("2024-03-15T08:30:00Z").utc().calendar(formats)).toBe(
      "Today, 08:30 UTC",
    );
  });

  it("uses the lastDay label for yesterday", () => {
    expect(date("2024-03-14T08:30:00Z").utc().calendar(formats)).toBe(
      "Yesterday, 08:30 UTC",
    );
  });

  it("uses the lastWeek label within the past week", () => {
    expect(date("2024-03-11T08:30:00Z").utc().calendar(formats)).toBe(
      "Last Monday, 08:30 UTC",
    );
  });

  it("falls back to sameElse for older dates", () => {
    expect(date("2024-01-01T08:30:00Z").utc().calendar(formats)).toBe(
      "Jan 01, 2024, 08:30 UTC",
    );
  });
});

describe("LandscapeDate class export", () => {
  it("exposes a now() helper", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(LandscapeDate.now().getTime()).toBe(FIXED_NOW);

    vi.useRealTimers();
  });
});
