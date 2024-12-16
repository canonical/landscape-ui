import { FC, useState } from "react";
import ColumnFilter, {
  ColumnFilterOption,
} from "@/components/form/ColumnFilter";
import {
  GroupedOption,
  StatusFilter,
  TableFilterChips,
} from "@/components/filter";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { SearchBoxWithSavedSearches } from "@/features/saved-searches";
import useInstances from "@/hooks/useInstances";
import useRoles from "@/hooks/useRoles";
import { FILTERS } from "../../constants";
import AccessGroupFilter from "../AccessGroupFilter";
import AvailabilityZoneFilter from "../AvailabilityZoneFilter";
import GroupFilter from "../../../../components/filter/GroupFilter";
import OsFilter from "../OsFilter";
import PendingInstancesNotification from "../PendingInstancesNotification";
import TagFilter from "../TagFilter";
import { INSTANCE_SEARCH_HELP_TERMS } from "./constants";
import classes from "./InstancesHeader.module.scss";

interface InstancesHeaderProps {
  columnFilterOptions: ColumnFilterOption[];
}

const InstancesHeader: FC<InstancesHeaderProps> = ({ columnFilterOptions }) => {
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const { getAccessGroupQuery } = useRoles();
  const { getAllInstanceTagsQuery, getAvailabilityZonesQuery } = useInstances();

  const { data: getAllInstanceTagsQueryResult } = getAllInstanceTagsQuery();

  const tagOptions =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const { data: getAvailabilityZonesQueryResult } = getAvailabilityZonesQuery();

  const availabilityZoneOptions = (
    getAvailabilityZonesQueryResult?.data.values ?? []
  ).reduce(
    (acc, zone) => {
      acc.push({
        label: zone,
        value: zone,
      });

      return acc;
    },
    [{ label: "Without zones", value: "none", group: "1" }] as GroupedOption[],
  );

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      value: name,
      label: title,
    })) ?? [];

  const groupOptions =
    FILTERS.groupBy.type === "select" ? FILTERS.groupBy.options : [];
  const statusOptions =
    FILTERS.status.type === "select" ? FILTERS.status.options : [];
  const osOptions = FILTERS.os.type === "select" ? FILTERS.os.options : [];

  return (
    <>
      <div className={classes.top}>
        <div className={classes.searchContainer}>
          <SearchBoxWithSavedSearches
            onHelpButtonClick={() => setShowSearchHelp(true)}
          />
        </div>
        <div className={classes.filters}>
          <GroupFilter options={groupOptions} />
          <span className={classes.divider} />
          <StatusFilter options={statusOptions} />
          <OsFilter options={osOptions} />
          <AvailabilityZoneFilter options={availabilityZoneOptions} />
          <AccessGroupFilter options={accessGroupOptions} />
          <TagFilter options={tagOptions} />
          <span className={classes.divider} />
          <ColumnFilter options={columnFilterOptions} />
        </div>
      </div>

      <TableFilterChips
        filtersToDisplay={[
          "accessGroups",
          "os",
          "availabilityZones",
          "status",
          "tags",
          "search",
        ]}
        accessGroupOptions={accessGroupOptions}
        availabilityZonesOptions={availabilityZoneOptions}
        osOptions={osOptions}
        statusOptions={statusOptions}
        tagOptions={tagOptions}
        useSearchAsQuery
      />

      <SearchHelpPopup
        open={showSearchHelp}
        data={INSTANCE_SEARCH_HELP_TERMS}
        onClose={() => setShowSearchHelp(false)}
      />
      <PendingInstancesNotification />
    </>
  );
};

export default InstancesHeader;
