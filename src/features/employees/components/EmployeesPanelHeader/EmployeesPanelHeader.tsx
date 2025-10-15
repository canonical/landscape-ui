import { PageParamFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import { STATUS_OPTIONS } from "./constants";

const EmployeesPanelHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <PageParamFilter
            pageParamKey="status"
            label="Status"
            options={STATUS_OPTIONS}
          />
        }
      />
      <TableFilterChips
        filtersToDisplay={["search", "status"]}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default EmployeesPanelHeader;
