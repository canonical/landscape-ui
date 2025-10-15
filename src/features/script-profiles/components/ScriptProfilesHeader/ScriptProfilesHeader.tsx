import { PageParamFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import AddScriptProfileButton from "../AddScriptProfileButton";
import { STATUS_OPTIONS } from "./constants";
import classes from "./ScriptProfilesHeader.module.scss";

const ScriptProfilesHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.actions}>
            <PageParamFilter
              pageParamKey="status"
              label="Status"
              options={STATUS_OPTIONS}
            />
            <AddScriptProfileButton />
          </div>
        }
      />

      <TableFilterChips
        filtersToDisplay={["search", "status"]}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default ScriptProfilesHeader;
