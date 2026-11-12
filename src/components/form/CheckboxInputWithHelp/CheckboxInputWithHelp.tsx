import { Tooltip } from "@/components/ui";
import type { InputProps } from "@canonical/react-components";
import { Icon, ICONS, Input } from "@canonical/react-components";
import classes from "./CheckboxInputWithHelp.module.scss";

interface CheckboxInputWithHelpProps extends InputProps {
  readonly label: string;
  readonly tooltipMessage: string;
}

const CheckboxInputWithHelp = ({
  label,
  tooltipMessage,
  disabled,
  ...checkboxInputProps
}: CheckboxInputWithHelpProps) => {
  return (
    <Input
      type="checkbox"
      aria-label={label}
      label={
        <span>
          {label}
          <Tooltip
            message={tooltipMessage}
            className={classes.tooltip}
            targetElementClassName={classes.tooltipPositionElement}
          >
            <Icon name={ICONS.help} aria-hidden />
            <span className="u-off-screen">Help</span>
          </Tooltip>
        </span>
      }
      disabled={disabled}
      {...checkboxInputProps}
    />
  );
};

export default CheckboxInputWithHelp;
