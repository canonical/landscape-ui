import type { GroupedOption } from "@/components/filter";
import { StatusFilter, TableFilterChips } from "@/components/filter";
import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import ColumnFilter from "@/components/form/ColumnFilter";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { SearchBoxWithSavedSearches } from "@/features/saved-searches";
import useInstances from "@/hooks/useInstances";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useState } from "react";
import GroupFilter from "../../../../components/filter/GroupFilter";
import { FILTERS } from "../../constants";
import AccessGroupFilter from "../AccessGroupFilter";
import AvailabilityZoneFilter from "../AvailabilityZoneFilter";
import OsFilter from "../OsFilter";
import PendingInstancesNotification from "../PendingInstancesNotification";
import TagFilter from "../TagFilter";
import { INSTANCE_SEARCH_HELP_TERMS } from "./constants";
import classes from "./InstancesHeader.module.scss";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import ResponsiveTableFilterDivider from "@/components/filter/ResponsiveTableFilters/components/ResponsiveTableFilterDivider";

interface InstancesHeaderProps {
  readonly columnFilterOptions: ColumnFilterOption[];
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
            onHelpButtonClick={() => {
              setShowSearchHelp(true);
            }}
          />
        </div>
        <ResponsiveTableFilters
          collapseFrom="xxl"
          filters={[
            <GroupFilter key="group" label="Group by" options={groupOptions} />,
            <ResponsiveTableFilterDivider key="divider-1" />,
            <StatusFilter
              key="status"
              label="Status"
              options={statusOptions}
            />,
            <OsFilter key="os" label="OS" options={osOptions} />,
            <AvailabilityZoneFilter
              key="availability-zone"
              label="Availability zones"
              options={availabilityZoneOptions}
            />,
            <AccessGroupFilter
              key="access-group"
              label="Access groups"
              options={accessGroupOptions}
            />,
            <TagFilter key="tag" label="Tags" options={tagOptions} />,
            <ResponsiveTableFilterDivider key="divider-2" />,
            <ColumnFilter
              key="column"
              label="Columns"
              options={columnFilterOptions}
            />,
          ]}
        />
      </div>

      <TableFilterChips
        filtersToDisplay={[
          "accessGroups",
          "os",
          "availabilityZones",
          "status",
          "tags",
          "query",
        ]}
        accessGroupOptions={accessGroupOptions}
        availabilityZonesOptions={availabilityZoneOptions}
        osOptions={osOptions}
        statusOptions={statusOptions}
        tagOptions={tagOptions}
      />

      <SearchHelpPopup
        open={showSearchHelp}
        data={INSTANCE_SEARCH_HELP_TERMS}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      <PendingInstancesNotification />
    </>
  );
};

export default InstancesHeader;
