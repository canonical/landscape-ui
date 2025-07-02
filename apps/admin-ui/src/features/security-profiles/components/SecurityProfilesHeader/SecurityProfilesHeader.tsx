import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import PassRateFilter from "@/components/filter/PassRateFilter";
import { SECURITY_STATUSES } from "./constants";
import classes from "./SecurityProfilesHeader.module.scss";

const SecurityProfilesHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.filters}>
            <StatusFilter options={SECURITY_STATUSES} label="Status" />
            <PassRateFilter />
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["status", "search", "passRateFrom", "passRateTo"]}
        statusOptions={SECURITY_STATUSES}
      />
    </>
  );
};

export default SecurityProfilesHeader;
