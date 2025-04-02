import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import { SECURITY_STATUSES } from "./constants";
import PassRateFilter from "../PassRateFilter/PassRateFilter";
import classes from "./SecurityProfilesHeader.module.scss";

const SecurityProfilesHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.filters}>
            <StatusFilter multiple options={SECURITY_STATUSES} />
            <PassRateFilter />
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["statuses", "search"]}
        statusOptions={SECURITY_STATUSES}
      />
    </>
  );
};

export default SecurityProfilesHeader;
