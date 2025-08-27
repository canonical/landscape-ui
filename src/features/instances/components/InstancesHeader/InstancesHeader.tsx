import type { GroupedOption } from "@/components/filter";
import { StatusFilter, TableFilterChips } from "@/components/filter";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import ColumnFilter from "@/components/form/ColumnFilter";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { SearchBoxWithSavedSearches } from "@/features/saved-searches";
import { useGetTags } from "@/features/tags";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useState } from "react";
import { useGetAvailabilityZones } from "../../api";
import { FILTERS } from "../../constants";
import AccessGroupFilter from "../AccessGroupFilter";
import AvailabilityZoneFilter from "../AvailabilityZoneFilter";
import OsFilter from "../OsFilter";
import PendingInstancesNotification from "../PendingInstancesNotification";
import TagFilter from "../TagFilter";
import classes from "./InstancesHeader.module.scss";
import useInstanceSearchHelpTerms from "./hooks/useInstanceSearchHelpTerms";

interface InstancesHeaderProps {
  readonly columnFilterOptions: ColumnFilterOption[];
}

const InstancesHeader: FC<InstancesHeaderProps> = ({ columnFilterOptions }) => {
  const instanceSearchHelpTerms = useInstanceSearchHelpTerms();

  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const { getAccessGroupQuery } = useRoles();

  const { tags } = useGetTags();

  const tagOptions =
    tags.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const { availabilityZones } = useGetAvailabilityZones();

  const availabilityZoneOptions = availabilityZones.reduce(
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

  const statusOptions =
    FILTERS.status.type === "select" ? FILTERS.status.options : [];
  const osOptions =
    FILTERS.os.type === "multi-select" ? FILTERS.os.options : [];

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
            <span key="divider-2" className={classes.divider} />,
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
        data={instanceSearchHelpTerms}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      <PendingInstancesNotification />
    </>
  );
};

export default InstancesHeader;
