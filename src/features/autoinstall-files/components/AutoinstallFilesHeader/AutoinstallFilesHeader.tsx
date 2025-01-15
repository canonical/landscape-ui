import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";
import { TableFilter, TableFilterChips } from "@/components/filter";
import { Button, Icon } from "@canonical/react-components";
import {
  ADD_BUTTON_TEXT,
  AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS,
  SUBMIT_BUTTON_TEXT,
} from "./constants";
import useSidePanel from "@/hooks/useSidePanel";
import AutoinstallFileForm from "../AutoinstallFileForm";

const AutoinstallFilesHeader: FC = () => {
  const { setPageParams, employeeGroups } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
  };

  return (
    <>
      <div className={classes.header}>
        <HeaderWithSearch className={classes.search} onSearch={handleSearch} />

        <div className={classes.filters}>
          <TableFilter
            multiple
            label="Employee group"
            hasToggleIcon
            hasBadge
            options={AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS}
            onItemsSelect={(items) => setPageParams({ employeeGroups: items })}
            selectedItems={employeeGroups}
          />
        </div>

        <Button
          hasIcon={true}
          onClick={() =>
            setSidePanelContent(
              "Add new autoinstall file",
              <AutoinstallFileForm
                createNotificationMessage={() => {
                  return "Autoinstall file can now be assigned to Employee groups.";
                }}
                createNotificationTitle={(fileName) => {
                  return `You have successfully added ${fileName}`;
                }}
                submitButtonText={SUBMIT_BUTTON_TEXT}
              >
                Add autoinstall file. It can be applied during the initial setup
                of associated instances.
              </AutoinstallFileForm>,
            )
          }
        >
          <Icon name="plus" />
          <span>{ADD_BUTTON_TEXT}</span>
        </Button>
      </div>

      <TableFilterChips
        filtersToDisplay={["query", "employeeGroups"]}
        employeeGroupOptions={AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS}
      />
    </>
  );
};

export default AutoinstallFilesHeader;
