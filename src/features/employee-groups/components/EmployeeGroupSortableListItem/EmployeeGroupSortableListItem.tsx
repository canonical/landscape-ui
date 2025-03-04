import type { ChangeEvent, FC } from "react";
import type { EmployeeGroup } from "../../types";
import classes from "./EmployeeGroupSortableListItem.module.scss";
import { Button, Icon, Input } from "@canonical/react-components";

interface EmployeeGroupSortableListItemProps {
  readonly group: EmployeeGroup;
  readonly onPriorityChange: (priority: number) => void;
}

const EmployeeGroupSortableListItem: FC<EmployeeGroupSortableListItemProps> = ({
  group,
  onPriorityChange,
}) => {
  const { priority } = group;

  const handlePriorityChange = (value: number): void => {
    if (!isNaN(value)) {
      onPriorityChange(value);
    }
  };

  return (
    <div className={classes.listItem}>
      <div className={classes.listItemContent}>
        <div className={classes.groupInfo}>
          <span>{group.name}</span>
        </div>
        <div className={classes.priorityControls}>
          <Button
            type="button"
            appearance="base"
            className={classes.priorityButton}
            onClick={() => handlePriorityChange(priority - 1)}
            aria-label={`Decrease priority for ${group.name}`}
          >
            <Icon name="minus" className={classes.minusIcon} />
          </Button>
          <Input
            type="number"
            className={classes.priorityInput}
            value={priority}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePriorityChange(parseInt(e.target.value, 10))
            }
            min="0"
            aria-label={`Priority for ${group.name}`}
          />
          <Button
            type="button"
            appearance="base"
            className={classes.priorityButton}
            onClick={() => handlePriorityChange(priority + 1)}
            aria-label={`Increase priority for ${group.name}`}
          >
            <Icon name="plus" className={classes.plusIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeGroupSortableListItem;
