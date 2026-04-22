import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./File.module.scss";

interface FileProps {
  readonly name: string;
  readonly onDismiss: () => void;
}

const File: FC<FileProps> = ({
  name,
  onDismiss,
}) => (
  <div className={classes.file}>
    <span>{name}</span>
    <Button 
      appearance="base"
      hasIcon
      onClick={onDismiss}
      className="u-no-margin--bottom"
      type="button"
    >
      <Icon name={`${ICONS.close}--muted`} />
    </Button>
  </div>
);

export default File;
