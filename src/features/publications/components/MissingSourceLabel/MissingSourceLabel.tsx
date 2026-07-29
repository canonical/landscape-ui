import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./MissingSourceLabel.module.scss";

interface MissingSourceLabelProps {
  readonly className?: string;
}

const MissingSourceLabel: FC<MissingSourceLabelProps> = ({ className }) => {
  return (
    <span className={className}>
      <Icon name={ICONS.warning} />
      <span className={classes.label}>Source not found</span>
    </span>
  );
};

export default MissingSourceLabel;
