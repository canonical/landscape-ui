import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
//import { useGetSecurityProfiles } from "../../api";

import type { FC } from "react";
import { SECURITY_STATUSES } from "./constants";
import PassRateFilter from "../PassRateFilter/PassRateFilter";

const SecurityProfilesHeader: FC = () => {
  //const { securityProfiles } = useGetSecurityProfiles();

  //const employeeGroupOptions = getEmployeeGroupOptions(employeeGroups, false);

  return (
    <>
      <HeaderWithSearch
        actions={
          <>
            {/*<EmployeeGroupsFilter
              employeeGroupsData={employeeGroups}
              searchLabel="Showing employee groups for listed employees. Search to filter from all available groups."
            />*/}

            <StatusFilter options={SECURITY_STATUSES} />
            <PassRateFilter />
          </>
        }
      />
      <TableFilterChips
        filtersToDisplay={["status", "search"]}
        statusOptions={SECURITY_STATUSES}
      />
    </>
  );
};

export default SecurityProfilesHeader;
