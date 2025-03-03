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
              onItemsSelect={(items) =>
                setPageParams({ employeeGroups: items })
              }
              selectedItems={employeeGroups}
            />

            <Button
              className="u-no-margin"
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
