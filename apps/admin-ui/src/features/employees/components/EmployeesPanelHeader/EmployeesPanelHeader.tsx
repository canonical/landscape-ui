import {
  AutoinstallFilesFilter,
  StatusFilter,
  TableFilterChips,
} from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import {
  getAutoinstallFileOptions,
  useGetAutoinstallFiles,
} from "@/features/autoinstall-files";
import {
  EmployeeGroupsFilter,
  getEmployeeGroupOptions,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import { type FC, useMemo } from "react";
import { STATUS_OPTIONS } from "./constants";
import classes from "./EmployeesPanelHeader.module.scss";

const EmployeesPanelHeader: FC = () => {
  const { employeeGroups } = useGetEmployeeGroups(
    {},
    {
      listenToUrlParams: false,
    },
  );

  const { autoinstallFiles } = useGetAutoinstallFiles();

  const employeeGroupOptions = useMemo(
    () => getEmployeeGroupOptions(employeeGroups),
    [employeeGroups],
  );

  const autoinstallFileOptions = useMemo(
    () => getAutoinstallFileOptions(autoinstallFiles),
    [autoinstallFiles],
  );

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.filters}>
            <EmployeeGroupsFilter options={employeeGroupOptions} />
            <AutoinstallFilesFilter
              label="Autoinstall files"
              options={autoinstallFileOptions}
            />
            <StatusFilter label="Status" options={STATUS_OPTIONS} />
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={[
          "autoinstallFiles",
          "employeeGroups",
          "search",
          "status",
        ]}
        employeeGroupOptions={employeeGroupOptions}
        autoinstallFileOptions={autoinstallFileOptions}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default EmployeesPanelHeader;
