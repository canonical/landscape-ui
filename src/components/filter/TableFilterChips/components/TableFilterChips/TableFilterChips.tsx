import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { ComponentProps, FC } from "react";
import { defaultFiltersToDisplay } from "../../constants";
import {
  filterSearchQuery,
  getItem,
  getItems,
  parseSearchQuery,
} from "../../helpers";
import type { FilterKey } from "../../types";
import TableFilterChipsBase from "../TableFilterChipsBase";

interface TableFilterChipsProps {
  readonly accessGroupOptions?: SelectOption[];
  readonly availabilityZonesOptions?: SelectOption[];
  readonly filtersToDisplay?: FilterKey[];
  readonly osOptions?: SelectOption[];
  readonly statusOptions?: SelectOption[];
  readonly tagOptions?: SelectOption[];
  readonly typeOptions?: SelectOption[];
}

const TableFilterChips: FC<TableFilterChipsProps> = ({
  accessGroupOptions,
  availabilityZonesOptions,
  filtersToDisplay = defaultFiltersToDisplay,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
}) => {
  const {
    setPageParams,
    accessGroups,
    availabilityZones,
    fromDate,
    os,
    status,
    tags,
    toDate,
    type,
    search,
    query,
    passRateFrom,
    passRateTo,
  } = usePageParams();

  const filters: ComponentProps<typeof TableFilterChipsBase>["filters"] = [];

  if (filtersToDisplay.includes("query")) {
    filters.push({
      label: "Query",
      multiple: true,
      items: parseSearchQuery(query),
      remove: (value) => {
        setPageParams({ query: filterSearchQuery(query, value as string) });
      },
      clear: () => {
        setPageParams({ query: "" });
      },
    });
  }

  if (filtersToDisplay.includes("search")) {
    filters.push({
      label: "Search",
      item: search,
      clear: () => {
        setPageParams({ search: "" });
      },
    });
  }

  if (filtersToDisplay.includes("status")) {
    filters.push({
      label: "Status",
      item: getItem(statusOptions, status),
      clear: () => {
        setPageParams({ status: "" });
      },
    });
  }

  if (filtersToDisplay.includes("os")) {
    filters.push({
      label: "OS",
      multiple: true,
      items: getItems(osOptions, os),
      remove: (operatingSystem) => {
        setPageParams({
          os: os.filter((s) => s !== operatingSystem),
        });
      },
      clear: () => {
        setPageParams({ os: [] });
      },
    });
  }

  if (
    filtersToDisplay.includes("availabilityZones") &&
    availabilityZonesOptions
  ) {
    filters.push({
      label: "Availability z.",
      multiple: true,
      items: getItems(availabilityZonesOptions, availabilityZones),
      remove: (availabilityZone) => {
        setPageParams({
          availabilityZones: availabilityZones.filter(
            (z) => z !== availabilityZone,
          ),
        });
      },
      clear: () => {
        setPageParams({ availabilityZones: [] });
      },
    });
  }

  if (filtersToDisplay.includes("accessGroups")) {
    filters.push({
      label: "Access group",
      multiple: true,
      items: getItems(accessGroupOptions, accessGroups),
      remove: (accessGroup) => {
        setPageParams({
          accessGroups: accessGroups.filter((g) => g !== accessGroup),
        });
      },
      clear: () => {
        setPageParams({ accessGroups: [] });
      },
    });
  }

  if (filtersToDisplay.includes("tags")) {
    filters.push({
      label: "Tag",
      multiple: true,
      items: getItems(tagOptions, tags),
      remove: (tag) => {
        setPageParams({
          tags: tags.filter((t) => t !== tag),
        });
      },
      clear: () => {
        setPageParams({ tags: [] });
      },
    });
  }

  if (filtersToDisplay.includes("fromDate")) {
    filters.push({
      label: "From",
      item: fromDate,
      clear: () => {
        setPageParams({ fromDate: "" });
      },
    });
  }

  if (filtersToDisplay.includes("toDate")) {
    filters.push({
      label: "To",
      item: toDate,
      clear: () => {
        setPageParams({ toDate: "" });
      },
    });
  }

  if (filtersToDisplay.includes("passRateFrom")) {
    filters.push({
      label: "From pass rate",
      item: passRateFrom === 0 ? undefined : `${passRateFrom}%`,
      clear: () => {
        setPageParams({ passRateFrom: 0 });
      },
    });
  }

  if (filtersToDisplay.includes("passRateTo")) {
    filters.push({
      label: "To",
      item: passRateTo === 100 ? undefined : `${passRateTo}%`,
      clear: () => {
        setPageParams({ passRateTo: 100 });
      },
    });
  }

  if (filtersToDisplay.includes("type")) {
    filters.push({
      label: "Type",
      item: getItem(typeOptions, type),
      clear: () => {
        setPageParams({ type: "" });
      },
    });
  }

  return (
    <TableFilterChipsBase
      clearAll={() => {
        setPageParams({
          accessGroups: [],
          availabilityZones: [],
          fromDate: "",
          os: [],
          status: "",
          tags: [],
          toDate: "",
          type: "",
          search: "",
          query: "",
          passRateFrom: 0,
          passRateTo: 100,
          wsl: [],
        });
      }}
      filters={filters}
    />
  );
};

export default TableFilterChips;
