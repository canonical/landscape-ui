import { TableFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import AutoinstallFileForm from "../AutoinstallFileForm";
import classes from "./AutoinstallFilesHeader.module.scss";
import {
  ADD_AUTOINTALL_FILE_NOTIFICATION,
  ADD_BUTTON_TEXT,
  AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS,
} from "./constants";

const AutoinstallFilesHeader: FC = () => {
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
              multiple={false}
              label="Employee group"
              hasToggleIcon
              hasBadge
              options={[]}
              onItemSelect={() => undefined}
              selectedItem=""
            />

            <Button
              className="u-no-margin"
              hasIcon={true}
              onClick={() =>
                setSidePanelContent(
                  "Add new autoinstall file",
                  <AutoinstallFileForm
                    buttonText="Add"
                    description="Add autoinstall file. It can be applied during the initial setup of associated instances."
                    notification={ADD_AUTOINTALL_FILE_NOTIFICATION}
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
