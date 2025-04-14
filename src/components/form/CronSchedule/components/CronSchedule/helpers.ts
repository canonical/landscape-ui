const UNITS_OF_TIME = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12 },
  { min: 0, max: 6 },
];

interface ScheduleRange {
  start: number;
  end: number;
  step: number;
}

interface LabelInfo {
  labels: string[];
  offset?: number;
}

const phrase = (...strings: string[]) =>
  `${strings.slice(0, -1).join(", ")}${strings.length > 2 ? "," : ""}${strings.length > 1 ? " and " : ""}${strings.slice(-1)}`;

const getCronLabel = (value: number, labelInfo?: LabelInfo) =>
  labelInfo
    ? labelInfo.labels[labelInfo.offset ? value - labelInfo.offset : value]
    : value;

const getCronPhrasePart = (
  ranges: ScheduleRange[],
  index: number,
  unitOfTime: string,
  prefix?: string,
  labelInfo?: LabelInfo,
) => {
  let response = "";

  if (
    !ranges.some(
      (range) =>
        range.start == UNITS_OF_TIME[index].min &&
        range.end == UNITS_OF_TIME[index].max &&
        range.step == 1,
    )
  ) {
    if (prefix) {
      response += ` ${prefix} `;
    }

    response += phrase(
      ...ranges.map((range) => {
        if (
          range.start < UNITS_OF_TIME[index].min ||
          range.end > UNITS_OF_TIME[index].max
        ) {
          throw new Error("Value out of range.");
        }

        let innerResponse = "";

        if (range.step > 1 || range.start != range.end) {
          innerResponse += "every ";
        }

        if (range.step > 1) {
          innerResponse += `${range.step}th `;
        }

        if (range.start != range.end || range.step > 1) {
          innerResponse += unitOfTime;

          if (
            range.start != UNITS_OF_TIME[index].min ||
            range.end != UNITS_OF_TIME[index].max
          ) {
            innerResponse += ` from ${getCronLabel(range.start, labelInfo)} through ${getCronLabel(range.end, labelInfo)}`;
          }
        } else if (labelInfo) {
          innerResponse += getCronLabel(range.start, labelInfo);
        } else {
          innerResponse += `${unitOfTime} ${range.start}`;
        }

        return innerResponse;
      }),
    );
  }

  return response;
};

export const getCronPhrase = (interval: string) => {
  const parts = interval.split(" ");

  if (parts.length != 5) {
    throw new Error("Enter 5 values.");
  }

  const [minutes, hours, daysOfMonth, months, daysOfWeek] = parts.map(
    (part, i) =>
      part.split(",").map((rangeString) => {
        const range: ScheduleRange = {
          start: Number.NaN,
          end: Number.NaN,
          step: 1,
        };

        if (rangeString.includes("/")) {
          const [firstValue, stepValue] = rangeString.split("/");

          const step = parseInt(stepValue);

          if (Number.isNaN(step)) {
            throw new Error("Invalid step.");
          }

          range.step = step;

          if (firstValue == "*") {
            range.start = UNITS_OF_TIME[i].min;
            range.end = UNITS_OF_TIME[i].max;
          } else {
            const [start, end] = firstValue
              .split("-")
              .map((value) => parseInt(value));

            if (Number.isNaN(start) || Number.isNaN(end) || end == undefined) {
              throw new Error("Invalid step value.");
            }

            range.start = start;
            range.end = end;
          }

          return range;
        }

        if (rangeString.includes("-")) {
          const [start, end] = rangeString
            .split("-")
            .map((value) => parseInt(value));

          if (Number.isNaN(start) || Number.isNaN(end)) {
            throw new Error("Invalid value.");
          }

          range.start = start;
          range.end = end;
        } else if (rangeString == "*") {
          range.start = UNITS_OF_TIME[i].min;
          range.end = UNITS_OF_TIME[i].max;
        } else {
          range.start = parseInt(rangeString);
          range.end = parseInt(rangeString);
        }

        return range;
      }),
  );

  let response = '"At ';

  if (
    minutes.some(
      (range) =>
        range.start == UNITS_OF_TIME[0].min &&
        range.end == UNITS_OF_TIME[0].max &&
        range.step == 1,
    )
  ) {
    response += "every minute";
  }

  if (
    minutes.length == 1 &&
    minutes[0].start == minutes[0].end &&
    minutes[0].step == 1 &&
    hours.length == 1 &&
    hours[0].start == hours[0].end &&
    hours[0].step == 1
  ) {
    if (
      minutes[0].start < UNITS_OF_TIME[0].min ||
      minutes[0].end > UNITS_OF_TIME[0].max ||
      hours[0].start < UNITS_OF_TIME[1].min ||
      hours[0].end > UNITS_OF_TIME[1].max
    ) {
      throw new Error("Value out of range.");
    }

    response += `${hours[0].start.toString().padStart(2, "0")}:${minutes[0].start.toString().padStart(2, "0")}`;
  } else {
    response += getCronPhrasePart(minutes, 0, "minute");
    response += getCronPhrasePart(hours, 1, "hour", "past");
  }

  response += getCronPhrasePart(daysOfMonth, 2, "day-of-month", "on");

  response += getCronPhrasePart(daysOfWeek, 4, "day-of-week", "on", {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  });

  response += getCronPhrasePart(months, 3, "month", "in", {
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
  });

  return response + '"';
};
