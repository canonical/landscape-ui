import type { InputProps } from "@canonical/react-components";
import { Icon, ICONS, Input, Tooltip } from "@canonical/react-components";
import classes from "./CheckboxInputWithHelp.module.scss";

interface CheckboxInputWithHelpProps extends InputProps {
  readonly tooltipMessage: string;
}

const CheckboxInputWithHelp = ({
  label,
  tooltipMessage,
  ...checkboxInputProps
}: CheckboxInputWithHelpProps) => {
  return (
    <Input
      type="checkbox"
      label={
        <span>
          <span className={classes.settingLabel}>{label}</span>
          <Tooltip
            message={tooltipMessage}
            position="top-center"
            positionElementClassName={classes.tooltipPositionElement}
          >
            <Icon name={ICONS.help} aria-hidden />
            <span className="u-off-screen">Help</span>
          </Tooltip>
        </span>
      }
      {...checkboxInputProps}
    />
  );
};

export default CheckboxInputWithHelp;
