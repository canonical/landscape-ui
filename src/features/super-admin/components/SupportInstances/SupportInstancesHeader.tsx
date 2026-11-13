import type { GroupedOption } from "@/components/filter";
import { PageParamFilter, TableFilterChips } from "@/components/filter";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import ColumnFilter from "@/components/form/ColumnFilter";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { BREAKPOINT_PX } from "@/constants";
import {
  AccessGroupFilter,
  AvailabilityZoneFilter,
  FILTERS,
  TagFilter,
  UpgradesFilter,
  WslFilter,
} from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  useGetStaffAccessGroups,
  useGetStaffAvailabilityZones,
  useGetStaffTags,
} from "../../api";
import { SUPPORT_INSTANCE_COLUMN_OPTIONS } from "./constants";
import { useSupportInstanceSearchHelpTerms } from "./hooks";
import classes from "./SupportInstancesHeader.module.scss";

const getOptions = (filter: (typeof FILTERS)[keyof typeof FILTERS]) =>
  "options" in filter ? filter.options : [];

const STATUS_OPTIONS = getOptions(FILTERS.status);
const OS_OPTIONS = getOptions(FILTERS.os);
const UPGRADE_OPTIONS = getOptions(FILTERS.upgrades);
const WSL_OPTIONS = getOptions(FILTERS.wsl);
const CONTRACT_EXPIRY_OPTIONS = getOptions(FILTERS.contractExpiryDays);

interface SupportInstancesHeaderProps {
  /** The account whose tags, zones and access groups fill the filters. */
  readonly name: string;
}

/** The search and filters of the instance list. Saved searches are left out. */
const SupportInstancesHeader: FC<SupportInstancesHeaderProps> = ({ name }) => {
  const { query, setPageParams } = usePageParams();
  const searchHelpTerms = useSupportInstanceSearchHelpTerms(name);
  const hasRoomOnRight = useMediaQuery(`(min-width: ${BREAKPOINT_PX.xl}px)`);

  const [inputText, setInputText] = useState(query);
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputText(query);
  }, [query]);

  const { staffTags } = useGetStaffTags(name);
  const { staffAvailabilityZones } = useGetStaffAvailabilityZones(name);
  const { staffAccessGroups } = useGetStaffAccessGroups(name);

  const tagOptions = staffTags.map((tag) => ({ label: tag, value: tag }));

  const availabilityZoneOptions: GroupedOption[] = [
    { label: "Without zones", value: "none", group: "1" },
    ...staffAvailabilityZones.map((zone) => ({ label: zone, value: zone })),
  ];

  const accessGroupOptions = staffAccessGroups.map(
    ({ name: value, title }) => ({
      value,
      label: title,
    }),
  );

  return (
    <>
      <div className={classes.top}>
        <div className={classes.searchContainer}>
          <SearchBoxWithDescriptionButton
            inputValue={inputText}
            onInputChange={setInputText}
            onSearchClick={() => {
              setPageParams({ query: inputText.trim() });
            }}
            onClear={() => {
              setPageParams({ query: "" });
            }}
            onDescriptionClick={() => {
              setShowSearchHelp(true);
            }}
          />
        </div>
        <ResponsiveTableFilters
          isCollapsed
          menuPosition={hasRoomOnRight ? "left" : "right"}
          filters={[
            <PageParamFilter
              key="status"
              label="Status"
              options={STATUS_OPTIONS}
              pageParamKey="status"
            />,
            <PageParamFilter
              key="os"
              label="OS"
              options={OS_OPTIONS}
              pageParamKey="os"
            />,
            <UpgradesFilter
              key="upgrades"
              label="Upgrades"
              options={UPGRADE_OPTIONS}
            />,
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
            <WslFilter key="wsl" label="WSL" options={WSL_OPTIONS} />,
            <PageParamFilter
              key="contract-expiry"
              label="Contract expiry"
              options={CONTRACT_EXPIRY_OPTIONS}
              pageParamKey="contractExpiryDays"
            />,
          ]}
        />
        <div className={classes.actions}>
          <ColumnFilter
            label="Columns"
            options={[...SUPPORT_INSTANCE_COLUMN_OPTIONS]}
          />
        </div>
      </div>

      <TableFilterChips
        filtersToDisplay={[
          "accessGroups",
          "os",
          "availabilityZones",
          "status",
          "upgrades",
          "tags",
          "wsl",
          "contractExpiryDays",
        ]}
        accessGroupOptions={accessGroupOptions}
        availabilityZonesOptions={availabilityZoneOptions}
        osOptions={OS_OPTIONS}
        statusOptions={STATUS_OPTIONS}
        tagOptions={tagOptions}
        upgradesOptions={UPGRADE_OPTIONS}
        wslOptions={WSL_OPTIONS}
        contractExpiryOptions={CONTRACT_EXPIRY_OPTIONS}
      />

      <SearchHelpPopup
        open={showSearchHelp}
        data={searchHelpTerms}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
    </>
  );
};

export default SupportInstancesHeader;
