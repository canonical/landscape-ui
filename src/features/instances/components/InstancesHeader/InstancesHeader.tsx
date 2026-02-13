import type { GroupedOption } from "@/components/filter";
import { PageParamFilter, TableFilterChips } from "@/components/filter";
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
import PendingInstancesNotification from "../PendingInstancesNotification";
import TagFilter from "../TagFilter";
import WslFilter from "../WslFilter";
import classes from "./InstancesHeader.module.scss";
import useInstanceSearchHelpTerms from "./hooks/useInstanceSearchHelpTerms";

interface InstancesHeaderProps {
  readonly columnFilterOptions: ColumnFilterOption[];
  readonly onChangeFilter: () => void;
}

const InstancesHeader: FC<InstancesHeaderProps> = ({
  columnFilterOptions,
  onChangeFilter,
}) => {
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
  const osOptions = FILTERS.os.type === "select" ? FILTERS.os.options : [];
  const wslOptions =
    FILTERS.wsl.type === "multi-select" ? FILTERS.wsl.options : [];
  const contractExpiryOptions =
    FILTERS.contractExpiryDays.type === "select"
      ? FILTERS.contractExpiryDays.options
      : [];

  return (
    <>
      <div className={classes.top}>
        <div className={classes.searchContainer}>
          <SearchBoxWithSavedSearches
            onHelpButtonClick={() => {
              setShowSearchHelp(true);
            }}
            onChange={onChangeFilter}
          />
        </div>
        <ResponsiveTableFilters
          isCollapsed={true}
          filters={[
            <PageParamFilter
              pageParamKey="status"
              key="status"
              label="Status"
              options={statusOptions}
              onChange={onChangeFilter}
            />,
            <PageParamFilter
              key="os"
              label="OS"
              options={osOptions}
              pageParamKey="os"
              onChange={onChangeFilter}
            />,
            <AvailabilityZoneFilter
              key="availability-zone"
              label="Availability zones"
              options={availabilityZoneOptions}
              onChange={onChangeFilter}
            />,
            <AccessGroupFilter
              key="access-group"
              label="Access groups"
              options={accessGroupOptions}
              onChange={onChangeFilter}
            />,
            <TagFilter
              key="tag"
              label="Tags"
              options={tagOptions}
              onChange={onChangeFilter}
            />,
            <WslFilter
              key="wsl"
              label="WSL"
              options={wslOptions}
              onChange={onChangeFilter}
            />,
            <PageParamFilter
              key="contract-expiry"
              label="Contract expiry"
              options={contractExpiryOptions}
              pageParamKey="contractExpiryDays"
              onChange={onChangeFilter}
            />,
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
          "wsl",
          "contractExpiryDays",
        ]}
        onChange={onChangeFilter}
        accessGroupOptions={accessGroupOptions}
        availabilityZonesOptions={availabilityZoneOptions}
        osOptions={osOptions}
        statusOptions={statusOptions}
        tagOptions={tagOptions}
        wslOptions={wslOptions}
        contractExpiryOptions={contractExpiryOptions}
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
