import { TableFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import AutoinstallFileForm from "../AutoinstallFileForm";
import classes from "./AutoinstallFilesHeader.module.scss";
import {
  ADD_BUTTON_TEXT,
  AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS,
  SUBMIT_BUTTON_TEXT,
} from "./constants";

const AutoinstallFilesHeader: FC = () => {
  const { setPageParams, employeeGroups } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const {
    addAutoinstallFileQuery: { mutateAsync: addAutoinstallFile },
  } = useAutoinstallFiles();

  const handleSearch = (searchText: string): void => {
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
                buttonText={SUBMIT_BUTTON_TEXT}
                description="Add autoinstall file. It can be applied during the initial setup of associated instances."
                notification={{
                  message: "can now be assigned to Employee groups.",
                  title: "You have successfully added",
                }}
                query={addAutoinstallFile}
              />,
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
