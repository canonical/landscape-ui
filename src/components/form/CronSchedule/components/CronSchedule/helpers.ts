/* eslint @typescript-eslint/no-magic-numbers: 0 */

import { hasOneItem } from "@/utils/_helpers";

interface CronRange {
  start: number;
  end: number;
  step: number;
}

interface LabelInfo {
  labels: string[];
  offset?: number;
}

interface CronRangeLimits {
  max: number;
  min: number;
}

const CRON_RANGE_LIMITS = {
  MINUTE: {
    min: 0,
    max: 59,
  },

  HOUR: {
    min: 0,
    max: 23,
  },

  DAY_OF_MONTH: {
    min: 1,
    max: 31,
  },

  MONTH: {
    min: 1,
    max: 12,
  },

  DAY_OF_WEEK: {
    min: 0,
    max: 6,
  },
};

const ordinalSuffix = (number: number) => {
  switch (number % 100) {
    case 11:
    case 12:
    case 13:
      return "th";
  }

  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const ordinal = (number: number) => `${number}${ordinalSuffix(number)}`;

const getCronLabel = (value: number, labelInfo?: LabelInfo) =>
  labelInfo
    ? labelInfo.labels[labelInfo.offset ? value - labelInfo.offset : value]
    : value;

const isFullRange = (range: CronRange, limits: CronRangeLimits) =>
  range.start == limits.min && range.end == limits.max && range.step == 1;

const toCronPhrasePart = (
  ranges: CronRange[],
  limits: CronRangeLimits,
  unitOfTime: string,
  prefix?: string,
  labelInfo?: LabelInfo,
) => {
  let phrasePart = "";

  if (ranges.some((range) => isFullRange(range, limits))) {
    return phrasePart;
  }

  if (prefix) {
    phrasePart += ` ${prefix} `;
  }

  const rangeStrings = ranges.map((range) => {
    let rangeString = "";

    if (range.step > 1 || range.start != range.end) {
      rangeString += "every ";
    }

    if (range.step > 1) {
      rangeString += `${ordinal(range.step)} `;
    }

    if (range.start != range.end || range.step > 1) {
      rangeString += unitOfTime;

      if (range.start != limits.min || range.end != limits.max) {
        rangeString += ` from ${getCronLabel(range.start, labelInfo)} through ${getCronLabel(range.end, labelInfo)}`;
      }
    } else if (labelInfo) {
      rangeString += getCronLabel(range.start, labelInfo);
    } else {
      rangeString += `${unitOfTime} ${range.start}`;
    }

    return rangeString;
  });

  phrasePart += rangeStrings.slice(0, -1).join(", ");

  if (rangeStrings.length > 2) {
    phrasePart += ",";
  }
  if (rangeStrings.length > 1) {
    phrasePart += " and ";
  }

  phrasePart += rangeStrings.slice(-1);

  return phrasePart;
};

const toInteger = (valueString: string) => {
  const value = parseFloat(valueString);

  if (!Number.isSafeInteger(value)) {
    throw new Error("Invalid value.");
  }

  return value;
};

const toCronRanges = (
  partString: string,
  limits: CronRangeLimits,
  replacements: Record<string, string> = {},
) =>
  partString.split(",").map((rangeString) => {
    const range: CronRange = {
      start: Number.NaN,
      end: Number.NaN,
      step: 1,
    };

    const setStartAndEnd = (startAndEndString: string) => {
      if (startAndEndString == "*") {
        range.start = limits.min;
        range.end = limits.max;
        return;
      }

      startAndEndString = startAndEndString.replaceAll(
        /[a-zA-Z]+/g,
        (substring) => {
          const replacement = replacements[substring.toUpperCase()];

          if (!replacement) {
            throw new Error("Invalid character.");
          }

          return replacement;
        },
      );

      const [start, end] = startAndEndString.split("-").map(toInteger);

      if (start !== undefined && end !== undefined) {
        if (end < start) {
          throw new Error(
            "The end of a range must not be less than the start.",
          );
        }

        range.start = start;
        range.end = end;
      } else {
        const value = toInteger(startAndEndString);
        range.start = value;
        range.end = value;
      }
    };

    const [startAndEndString, stepString] = rangeString.split("/");

    if (startAndEndString !== undefined && stepString !== undefined) {
      range.step = toInteger(stepString);
      setStartAndEnd(startAndEndString);
    } else {
      setStartAndEnd(rangeString);
    }

    if (range.start < limits.min || range.end > limits.max) {
      throw new Error("Value out of range.");
    }

    return range;
  });

export const toCronPhrase = (interval: string) => {
  const [
    minuteString,
    hourString,
    dayOfMonthString,
    monthString,
    dayOfWeekString,
  ] = interval.trim().split(/ +/);

  if (
    !minuteString ||
    !hourString ||
    !dayOfMonthString ||
    !monthString ||
    !dayOfWeekString
  ) {
    throw new Error("Enter a complete interval.");
  }

  const minuteRanges = toCronRanges(minuteString, CRON_RANGE_LIMITS.MINUTE);

  const hourRanges = toCronRanges(hourString, CRON_RANGE_LIMITS.HOUR);

  const dayOfMonthRanges = toCronRanges(
    dayOfMonthString,
    CRON_RANGE_LIMITS.DAY_OF_MONTH,
  );

  const monthRanges = toCronRanges(monthString, CRON_RANGE_LIMITS.MONTH, {
    JAN: "1",
    FEB: "2",
    MAR: "3",
    APR: "4",
    MAY: "5",
    JUN: "6",
    JUL: "7",
    AUG: "8",
    SEP: "9",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  });

  const dayOfWeekRanges = toCronRanges(
    dayOfWeekString,
    CRON_RANGE_LIMITS.DAY_OF_WEEK,
    {
      SUN: "0",
      MON: "1",
      TUE: "2",
      WED: "3",
      THU: "4",
      FRI: "5",
      SAT: "6",
    },
  );

  let phrase = "at ";

  if (
    minuteRanges.some((range) => isFullRange(range, CRON_RANGE_LIMITS.MINUTE))
  ) {
    phrase += "every minute";
  }

  if (
    hasOneItem(minuteRanges) &&
    minuteRanges[0].start == minuteRanges[0].end &&
    hasOneItem(hourRanges) &&
    hourRanges[0].start == hourRanges[0].end
  ) {
    phrase += `${hourRanges[0].start.toString().padStart(2, "0")}:${minuteRanges[0].start.toString().padStart(2, "0")}`;
  } else {
    phrase += toCronPhrasePart(
      minuteRanges,
      CRON_RANGE_LIMITS.MINUTE,
      "minute",
    );
    phrase += toCronPhrasePart(
      hourRanges,
      CRON_RANGE_LIMITS.HOUR,
      "hour",
      "past",
    );
  }

  const dayOfMonthPart = toCronPhrasePart(
    dayOfMonthRanges,
    CRON_RANGE_LIMITS.DAY_OF_MONTH,
    "day-of-month",
    "on",
  );

  phrase += dayOfMonthPart;

  phrase += toCronPhrasePart(
    dayOfWeekRanges,
    CRON_RANGE_LIMITS.DAY_OF_WEEK,
    "day-of-week",
    dayOfMonthPart ? "and on" : "on",
    {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  );

  phrase += toCronPhrasePart(
    monthRanges,
    CRON_RANGE_LIMITS.MONTH,
    "month",
    "in",
    {
      offset: 1,
      labels: [
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
      ],
    },
  );

  return phrase;
};
