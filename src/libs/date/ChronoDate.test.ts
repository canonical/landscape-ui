import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import date, { ChronoDate } from "./index";

const FIXED_NOW = new Date("2024-03-15T10:30:00Z").getTime();
const DAYS_ACROSS_DST_CHANGE = 14;
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = 60_000;
const ONE_HOUR_MS = 3_600_000;
const PARSED_MILLISECONDS = 456;

describe("ChronoDate factory", () => {
  it("returns the current time when called with no arguments", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date().getTime()).toBe(FIXED_NOW);

    vi.useRealTimers();
  });

  it("returns the current time for undefined input", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date(undefined).isValid()).toBe(true);
    expect(date(undefined).getTime()).toBe(FIXED_NOW);

    vi.useRealTimers();
  });

  it("treats null and empty string as invalid", () => {
    expect(date(null).isValid()).toBe(false);
    expect(date("").isValid()).toBe(false);
  });

  it("clones a Date instance", () => {
    const native = new Date("2024-01-02T03:04:05Z");
    expect(date(native).getTime()).toBe(native.getTime());
  });

  it("clones another ChronoDate preserving the utc mode", () => {
    const utc = date("2024-01-02T03:04:05Z").utc();
    const clone = date(utc);
    expect(clone.format("HH:mm")).toBe(utc.format("HH:mm"));
  });

  it("accepts numeric timestamps", () => {
    expect(date(FIXED_NOW).toISOString()).toBe("2024-03-15T10:30:00.000Z");
    expect(date(FIXED_NOW).valueOf()).toBe(FIXED_NOW);
  });
});

describe("validity", () => {
  it("flags unparseable strings as invalid", () => {
    expect(date("not-a-date").isValid()).toBe(false);
  });

  it("flags overflowing date and time parts as invalid", () => {
    expect(date("2024-02-31").isValid()).toBe(false);
    expect(date("2024-00-01").isValid()).toBe(false);
    expect(date("2024-04-31").isValid()).toBe(false);
    expect(date("2024-03-15T24:00").isValid()).toBe(false);
    expect(date("2024-03-15T10:60").isValid()).toBe(false);
    expect(date("2024-03-15T10:30:60").isValid()).toBe(false);
  });

  it("allows leap day only in leap years", () => {
    expect(date("2024-02-29").isValid()).toBe(true);
    expect(date("2023-02-29").isValid()).toBe(false);
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
    expect(
      date("2024-03-15T10:30:00.123+0200", date.ISO_8601, true).isValid(),
    ).toBe(true);
  });

  it("rejects non-ISO strings in strict mode", () => {
    expect(date("03/15/2024", date.ISO_8601, true).isValid()).toBe(false);
    expect(date("15-03-2024", date.ISO_8601, true).isValid()).toBe(false);
    expect(date("garbage", date.ISO_8601, true).isValid()).toBe(false);
  });

  it("rejects overflowing ISO date and time parts in strict mode", () => {
    expect(date("2024-02-31", date.ISO_8601, true).isValid()).toBe(false);
    expect(date("2024-13-01T10:30:00Z", date.ISO_8601, true).isValid()).toBe(
      false,
    );
    expect(date("2024-03-15T99:30:00Z", date.ISO_8601, true).isValid()).toBe(
      false,
    );
    expect(
      date("2024-03-15T10:30:00+25:00", date.ISO_8601, true).isValid(),
    ).toBe(false);
    expect(
      date("2024-03-15T10:30:00+02:99", date.ISO_8601, true).isValid(),
    ).toBe(false);
  });

  it("parses ISO input without strict mode", () => {
    expect(date("2024-03-15", date.ISO_8601).format("YYYY-MM-DD")).toBe(
      "2024-03-15",
    );
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

  it("parses local datetime strings with seconds and milliseconds", () => {
    const parsed = date("2024-03-15T14:45:30.456");
    expect(parsed.format("YYYY-MM-DDTHH:mm:ss")).toBe("2024-03-15T14:45:30");
    expect(parsed.toDate().getMilliseconds()).toBe(PARSED_MILLISECONDS);
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

  it("formats all supported tokens", () => {
    expect(
      subject.format("YY MMMM M D ddd dd H h m s A a [literal] unknown"),
    ).toBe("24 March 3 5 Tue Tu 9 9 7 8 AM am literal unknown");
    expect(date("2024-03-05T15:07:08Z").utc().format("h hh A a")).toBe(
      "3 03 PM pm",
    );
    expect(date("2024-03-05T00:07:08Z").utc().format("h hh")).toBe("12 12");
  });

  it("formats default local and UTC output", () => {
    expect(subject.format()).toBe("2024-03-05T09:07:08Z");
    expect(date("2024-03-05T09:07:08").format()).toMatch(
      /^2024-03-05T09:07:08[+-]\d{2}:\d{2}$/,
    );
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
    expect(keptLocal.format("YYYY-MM-DDTHH:mm:ss")).toBe("2024-03-15T14:00:00");
  });

  it("switches back to local mode", () => {
    const utc = date("2024-03-15T14:00:00Z").utc();
    expect(utc.local().format()).toMatch(
      /^2024-03-15T\d{2}:00:00[+-]\d{2}:\d{2}$/,
    );
  });

  it("toISOString always returns UTC", () => {
    expect(date("2024-03-15T10:30:00Z").toISOString()).toBe(
      "2024-03-15T10:30:00.000Z",
    );
  });

  it("toISOString returns empty string for invalid dates", () => {
    expect(date("not-a-date").toISOString()).toBe("");
  });
});

describe("comparisons", () => {
  const earlier = date("2024-03-15T10:00:00Z");
  const later = date("2024-03-15T12:00:00Z");

  it("compares with isAfter / isSameOrAfter / isSameOrBefore", () => {
    expect(later.isAfter(earlier)).toBe(true);
    expect(earlier.isAfter(later)).toBe(false);
    expect(later.isSameOrAfter(earlier)).toBe(true);
    expect(earlier.isSameOrAfter(later)).toBe(false);
    expect(earlier.isSameOrBefore(later)).toBe(true);
    expect(later.isSameOrBefore(earlier)).toBe(false);
    expect(earlier.isSameOrBefore(earlier)).toBe(true);
  });

  it("compares with isBefore", () => {
    expect(earlier.isBefore(later)).toBe(true);
    expect(later.isBefore(earlier)).toBe(false);
  });

  it("isAfter() with no argument compares to now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date("2025-01-01T00:00:00Z").isAfter()).toBe(true);
    expect(date("2020-01-01T00:00:00Z").isAfter()).toBe(false);

    vi.useRealTimers();
  });

  it("isBefore() with no argument compares to now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(date("2020-01-01T00:00:00Z").isBefore()).toBe(true);
    expect(date("2025-01-01T00:00:00Z").isBefore()).toBe(false);

    vi.useRealTimers();
  });

  it("diff returns milliseconds by default and supports units", () => {
    expect(later.diff(earlier)).toBe(2 * 60 * 60 * 1000);
    expect(later.diff(earlier, "milliseconds")).toBe(2 * 60 * 60 * 1000);
    expect(later.diff(earlier, "seconds")).toBe(2 * 60 * 60);
    expect(later.diff(earlier, "minutes")).toBe(2 * 60);
    expect(later.diff(earlier, "hours")).toBe(2);
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

  it("adds fixed-time units", () => {
    expect(subject.add(ONE_SECOND_MS, "milliseconds").format("HH:mm:ss")).toBe(
      "10:00:01",
    );
    expect(subject.add(1, "second").format("HH:mm:ss")).toBe("10:00:01");
    expect(subject.add(ONE_MINUTE_MS, "milliseconds").format("HH:mm:ss")).toBe(
      "10:01:00",
    );
    expect(subject.add(ONE_HOUR_MS, "milliseconds").format("HH:mm:ss")).toBe(
      "11:00:00",
    );
    expect(subject.add(1, "hour").format("HH:mm:ss")).toBe("11:00:00");
  });

  it("adds calendar units", () => {
    expect(subject.add(1, "week").format("YYYY-MM-DD")).toBe("2024-03-22");
    expect(subject.add(1, "month").format("YYYY-MM-DD")).toBe("2024-04-15");
    expect(subject.add(1, "year").format("YYYY-MM-DD")).toBe("2025-03-15");
    expect(
      date("2024-03-15T10:00:00").add(1, "month").format("YYYY-MM-DD"),
    ).toBe("2024-04-15");
    expect(
      date("2024-03-15T10:00:00").add(1, "year").format("YYYY-MM-DD"),
    ).toBe("2025-03-15");
  });

  it("preserves local wall-clock time when adding days across DST", () => {
    const originalTimezone = process.env.TZ;
    process.env.TZ = "Europe/Berlin";

    try {
      const beforeDstChange = date("2024-03-24T10:00:00");
      const afterDstChange = beforeDstChange.add(
        DAYS_ACROSS_DST_CHANGE,
        "days",
      );

      expect(afterDstChange.format("YYYY-MM-DDTHH:mm")).toBe(
        "2024-04-07T10:00",
      );
      expect(afterDstChange.diff(beforeDstChange, "days")).toBe(
        DAYS_ACROSS_DST_CHANGE,
      );
    } finally {
      if (originalTimezone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimezone;
      }
    }
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

  it("uses the nextDay label for tomorrow", () => {
    expect(
      date("2024-03-16T08:30:00Z")
        .utc()
        .calendar({ ...formats, nextDay: "[Tomorrow], HH:mm [UTC]" }),
    ).toBe("Tomorrow, 08:30 UTC");
  });

  it("uses the lastWeek label within the past week", () => {
    expect(date("2024-03-11T08:30:00Z").utc().calendar(formats)).toBe(
      "Last Monday, 08:30 UTC",
    );
  });

  it("uses the nextWeek label within the next week", () => {
    expect(
      date("2024-03-18T08:30:00Z")
        .utc()
        .calendar({ ...formats, nextWeek: "[Next] dddd, HH:mm [UTC]" }),
    ).toBe("Next Monday, 08:30 UTC");
  });

  it("falls back to sameElse for older dates", () => {
    expect(date("2024-01-01T08:30:00Z").utc().calendar(formats)).toBe(
      "Jan 01, 2024, 08:30 UTC",
    );
  });
});

describe("ChronoDate class export", () => {
  it("exposes a now() helper", () => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);

    expect(ChronoDate.now().getTime()).toBe(FIXED_NOW);

    vi.useRealTimers();
  });
});
