import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import {
  EmployeeGroupsFilter,
  getEmployeeGroupOptions,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";

interface AutoinstallFilesHeaderProps {
  readonly openAddForm: () => void;
}

const AutoinstallFilesHeader: FC<AutoinstallFilesHeaderProps> = ({
  openAddForm,
}) => {
  const { employeeGroups } = useGetEmployeeGroups();

  const employeeGroupOptions = getEmployeeGroupOptions(employeeGroups);

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.container}>
            <EmployeeGroupsFilter options={employeeGroupOptions} />
            <Button
              type="button"
              className="u-no-margin"
              hasIcon
              onClick={openAddForm}
            >
              <Icon name="plus" />
              <span>Add new</span>
            </Button>
          </div>
        }
      />

      <TableFilterChips
        filtersToDisplay={["search", "employeeGroups"]}
        employeeGroupOptions={employeeGroupOptions}
      />
    </>
  );
};

export default AutoinstallFilesHeader;
