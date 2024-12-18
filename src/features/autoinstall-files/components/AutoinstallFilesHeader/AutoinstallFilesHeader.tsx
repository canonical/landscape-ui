import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { usePageParams } from "@/hooks/usePageParams";
import { FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";
import { TableFilter, TableFilterChips } from "@/components/filter";
import { Button, Icon } from "@canonical/react-components";
import { AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS } from "./constants";

const AutoinstallFilesHeader: FC = () => {
  const { setPageParams, status } = usePageParams();

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

        <Button hasIcon={true}>
          <Icon name="plus" />
          <span>Add new</span>
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
