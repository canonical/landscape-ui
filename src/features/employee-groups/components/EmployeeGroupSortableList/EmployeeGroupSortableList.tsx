import type { FC } from "react";
import { useState } from "react";
import type { EmployeeGroup } from "../../types";
import EmployeeGroupSortableListItem from "../EmployeeGroupSortableListItem";

interface EmployeeGroupWithPriority {
  readonly id: number;
  readonly priority: number;
}

interface EmployeeGroupSortableListProps {
  readonly groups: EmployeeGroup[];
  readonly onPriorityChange: (id: number, priority: number) => void;
}

const EmployeeGroupSortableList: FC<EmployeeGroupSortableListProps> = ({
  groups,
  onPriorityChange,
}) => {
  const [priorityValues, setPriorityValues] = useState<
    EmployeeGroupWithPriority[]
  >([]);

  const handlePriorityChange = (id: number, value: number): void => {
    setPriorityValues([
      ...priorityValues.filter((group) => group.id !== id),
      {
        id,
        priority: value,
      },
    ]);

    onPriorityChange(id, value);
  };

  return (
    <ul className="p-list--divided u-no-margin--bottom">
      {groups.map((employeeGroup) => (
        <li key={employeeGroup.id} className="p-list__item">
          <EmployeeGroupSortableListItem
            key={employeeGroup.id}
            group={employeeGroup}
            onPriorityChange={(priority) =>
              handlePriorityChange(employeeGroup.id, priority)
            }
          />
        </li>
      ))}
    </ul>
  );
};

export default EmployeeGroupSortableList;
