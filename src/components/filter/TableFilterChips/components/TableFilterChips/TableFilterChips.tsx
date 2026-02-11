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
  readonly onChange?: () => void;
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
  onChange,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
  wslOptions,
}) => {
  const { setPageParams, ...pageParams } = usePageParams();

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
      onChange?.();
    };
  };

  const createClearer = (newParams: Partial<PageParams>) => {
    return () => {
      setPageParams(newParams);
      onChange?.();
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
        clear: createClearer({ query: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("search"),
      value: {
        label: "Search",
        item: search,
        clear: createClearer({ search: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("status"),
      value: {
        label: "Status",
        item: getItem(statusOptions, status),
        clear: createClearer({ status: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("os"),
      value: {
        label: "OS",
        item: getItem(osOptions, os),
        clear: createClearer({ os: "" }),
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
        clear: createClearer({ availabilityZones: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("accessGroups"),
      value: {
        label: "Access group",
        multiple: true as const,
        items: getItems(accessGroupOptions, accessGroups),
        remove: createRemover("accessGroups", filterItem),
        clear: createClearer({ accessGroups: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("tags"),
      value: {
        label: "Tag",
        multiple: true as const,
        items: getItems(tagOptions, tags),
        remove: createRemover("tags", filterItem),
        clear: createClearer({ tags: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("fromDate"),
      value: {
        label: "From",
        item: fromDate,
        clear: createClearer({ fromDate: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("toDate"),
      value: {
        label: "To",
        item: toDate,
        clear: createClearer({ toDate: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("passRateFrom"),
      value: {
        label: "From pass rate",
        item: getPassRate(passRateFrom, 0),
        clear: createClearer({ passRateFrom: 0 }),
      },
    },
    {
      condition: filtersToDisplay.includes("passRateTo"),
      value: {
        label: "To",
        item: getPassRate(passRateTo, 100),
        clear: createClearer({ passRateTo: 100 }),
      },
    },
    {
      condition: filtersToDisplay.includes("type"),
      value: {
        label: "Type",
        item: getItem(typeOptions, type),
        clear: createClearer({ type: "" }),
      },
    },
    {
      condition: filtersToDisplay.includes("wsl"),
      value: {
        label: "WSL",
        multiple: true as const,
        items: getItems(wslOptions, wsl),
        remove: createRemover("wsl", filterItem),
        clear: createClearer({ wsl: [] }),
      },
    },
    {
      condition: filtersToDisplay.includes("contractExpiryDays"),
      value: {
        label: "Contract expiry",
        item: getItem(contractExpiryOptions, contractExpiryDays),
        clear: createClearer({ contractExpiryDays: "" }),
      },
    },
  ]
    .filter(({ condition }) => condition)
    .map(({ value }) => value);

  const clearAll = createClearer({
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
