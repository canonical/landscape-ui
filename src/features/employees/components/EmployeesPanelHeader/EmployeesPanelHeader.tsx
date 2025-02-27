import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import {
  EmployeeGroupsFilter,
  getEmployeeGroupOptions,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
import type { FC } from "react";
import { STATUS_OPTIONS } from "./constants";

const EmployeesPanelHeader: FC = () => {
  const { employeeGroups } = useGetEmployeeGroups();

  const employeeGroupOptions = getEmployeeGroupOptions(employeeGroups, false);

  return (
    <>
      <HeaderWithSearch
        actions={
          <>
            <EmployeeGroupsFilter
              employeeGroupsData={employeeGroups}
              searchLabel="Showing employee groups for listed employees. Search to filter from all available groups."
            />
            <StatusFilter options={STATUS_OPTIONS} />
          </>
        }
      />
      <TableFilterChips
        filtersToDisplay={["employeeGroups", "status", "search"]}
        employeeGroupOptions={employeeGroupOptions}
      />
    </>
  );
};

export default EmployeesPanelHeader;
