import { PageParamFilter, TableFilterChips } from "@/components/filter";
import PassRateFilter from "@/components/filter/PassRateFilter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import { USG_STATUSES } from "./constants";
import classes from "./USGProfilesHeader.module.scss";

const USGProfilesHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.filters}>
            <PageParamFilter
              pageParamKey="status"
              options={USG_STATUSES}
              label="Status"
            />
            <PassRateFilter />
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["status", "search", "passRateFrom", "passRateTo"]}
        statusOptions={USG_STATUSES}
      />
    </>
  );
};

export default USGProfilesHeader;
