import type { GroupedOption } from "@/components/filter";
import { TableFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";

interface AutoinstallFilesHeaderProps {
  readonly employeeGroupOptions: GroupedOption[];
  readonly handleEmployeeGroupSelect: (employeeGroup: string) => void;
  readonly openAddForm: () => void;
  readonly selectedEmployeeGroup: string;
}

const AutoinstallFilesHeader: FC<AutoinstallFilesHeaderProps> = ({
  employeeGroupOptions,
  handleEmployeeGroupSelect,
  openAddForm,
  selectedEmployeeGroup,
}) => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.container}>
            <TableFilter
              hasBadge
              hasToggleIcon
              label="Employee group"
              multiple={false}
              onItemSelect={handleEmployeeGroupSelect}
              options={employeeGroupOptions}
              selectedItem={selectedEmployeeGroup}
            />

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
