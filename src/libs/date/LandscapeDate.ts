/**
 * LandscapeDate is a small wrapper around the native `Date` object. It
 * centralizes the date behavior and call style the Landscape UI relies on.
 *
 * It intentionally implements only the subset used in this codebase, delegating
 * to native `Date` for arithmetic, comparison and serialization and
 * adding a small token-based formatter that the native APIs do not provide.
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MS_PER_DAY = 86_400_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_MINUTE = 60_000;
const HOURS_PER_HALF_DAY = 12;
const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;
const FEBRUARY = 2;
const APRIL = 4;
const JUNE = 6;
const SEPTEMBER = 9;
const NOVEMBER = 11;
const DAYS_IN_FEBRUARY = 28;
const DAYS_IN_LEAP_YEAR_FEBRUARY = 29;
const DAYS_IN_SHORT_MONTH = 30;
const DAYS_IN_LONG_MONTH = 31;
const LEAP_YEAR_CENTURY = 100;
const LEAP_YEAR_FULL_CYCLE = 400;
const MAX_HOUR = 23;
const MAX_MINUTE_OR_SECOND = 59;

/** Sentinel used for strict ISO 8601 parsing. */
export const ISO_8601 = Symbol("ISO_8601");

const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

const DATE_TIME_NO_TZ_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/;

const ISO_8601_PARTS_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{2}):?(\d{2}))?)?$/;

const FORMAT_TOKEN_REGEX =
  /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|HH|H|hh|h|mm|m|ss|s|A|a/g;

type AddUnit =
  | "millisecond"
  | "milliseconds"
  | "second"
  | "seconds"
  | "minute"
  | "minutes"
  | "hour"
  | "hours"
  | "day"
  | "days"
  | "week"
  | "weeks"
  | "month"
  | "months"
  | "year"
  | "years";

type DiffUnit =
  | "millisecond"
  | "milliseconds"
  | "second"
  | "seconds"
  | "minute"
  | "minutes"
  | "hour"
  | "hours"
  | "day"
  | "days";

export interface CalendarFormats {
  sameDay?: string;
  nextDay?: string;
  nextWeek?: string;
  lastDay?: string;
  lastWeek?: string;
  sameElse: string;
}

export type DateInput =
  | LandscapeDate
  | Date
  | string
  | number
  | null
  | undefined;

interface DateFields {
  Y: number;
  Mo: number;
  D: number;
  H: number;
  Mi: number;
  S: number;
  Ms: number;
  Wd: number;
}

const pad = (value: number, length = 2): string =>
  String(Math.abs(value)).padStart(length, "0");

const to12Hour = (hour: number): number => {
  const h = hour % HOURS_PER_HALF_DAY;
  return h === 0 ? HOURS_PER_HALF_DAY : h;
};

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 &&
  (year % LEAP_YEAR_CENTURY !== 0 || year % LEAP_YEAR_FULL_CYCLE === 0);

const getDaysInMonth = (year: number, month: number): number => {
  if (month === FEBRUARY) {
    return isLeapYear(year) ? DAYS_IN_LEAP_YEAR_FEBRUARY : DAYS_IN_FEBRUARY;
  }

  return [APRIL, JUNE, SEPTEMBER, NOVEMBER].includes(month)
    ? DAYS_IN_SHORT_MONTH
    : DAYS_IN_LONG_MONTH;
};

const parseMilliseconds = (milliseconds?: string): number =>
  milliseconds ? Math.trunc(Number(`0.${milliseconds}`) * 1000) : 0;

const hasValidDateTimeParts = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): boolean =>
  month >= 1 &&
  month <= MONTHS_PER_YEAR &&
  day >= 1 &&
  day <= getDaysInMonth(year, month) &&
  hour >= 0 &&
  hour <= MAX_HOUR &&
  minute >= 0 &&
  minute <= MAX_MINUTE_OR_SECOND &&
  second >= 0 &&
  second <= MAX_MINUTE_OR_SECOND;

const createLocalTime = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
): number => {
  if (!hasValidDateTimeParts(year, month, day, hour, minute, second)) {
    return NaN;
  }

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(hour, minute, second, millisecond);
  return date.getTime();
};

const hasValidTimezoneOffset = (
  offsetHour?: string,
  offsetMinute?: string,
): boolean =>
  offsetHour === undefined ||
  (Number(offsetHour) <= MAX_HOUR &&
    Number(offsetMinute) <= MAX_MINUTE_OR_SECOND);

const parseStrictIsoTime = (input: string): number => {
  const parts = ISO_8601_PARTS_REGEX.exec(input);
  if (!parts) {
    return NaN;
  }

  const [, y, m, d, h, min, s, ms, z, offsetSign, offsetHour, offsetMinute] =
    parts;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  const hour = Number(h ?? 0);
  const minute = Number(min ?? 0);
  const second = Number(s ?? 0);

  if (
    !hasValidDateTimeParts(year, month, day, hour, minute, second) ||
    !hasValidTimezoneOffset(offsetHour, offsetMinute)
  ) {
    return NaN;
  }

  if (z || offsetSign) {
    return new Date(input).getTime();
  }

  return createLocalTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    parseMilliseconds(ms),
  );
};

const parseString = (value: string): number => {
  const input = value.trim();

  if (!input) {
    return NaN;
  }

  if (ISO_8601_PARTS_REGEX.test(input)) {
    return parseStrictIsoTime(input);
  }

  const dateOnly = DATE_ONLY_REGEX.exec(input);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return createLocalTime(Number(y), Number(m), Number(d));
  }

  const dateTime = DATE_TIME_NO_TZ_REGEX.exec(input);
  if (dateTime) {
    const [, y, m, d, h, min, s, ms] = dateTime;
    return createLocalTime(
      Number(y),
      Number(m),
      Number(d),
      Number(h),
      Number(min),
      Number(s ?? 0),
      parseMilliseconds(ms),
    );
  }

  return new Date(input).getTime();
};

const FORMAT_TOKENS: Record<string, (fields: DateFields) => string> = {
  YYYY: (f) => pad(f.Y, 4),
  YY: (f) => pad(f.Y % 100),
  MMMM: (f) => MONTHS_LONG[f.Mo] ?? "",
  MMM: (f) => MONTHS_SHORT[f.Mo] ?? "",
  MM: (f) => pad(f.Mo + 1),
  M: (f) => String(f.Mo + 1),
  DD: (f) => pad(f.D),
  D: (f) => String(f.D),
  dddd: (f) => WEEKDAYS_LONG[f.Wd] ?? "",
  ddd: (f) => WEEKDAYS_SHORT[f.Wd] ?? "",
  dd: (f) => (WEEKDAYS_SHORT[f.Wd] ?? "").slice(0, 2),
  HH: (f) => pad(f.H),
  H: (f) => String(f.H),
  hh: (f) => pad(to12Hour(f.H)),
  h: (f) => String(to12Hour(f.H)),
  mm: (f) => pad(f.Mi),
  m: (f) => String(f.Mi),
  ss: (f) => pad(f.S),
  s: (f) => String(f.S),
  A: (f) => (f.H < HOURS_PER_HALF_DAY ? "AM" : "PM"),
  a: (f) => (f.H < HOURS_PER_HALF_DAY ? "am" : "pm"),
};

export class LandscapeDate {
  private readonly _time: number;
  private readonly _utc: boolean;

  constructor(time: number, utc = false) {
    this._time = time;
    this._utc = utc;
  }

  static now(): LandscapeDate {
    return new LandscapeDate(Date.now(), false);
  }

  static from(input: DateInput): LandscapeDate {
    if (input === undefined) {
      return LandscapeDate.now();
    }

    if (input === null) {
      return new LandscapeDate(NaN, false);
    }

    if (input instanceof LandscapeDate) {
      return new LandscapeDate(input._time, input._utc);
    }

    if (input instanceof Date) {
      return new LandscapeDate(input.getTime(), false);
    }

    if (typeof input === "number") {
      return new LandscapeDate(input, false);
    }

    return new LandscapeDate(parseString(input), false);
  }

  static parseStrictISO(value: string, strict?: boolean): LandscapeDate {
    if (strict && !ISO_8601_REGEX.test(value.trim())) {
      return new LandscapeDate(NaN, false);
    }

    return new LandscapeDate(parseString(value), false);
  }

  private fields(): DateFields {
    const date = new Date(this._time);

    if (this._utc) {
      return {
        Y: date.getUTCFullYear(),
        Mo: date.getUTCMonth(),
        D: date.getUTCDate(),
        H: date.getUTCHours(),
        Mi: date.getUTCMinutes(),
        S: date.getUTCSeconds(),
        Ms: date.getUTCMilliseconds(),
        Wd: date.getUTCDay(),
      };
    }

    return {
      Y: date.getFullYear(),
      Mo: date.getMonth(),
      D: date.getDate(),
      H: date.getHours(),
      Mi: date.getMinutes(),
      S: date.getSeconds(),
      Ms: date.getMilliseconds(),
      Wd: date.getDay(),
    };
  }

  isValid(): boolean {
    return !Number.isNaN(this._time);
  }

  valueOf(): number {
    return this._time;
  }

  getTime(): number {
    return this._time;
  }

  toDate(): Date {
    return new Date(this._time);
  }

  utc(keepLocalTime = false): LandscapeDate {
    if (keepLocalTime && !this._utc) {
      const date = new Date(this._time);
      const time = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      );

      return new LandscapeDate(time, true);
    }

    return new LandscapeDate(this._time, true);
  }

  local(): LandscapeDate {
    return new LandscapeDate(this._time, false);
  }

  add(amount: number, unit: AddUnit): LandscapeDate {
    return this.shift(amount, unit);
  }

  subtract(amount: number, unit: AddUnit): LandscapeDate {
    return this.shift(-amount, unit);
  }

  private shift(amount: number, unit: AddUnit): LandscapeDate {
    switch (unit) {
      case "millisecond":
      case "milliseconds":
        return new LandscapeDate(this._time + amount, this._utc);
      case "second":
      case "seconds":
        return new LandscapeDate(this._time + amount * 1000, this._utc);
      case "minute":
      case "minutes":
        return new LandscapeDate(
          this._time + amount * MS_PER_MINUTE,
          this._utc,
        );
      case "hour":
      case "hours":
        return new LandscapeDate(this._time + amount * MS_PER_HOUR, this._utc);
      case "day":
      case "days":
        return this.shiftCalendarDays(amount);
      case "week":
      case "weeks":
        return this.shiftCalendarDays(amount * DAYS_PER_WEEK);
      case "month":
      case "months": {
        const date = new Date(this._time);
        if (this._utc) {
          date.setUTCMonth(date.getUTCMonth() + amount);
        } else {
          date.setMonth(date.getMonth() + amount);
        }
        return new LandscapeDate(date.getTime(), this._utc);
      }
      case "year":
      case "years": {
        const date = new Date(this._time);
        if (this._utc) {
          date.setUTCFullYear(date.getUTCFullYear() + amount);
        } else {
          date.setFullYear(date.getFullYear() + amount);
        }
        return new LandscapeDate(date.getTime(), this._utc);
      }
      default:
        return new LandscapeDate(this._time, this._utc);
    }
  }

  private shiftCalendarDays(amount: number): LandscapeDate {
    const date = new Date(this._time);

    if (this._utc) {
      date.setUTCDate(date.getUTCDate() + amount);
    } else {
      date.setDate(date.getDate() + amount);
    }

    return new LandscapeDate(date.getTime(), this._utc);
  }

  diff(other: DateInput, unit?: DiffUnit): number {
    const target = LandscapeDate.from(other);
    const difference = this._time - target._time;

    switch (unit) {
      case "second":
      case "seconds":
        return Math.trunc(difference / 1000);
      case "minute":
      case "minutes":
        return Math.trunc(difference / MS_PER_MINUTE);
      case "hour":
      case "hours":
        return Math.trunc(difference / MS_PER_HOUR);
      case "day":
      case "days": {
        const zoneDelta =
          (this.getTimezoneOffset() - target.getTimezoneOffset()) *
          MS_PER_MINUTE;
        return Math.trunc((difference - zoneDelta) / MS_PER_DAY);
      }
      case "millisecond":
      case "milliseconds":
      default:
        return difference;
    }
  }

  private getTimezoneOffset(): number {
    return this._utc ? 0 : new Date(this._time).getTimezoneOffset();
  }

  isAfter(other?: DateInput): boolean {
    const target =
      other === undefined ? LandscapeDate.now() : LandscapeDate.from(other);
    return this._time > target._time;
  }

  isBefore(other?: DateInput): boolean {
    const target =
      other === undefined ? LandscapeDate.now() : LandscapeDate.from(other);
    return this._time < target._time;
  }

  isSameOrAfter(other: DateInput): boolean {
    return this._time >= LandscapeDate.from(other)._time;
  }

  isSameOrBefore(other: DateInput): boolean {
    return this._time <= LandscapeDate.from(other)._time;
  }

  toISOString(): string {
    return this.isValid() ? new Date(this._time).toISOString() : "";
  }

  format(pattern?: string): string {
    if (!this.isValid()) {
      return "Invalid date";
    }

    const fields = this.fields();

    if (pattern === undefined) {
      return this.defaultFormat(fields);
    }

    return pattern.replace(FORMAT_TOKEN_REGEX, (token, literal?: string) => {
      if (literal !== undefined) {
        return literal;
      }

      return this.formatToken(token, fields);
    });
  }

  private formatToken(token: string, fields: DateFields): string {
    const formatter = FORMAT_TOKENS[token];
    return formatter ? formatter(fields) : token;
  }

  private defaultFormat(fields: DateFields): string {
    const base = `${pad(fields.Y, 4)}-${pad(fields.Mo + 1)}-${pad(
      fields.D,
    )}T${pad(fields.H)}:${pad(fields.Mi)}:${pad(fields.S)}`;

    if (this._utc) {
      return `${base}Z`;
    }

    const offsetMinutes = new Date(this._time).getTimezoneOffset();
    const sign = offsetMinutes <= 0 ? "+" : "-";
    const absolute = Math.abs(offsetMinutes);

    return `${base}${sign}${pad(Math.floor(absolute / 60))}:${pad(
      absolute % 60,
    )}`;
  }

  calendar(formats: CalendarFormats): string {
    const dayIndex = (date: LandscapeDate): number => {
      const f = date.fields();
      return Math.floor(Date.UTC(f.Y, f.Mo, f.D) / MS_PER_DAY);
    };

    const reference = this._utc
      ? LandscapeDate.now().utc()
      : LandscapeDate.now();
    const delta = dayIndex(this) - dayIndex(reference);

    let pattern: string | undefined;

    if (delta === 0) {
      pattern = formats.sameDay;
    } else if (delta === -1) {
      pattern = formats.lastDay;
    } else if (delta === 1) {
      pattern = formats.nextDay;
    } else if (delta > -DAYS_PER_WEEK && delta < 0) {
      pattern = formats.lastWeek;
    } else if (delta < DAYS_PER_WEEK && delta > 1) {
      pattern = formats.nextWeek;
    }

    return this.format(pattern ?? formats.sameElse);
  }
}
