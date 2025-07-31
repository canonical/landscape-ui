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
  readonly autoinstallFileOptions?: SelectOption[];
  readonly availabilityZonesOptions?: SelectOption[];
  readonly employeeGroupOptions?: SelectOption[];
  readonly filtersToDisplay?: FilterKey[];
  readonly osOptions?: SelectOption[];
  readonly statusOptions?: SelectOption[];
  readonly tagOptions?: SelectOption[];
  readonly typeOptions?: SelectOption[];
}

const TableFilterChips: FC<TableFilterChipsProps> = ({
  accessGroupOptions,
  availabilityZonesOptions,
  autoinstallFileOptions,
  employeeGroupOptions,
  filtersToDisplay = defaultFiltersToDisplay,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
}) => {
  const {
    setPageParams,
    accessGroups,
    autoinstallFiles,
    availabilityZones,
    employeeGroups,
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
      item: getItem(osOptions, os),
      clear: () => {
        setPageParams({ os: "" });
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

  if (filtersToDisplay.includes("autoinstallFiles")) {
    filters.push({
      label: "Autoinstall file",
      multiple: true,
      items: getItems(autoinstallFileOptions, autoinstallFiles),
      remove: (autoinstallFile) => {
        setPageParams({
          autoinstallFiles: autoinstallFiles.filter(
            (f) => f !== autoinstallFile,
          ),
        });
      },
      clear: () => {
        setPageParams({ autoinstallFiles: [] });
      },
    });
  }

  if (filtersToDisplay.includes("employeeGroups")) {
    filters.push({
      label: "Employee group",
      multiple: true,
      items: employeeGroups.map((employeeGroup) =>
        getItem(employeeGroupOptions, employeeGroup),
      ),
      remove: (employeeGroup) => {
        setPageParams({
          employeeGroups: employeeGroups.filter((g) => g !== employeeGroup),
        });
      },
      clear: () => {
        setPageParams({ employeeGroups: [] });
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

  if (filtersToDisplay.includes("wsl")) {
    filters.push({
      label: "WSL",
      multiple: true,
      items: getItems(
        [
          { label: "Parent", value: "parent" },
          { label: "Child", value: "child" },
        ],
        wsl,
      ),
      remove: (item) => {
        setPageParams({
          wsl: wsl.filter((i) => i !== item),
        });
      },
      clear: () => {
        setPageParams({ wsl: [] });
      },
    });
  }

  return (
    <TableFilterChipsBase
      clearAll={() => {
        setPageParams({
          accessGroups: [],
          autoinstallFiles: [],
          availabilityZones: [],
          employeeGroups: [],
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
        });
      }}
      filters={filters}
    />
  );
};

export default TableFilterChips;
