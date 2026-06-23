import type { CalendarFormats, DateInput } from "./LandscapeDate";
import { ISO_8601, LandscapeDate } from "./LandscapeDate";

interface DateFactory {
  (
    input?: DateInput,
    format?: typeof ISO_8601,
    strict?: boolean,
  ): LandscapeDate;
  ISO_8601: typeof ISO_8601;
}

/**
 * Moment-shaped factory used as a drop-in replacement for `moment(...)`.
 *
 * Usage:
 *   date()                          // now
 *   date(value)                     // parse a value
 *   date(value, date.ISO_8601, true) // strict ISO 8601 validation
 */
const date = ((input?: DateInput, format?: typeof ISO_8601, strict?: boolean) => {
  if (format === ISO_8601) {
    return LandscapeDate.parseStrictISO(String(input), strict);
  }

  return LandscapeDate.from(input);
}) as DateFactory;

date.ISO_8601 = ISO_8601;

export default date;
export { LandscapeDate, ISO_8601 };
export type { CalendarFormats, DateInput };
