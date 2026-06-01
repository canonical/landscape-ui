import type { InputProps } from "@canonical/react-components";
import { Icon, ICONS, Input, Tooltip } from "@canonical/react-components";
import classes from "./CheckboxInputWithHelp.module.scss";

interface CheckboxInputWithHelpProps extends InputProps {
  readonly tooltipMessage: string;
}

const CheckboxInputWithHelp = ({
  label,
  tooltipMessage,
  disabled,
  ...checkboxInputProps
}: CheckboxInputWithHelpProps) => {
  return (
    <div className={classes.container}>
      <Input
        type="checkbox"
        label={label}
        disabled={disabled}
        {...checkboxInputProps}
      />
      <Tooltip
        message={tooltipMessage}
        position="top-center"
        className={classes.tooltip}
        positionElementClassName={classes.tooltipPositionElement}
      >
        <Icon
          name={ICONS.help}
          aria-hidden
          className={disabled ? classes.disabled : undefined}
        />
        <span className="u-off-screen">Help</span>
      </Tooltip>
    </div>
  );
};

export default CheckboxInputWithHelp;
