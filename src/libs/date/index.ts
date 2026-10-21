import type { CalendarFormats, DateInput } from "./ChronoDate";
import { ISO_8601, ChronoDate } from "./ChronoDate";

interface DateFactory {
  (input?: DateInput, format?: typeof ISO_8601, strict?: boolean): ChronoDate;
  ISO_8601: typeof ISO_8601;
}

/**
 * Date factory providing the entry point over ChronoDate.
 *
 * Usage:
 *   date()                          // now
 *   date(value)                     // parse a value
 *   date(value, date.ISO_8601, true) // strict ISO 8601 validation
 */
const date = ((
  input?: DateInput,
  format?: typeof ISO_8601,
  strict?: boolean,
) => {
  if (format === ISO_8601) {
    return ChronoDate.parseStrictISO(String(input), strict);
  }

  return ChronoDate.from(input);
}) as DateFactory;

date.ISO_8601 = ISO_8601;

const ZONELESS_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

/** Read server timestamps as UTC when no timezone is specified. */
export const parseServerDateTime = (value: string) =>
  date(
    ZONELESS_DATE_TIME_REGEX.test(value.trim()) ? `${value.trim()}Z` : value,
  );

export default date;
export { ChronoDate, ISO_8601 };
export type { CalendarFormats, DateInput };
