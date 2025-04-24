import type { ChangeEvent, FC } from "react";
import { useRef } from "react";
import type { EmployeeGroup } from "../../types";
import classes from "./EmployeeGroupSortableListItem.module.scss";
import { Button, Icon, Input } from "@canonical/react-components";
import { NOT_AVAILABLE } from "@/constants";

interface EmployeeGroupSortableListItemProps {
  readonly group: EmployeeGroup;
  readonly onPriorityChange: (priority: number) => void;
  readonly setSubmissionBlocked: (state: boolean) => void;
}

const EmployeeGroupSortableListItem: FC<EmployeeGroupSortableListItemProps> = ({
  group,
  onPriorityChange,
  setSubmissionBlocked,
}) => {
  const { priority } = group;

  const isError = useRef(false);

  const handlePriorityChange = (value: number): void => {
    if (isNaN(value)) {
      return;
    }

    onPriorityChange(value);

    const isValid = value >= 0;

    isError.current = !isValid;
    setSubmissionBlocked(!isValid);
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
            onClick={() => {
              handlePriorityChange((priority ?? 0) - 1);
            }}
            aria-label={`Decrease priority for ${group.name}`}
            disabled={priority === 0 || priority === null}
          >
            <Icon name="minus" className={classes.minusIcon} />
          </Button>
          <Input
            type="number"
            className={classes.priorityInput}
            value={priority ?? undefined}
            placeholder={null === priority ? NOT_AVAILABLE : undefined}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handlePriorityChange(parseInt(e.target.value, 10));
            }}
            min="0"
            aria-label={`Priority for ${group.name}`}
            error={isError.current ? true : undefined}
          />
          <Button
            type="button"
            appearance="base"
            className={classes.priorityButton}
            onClick={() => {
              handlePriorityChange((priority ?? 0) + 1);
            }}
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
