import type { FC } from "react";
import { ReactSortable } from "react-sortablejs";
import type { StagedOidcGroup } from "../../types";
import classes from "./EmployeeGroupSortableList.module.scss";
import { Icon } from "@canonical/react-components";

interface EmployeeGroupSortableListProps {
  readonly visibleGroupList: StagedOidcGroup[];
  readonly groupList: StagedOidcGroup[];
  readonly onSort: (groupList: StagedOidcGroup[]) => void;
}

const EmployeeGroupSortableList: FC<EmployeeGroupSortableListProps> = ({
  visibleGroupList,
  onSort,
  groupList,
}) => {
  return (
    <ReactSortable
      list={groupList}
      setList={onSort}
      animation={150}
      tag="ul"
      className="p-list list"
      chosenClass={classes.chosen}
      delay={2}
      delayOnTouchOnly
    >
      {visibleGroupList.map((employeeGroup) => (
        <li key={employeeGroup.id} className={classes.listItem}>
          <div>
            <Icon name="drag" className={classes.icon} />
            <span>{employeeGroup.name}</span>
          </div>
        </li>
      ))}
    </ReactSortable>
  );
};

export default EmployeeGroupSortableList;
