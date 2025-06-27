import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { ComponentProps, FC } from "react";
import { defaultFiltersToDisplay } from "../../constants";
import {
  filterSearchQuery,
  getChipLabel,
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
  } = usePageParams();

  const filters: ComponentProps<typeof TableFilterChipsBase>["filters"] = [];

  if (filtersToDisplay.includes("query")) {
    filters.push({
      label: "Query",
      multiple: true,
      values: parseSearchQuery(query),
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
      value: search,
      clear: () => {
        setPageParams({ search: "" });
      },
    });
  }

  if (filtersToDisplay.includes("status")) {
    filters.push({
      label: "Status",
      value: getChipLabel(statusOptions, status),
      clear: () => {
        setPageParams({ status: "" });
      },
    });
  }

  if (filtersToDisplay.includes("os")) {
    filters.push({
      label: "OS",
      value: getChipLabel(osOptions, os),
      clear: () => {
        setPageParams({ os: "" });
      },
    });
  }

  if (filtersToDisplay.includes("availabilityZones")) {
    filters.push({
      label: "Availability z.",
      multiple: true,
      values: availabilityZones.map((availabilityZone) =>
        getChipLabel(availabilityZonesOptions, availabilityZone),
      ),
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
      values: accessGroups.map((accessGroup) =>
        getChipLabel(accessGroupOptions, accessGroup),
      ),
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
      values: autoinstallFiles.map((autoinstallFile) =>
        getChipLabel(autoinstallFileOptions, autoinstallFile),
      ),
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
      values: employeeGroups.map((employeeGroup) =>
        getChipLabel(employeeGroupOptions, employeeGroup),
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
      values: tags.map((tag) => getChipLabel(tagOptions, tag)),
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
      value: fromDate,
      clear: () => {
        setPageParams({ fromDate: "" });
      },
    });
  }

  if (filtersToDisplay.includes("toDate")) {
    filters.push({
      label: "To",
      value: toDate,
      clear: () => {
        setPageParams({ toDate: "" });
      },
    });
  }

  if (filtersToDisplay.includes("passRateFrom")) {
    filters.push({
      label: "From pass rate",
      value: `${passRateFrom}%`,
      clear: () => {
        setPageParams({ passRateFrom: 0 });
      },
    });
  }

  if (filtersToDisplay.includes("passRateTo")) {
    filters.push({
      label: "To",
      value: `${passRateTo}%`,
      clear: () => {
        setPageParams({ passRateTo: 100 });
      },
    });
  }

  if (filtersToDisplay.includes("type")) {
    filters.push({
      label: "Type",
      value: getChipLabel(typeOptions, type),
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
        });
      }}
      filters={filters}
    />
  );
};

export default TableFilterChips;
