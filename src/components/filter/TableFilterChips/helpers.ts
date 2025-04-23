import { PARAMS_CONFIG } from "@/libs/pageParamsManager/constants";
import type {
  CheckRenderConditions,
  CheckRenderConditionsReturn,
  PluralChipsKey,
  SingularChipKey,
} from "./types";
import type { SelectOption } from "@/types/SelectOption";

export const parseSearchQuery = (searchQuery: string) => {
  if (!searchQuery) {
    return [];
  }

  return searchQuery
    .split(",")
    .filter((searchQueryParam) => searchQueryParam.trim() !== "")
    .map((searchQueryParam) => `'${searchQueryParam}'`);
};

export const filterSearchQuery = (searchQuery: string, chipValue: string) => {
  const cleanedChipValue = chipValue.replace(/^'|'$/g, "");
  const searchParams = searchQuery.split(",");

  const indexToRemove = searchParams.indexOf(cleanedChipValue);

  if (indexToRemove === -1) {
    return searchQuery;
  }

  const updatedSearchParams = [
    ...searchParams.slice(0, indexToRemove),
    ...searchParams.slice(indexToRemove + 1),
  ];

  return updatedSearchParams.join(",");
};

export const getChipLabel = (
  options: SelectOption[] | undefined,
  valueToFind: string,
) => {
  return (
    options?.find((option) => option.value === valueToFind)?.label ??
    valueToFind
  );
};

export const checkRenderConditions: CheckRenderConditions = ({
  filtersToMonitor,
  search,
  query,
  ...urlParams
}) => {
  const result = { totalChipsToRenderCount: 0 } as CheckRenderConditionsReturn;

  if (filtersToMonitor.includes("query")) {
    result.areSearchQueryChipsRender = Boolean(query);
    result.totalChipsToRenderCount += query.trim()
      ? query.split(",").length
      : 0;
  } else if (filtersToMonitor.includes("search")) {
    result.isSearchChipRender = Boolean(search);
    result.totalChipsToRenderCount += Number(result.isSearchChipRender);
  }

  for (const [paramKey, value] of Object.entries(urlParams)) {
    const key = paramKey as keyof typeof urlParams;

    if (filtersToMonitor.includes(key)) {
      if (Array.isArray(value)) {
        const resultKey =
          `are${key.replace(/^\w/, (c) => c.toUpperCase())}ChipsRender` as PluralChipsKey;

        result[resultKey] = Boolean(value.length);
        result.totalChipsToRenderCount += value.length;
      } else {
        const resultKey =
          `is${key.replace(/^\w/, (c) => c.toUpperCase())}ChipRender` as SingularChipKey;

        const resultValue =
          PARAMS_CONFIG.find((param) => param.urlParam == key)?.defaultValue !=
          value;

        result[resultKey] = resultValue;
        result.totalChipsToRenderCount += Number(resultValue);
      }
    }
  }

  return result;
};
