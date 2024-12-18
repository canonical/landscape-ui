import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { usePageParams } from "@/hooks/usePageParams";
import { FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";
import { TableFilter, TableFilterChips } from "@/components/filter";
import { Button, Form, Icon, Input } from "@canonical/react-components";
import {
  ADD_BUTTON_TEXT,
  AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS,
} from "./constants";
import useSidePanel from "@/hooks/useSidePanel";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";

const AutoinstallFilesHeader: FC = () => {
  const { setPageParams, status } = usePageParams();
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
            multiple={false}
            label="Employee group"
            hasToggleIcon
            hasBadge
            options={AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS}
            onItemSelect={(item) => setPageParams({ status: item })}
            selectedItem={status}
          />
        </div>

        <Button
          hasIcon={true}
          onClick={() =>
            setSidePanelContent(
              "Add new autoinstall file",
              <Form>
                <div className={classes.container}>
                  <span>
                    Add autoinstall file. It can be applied during the initial
                    setup of associated instances.
                  </span>
                  <div className={classes.radioGroup}>
                    <Input
                      type="radio"
                      label="From a file"
                      name="add-method"
                      value="from-a-file"
                      defaultChecked={true}
                    />
                    <Input
                      type="radio"
                      label="Plain text"
                      name="add-method"
                      value="plain-text"
                    />
                  </div>
                </div>
                <SidePanelFormButtons
                  submitButtonDisabled={false}
                  submitButtonText="Add"
                />
              </Form>,
            )
          }
        >
          <Icon name="plus" />
          <span>{ADD_BUTTON_TEXT}</span>
        </Button>
      </div>

      <TableFilterChips
        filtersToDisplay={["search", "status", "type", "fromDate", "toDate"]}
        employeeGroupOptions={AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS}
        useSearchAsQuery
      />
    </>
  );
};

export default AutoinstallFilesHeader;
