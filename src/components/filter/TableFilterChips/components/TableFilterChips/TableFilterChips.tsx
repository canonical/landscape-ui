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
  readonly wslOptions?: SelectOption[];
}

const TableFilterChips: FC<TableFilterChipsProps> = ({
  accessGroupOptions,
  availabilityZonesOptions,
  filtersToDisplay = defaultFiltersToDisplay,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
  wslOptions,
}) => {
  const {
    setPageParams,
    createPageParamsSetter,
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
    wsl,
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
      clear: createPageParamsSetter({ query: "" }),
    });
  }

  if (filtersToDisplay.includes("search")) {
    filters.push({
      label: "Search",
      item: search,
      clear: createPageParamsSetter({ search: "" }),
    });
  }

  if (filtersToDisplay.includes("status")) {
    filters.push({
      label: "Status",
      item: getItem(statusOptions, status),
      clear: createPageParamsSetter({ status: "" }),
    });
  }

  if (filtersToDisplay.includes("os")) {
    filters.push({
      label: "OS",
      item: getItem(osOptions, os),
      clear: createPageParamsSetter({ os: "" }),
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
      clear: createPageParamsSetter({ availabilityZones: [] }),
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
      clear: createPageParamsSetter({ accessGroups: [] }),
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
      clear: createPageParamsSetter({ tags: [] }),
    });
  }

  if (filtersToDisplay.includes("fromDate")) {
    filters.push({
      label: "From",
      item: fromDate,
      clear: createPageParamsSetter({ fromDate: "" }),
    });
  }

  if (filtersToDisplay.includes("toDate")) {
    filters.push({
      label: "To",
      item: toDate,
      clear: createPageParamsSetter({ toDate: "" }),
    });
  }

  if (filtersToDisplay.includes("passRateFrom")) {
    filters.push({
      label: "From pass rate",
      item: passRateFrom === 0 ? undefined : `${passRateFrom}%`,
      clear: createPageParamsSetter({ passRateFrom: 0 }),
    });
  }

  if (filtersToDisplay.includes("passRateTo")) {
    filters.push({
      label: "To",
      item: passRateTo === 100 ? undefined : `${passRateTo}%`,
      clear: createPageParamsSetter({ passRateTo: 100 }),
    });
  }

  if (filtersToDisplay.includes("type")) {
    filters.push({
      label: "Type",
      item: getItem(typeOptions, type),
      clear: createPageParamsSetter({ type: "" }),
    });
  }

  if (filtersToDisplay.includes("wsl")) {
    filters.push({
      label: "WSL",
      multiple: true,
      items: getItems(wslOptions, wsl),
      remove: (item) => {
        setPageParams({
          wsl: wsl.filter((i) => i !== item),
        });
      },
      clear: createPageParamsSetter({ wsl: [] }),
    });
  }

  return (
    <TableFilterChipsBase
      clearAll={createPageParamsSetter({
        accessGroups: [],
        availabilityZones: [],
        fromDate: "",
        os: "",
        status: "",
        tags: [],
        toDate: "",
        type: "",
        search: "",
        query: "",
        passRateFrom: 0,
        passRateTo: 100,
        wsl: [],
      })}
      filters={filters}
    />
  );
};

export default TableFilterChips;
