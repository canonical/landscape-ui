import { type FC } from "react";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classes from "./SnapItemTitleRow.module.scss";

interface SnapItemTitleRowProps {
  readonly name: string;
  readonly onDelete: () => void;
}

const SnapItemTitleRow: FC<SnapItemTitleRowProps> = ({ name, onDelete }) => {
  return (
    <div className={classes.titleRow}>
      <strong>{name}</strong>
      <Button
        type="button"
        appearance="base"
        className={classes.deleteButton}
        aria-label={`Delete ${name}`}
        onClick={onDelete}
      >
        <Icon name={ICONS.delete} />
      </Button>
    </div>
  );
};

export default SnapItemTitleRow;
