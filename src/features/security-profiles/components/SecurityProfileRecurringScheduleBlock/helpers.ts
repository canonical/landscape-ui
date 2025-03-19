import { withNumberSuffix } from "../../helpers";

interface LabelInfo {
  keys: string[];
  labels: string[];
}

const toPhrase = (strings: string[]) => {
  return `${strings.slice(0, -1).join(", ")}${strings.length > 2 ? "," : ""}${strings.length > 1 ? " and " : ""}${strings.slice(-1)}`;
};

const getLabel = (index: number, offset: number, info?: LabelInfo) => {
  if (!info) {
    return index.toString();
  }

  const offsetIndex = index - offset;

  if (offsetIndex < 0 || offsetIndex > info.labels.length - 1) {
    throw new RangeError();
  }

  return info.labels[offsetIndex];
};

const validate = (
  unitOfTime: string,
  value: number,
  range: number,
  offset: number,
) => {
  if (value > range + offset || value < offset) {
    throw new RangeError(
      `The ${unitOfTime} ${value} is out of the range ${offset}-${range + offset}.`,
    );
  }
};

export const toCronPhrase = (
  values: string,
  unitOfTime: string,
  range: number,
  offset = 0,
  labelInfo?: LabelInfo,
) => {
  return toPhrase(
    values
      .replace(new RegExp("[A-Z]+", "g"), (match) => {
        if (!labelInfo) {
          throw new SyntaxError(`Invalid ${unitOfTime} "${match}".`);
        }

        const index = labelInfo.keys.indexOf(match);

        if (index == -1) {
          throw new SyntaxError(`Invalid ${unitOfTime} "${match}".`);
        }

        return (index + offset).toString();
      })
      .split(",")
      .map((value) => {
        if (value.includes("-")) {
          const [start, end] = value.split("-").map((limit) => parseInt(limit));

          validate(unitOfTime, start, range, offset);
          validate(unitOfTime, end, range, offset);

          if (start > end) {
            throw new RangeError(
              `The end of the ${unitOfTime} range is less than the start.`,
            );
          }

          return `every ${unitOfTime} from ${getLabel(start, offset, labelInfo)} through ${getLabel(end, offset, labelInfo)}`;
        }

        if (value.startsWith("*/")) {
          const stepString = value.replace(/^\*\//, "");
          const step = parseInt(stepString);

          if (Number.isNaN(step)) {
            throw new SyntaxError(`Invalid ${unitOfTime} step.`);
          }

          if (step < 1) {
            throw new RangeError(
              `The ${unitOfTime} step must be greater than 0.`,
            );
          }

          if (step == 1) {
            return `every ${unitOfTime}`;
          }

          return `every ${withNumberSuffix(step)} ${unitOfTime}`;
        }

        if (value == "*") {
          return `every ${unitOfTime}`;
        }

        const exactValue = parseInt(value);

        validate(unitOfTime, exactValue, range, offset);

        return labelInfo
          ? getLabel(exactValue, offset, labelInfo)
          : `${unitOfTime} ${value}`;
      }),
  );
};
