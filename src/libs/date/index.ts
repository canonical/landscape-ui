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

export default date;
export { ChronoDate, ISO_8601 };
export type { CalendarFormats, DateInput };
