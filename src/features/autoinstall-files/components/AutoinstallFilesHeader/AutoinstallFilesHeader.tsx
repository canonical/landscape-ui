import { TableFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";
import {
  ADD_BUTTON_TEXT,
  AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS,
} from "./constants";

interface AutoinstallFilesHeaderProps {
  readonly openAddForm: () => void;
}

const AutoinstallFilesHeader: FC<AutoinstallFilesHeaderProps> = ({
  openAddForm,
}) => {
  const { setPageParams, employeeGroups } = usePageParams();

  const handleGroupsSelect = (employeeGroups: string[]): void => {
    setPageParams({ employeeGroups });
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.container}>
            <TableFilter
              multiple
              label="Employee group"
              hasToggleIcon
              hasBadge
              options={AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS}
              onItemsSelect={handleGroupsSelect}
              selectedItems={employeeGroups}
            />

            <Button
              className="u-no-margin"
              hasIcon={true}
              onClick={openAddForm}
            >
              <Icon name="plus" />
              <span>{ADD_BUTTON_TEXT}</span>
            </Button>
          </div>
        }
      />

      <TableFilterChips
        filtersToDisplay={["query", "employeeGroups"]}
        employeeGroupOptions={AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS}
      />
    </>
  );
};

export default AutoinstallFilesHeader;
