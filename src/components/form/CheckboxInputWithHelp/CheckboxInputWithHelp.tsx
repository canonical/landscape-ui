import type { CheckboxInputProps } from "@canonical/react-components";
import {
  CheckboxInput,
  Icon,
  ICONS,
  Tooltip,
} from "@canonical/react-components";
import classes from "./CheckboxInputWithHelp.module.scss";

interface CheckboxInputWithHelpProps extends CheckboxInputProps {
  readonly tooltipMessage: string;
}

const CheckboxInputWithHelp = ({
  label,
  tooltipMessage,
  ...checkboxInputProps
}: CheckboxInputWithHelpProps) => {
  return (
    <CheckboxInput
      label={
        <span>
          <span className={classes.settingLabel}>{label}</span>
          <Tooltip
            message={tooltipMessage}
            position="top-center"
            positionElementClassName={classes.tooltipPositionElement}
          >
            <Icon name={ICONS.help} aria-hidden />
          </Tooltip>
        </span>
      }
      {...checkboxInputProps}
    />
  );
};

export default CheckboxInputWithHelp;
