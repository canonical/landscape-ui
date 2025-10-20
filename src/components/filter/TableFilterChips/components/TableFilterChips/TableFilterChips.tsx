import usePageParams from "@/hooks/usePageParams";
import type { PageParams } from "@/libs/pageParamsManager";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import { defaultFiltersToDisplay } from "../../constants";
import type { FilterKey } from "../../types";
import TableFilterChipsBase from "../TableFilterChipsBase";
import {
  filterItem,
  filterSearchQuery,
  getItem,
  getItems,
  getPassRate,
  parseSearchQuery,
} from "./helpers";

interface TableFilterChipsProps {
  readonly accessGroupOptions?: SelectOption[];
  readonly availabilityZonesOptions?: SelectOption[];
  readonly contractExpiryOptions?: SelectOption[];
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
  contractExpiryOptions,
  filtersToDisplay = defaultFiltersToDisplay,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
  wslOptions,
}) => {
  const { setPageParams, createPageParamsSetter, ...pageParams } =
    usePageParams();

  const {
    accessGroups,
    availabilityZones,
    contractExpiryDays,
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
  } = pageParams;

  const createRemover = <T extends keyof PageParams>(
    pageParamKey: T,
    remove: (items: PageParams[T], value: string) => unknown,
  ) => {
    return (value: string) => {
      setPageParams({
        [pageParamKey]: remove(pageParams[pageParamKey], value),
      });
    };
  };

  const filters = [
    {
      condition: filtersToDisplay.includes("query"),
      value: {
        label: "Query",
        multiple: true as const,
        items: parseSearchQuery(query),
        remove: createRemover("query", filterSearchQuery),
        clear: createPageParamsSetter({ query: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("search"),
      value: {
        label: "Search",
        item: search,
        clear: createPageParamsSetter({ search: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("status"),
      value: {
        label: "Status",
        item: getItem(statusOptions, status),
        clear: createPageParamsSetter({ status: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("os"),
      value: {
        label: "OS",
        item: getItem(osOptions, os),
        clear: createPageParamsSetter({ os: "" }),
      },
    },
    {
      condition:
        filtersToDisplay.includes("availabilityZones") &&
        availabilityZonesOptions !== undefined,
      value: {
        label: "Availability z.",
        multiple: true as const,
        items: getItems(availabilityZonesOptions, availabilityZones),
        remove: createRemover("availabilityZones", filterItem),
        clear: createPageParamsSetter({ availabilityZones: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("accessGroups"),
      value: {
        label: "Access group",
        multiple: true as const,
        items: getItems(accessGroupOptions, accessGroups),
        remove: createRemover("accessGroups", filterItem),
        clear: createPageParamsSetter({ accessGroups: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("tags"),
      value: {
        label: "Tag",
        multiple: true as const,
        items: getItems(tagOptions, tags),
        remove: createRemover("tags", filterItem),
        clear: createPageParamsSetter({ tags: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("fromDate"),
      value: {
        label: "From",
        item: fromDate,
        clear: createPageParamsSetter({ fromDate: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("toDate"),
      value: {
        label: "To",
        item: toDate,
        clear: createPageParamsSetter({ toDate: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("passRateFrom"),
      value: {
        label: "From pass rate",
        item: getPassRate(passRateFrom, 0),
        clear: createPageParamsSetter({ passRateFrom: 0 }),
      },
    },
    {
      condition: filtersToDisplay.includes("passRateTo"),
      value: {
        label: "To",
        item: getPassRate(passRateTo, 100),
        clear: createPageParamsSetter({ passRateTo: 100 }),
      },
    },
    {
      condition: filtersToDisplay.includes("type"),
      value: {
        label: "Type",
        item: getItem(typeOptions, type),
        clear: createPageParamsSetter({ type: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("wsl"),
      value: {
        label: "WSL",
        multiple: true as const,
        items: getItems(wslOptions, wsl),
        remove: createRemover("wsl", filterItem),
        clear: createPageParamsSetter({ wsl: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("contractExpiryDays"),
      value: {
        label: "Contract expiry",
        item: getItem(contractExpiryOptions, contractExpiryDays),
        clear: createPageParamsSetter({ contractExpiryDays: "" }),
      },
    },
  ]
    .filter(({ condition }) => condition)
    .map(({ value }) => value);

  const clearAll = createPageParamsSetter({
    accessGroups: [],
    availabilityZones: [],
    contractExpiryDays: "",
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

  return <TableFilterChipsBase clearAll={clearAll} filters={filters} />;
};

export default TableFilterChips;
