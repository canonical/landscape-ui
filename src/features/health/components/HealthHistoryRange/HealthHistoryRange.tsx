import { Button } from "@canonical/react-components";
import type { FC, KeyboardEvent } from "react";
import type { HealthHistoryRange as Range } from "../../types";
import classes from "./HealthHistoryRange.module.scss";

const OPTIONS: { label: string; value: Range }[] = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
];

interface HealthHistoryRangeProps {
  readonly value: Range;
  readonly onChange: (value: Range) => void;
  // Names the group, for example "Fleet health history range".
  readonly label: string;
}

/** Returns the time range switch of a history graph. */
const HealthHistoryRange: FC<HealthHistoryRangeProps> = ({
  value,
  onChange,
  label,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = OPTIONS.findIndex((option) => option.value === value);
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      event.key
    ];
    if (step === undefined) {
      return;
    }
    const nextIndex = (current + step + OPTIONS.length) % OPTIONS.length;
    const next = OPTIONS[nextIndex];
    if (!next) {
      return;
    }
    event.preventDefault();
    onChange(next.value);
    event.currentTarget.querySelectorAll("button")[nextIndex]?.focus();
  };

  return (
    <div className="p-segmented-control is-dense u-no-margin--bottom">
      <div
        className="p-segmented-control__list"
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
      >
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            tabIndex={option.value === value ? 0 : -1}
            className={`p-segmented-control__button u-no-margin--bottom ${classes.option}`}
            onClick={() => {
              onChange(option.value);
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HealthHistoryRange;
