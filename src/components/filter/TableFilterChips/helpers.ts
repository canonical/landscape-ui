import {
  CheckRenderConditions,
  CheckRenderConditionsReturn,
  PluralChipsKey,
  SingularChipKey,
} from "./types";
import { SelectOption } from "@/types/SelectOption";

export const parseSearch = (search: string) => {
  if (!search) {
    return [];
  }

  return search.split(",").map((searchParam) => {
    return searchParam.startsWith("search:")
      ? searchParam.replace("search:", "")
      : `'${searchParam}'`;
  });
};

export const filterSearch = (search: string, chipValue: string) => {
  return search
    .split(",")
    .filter((searchParam) =>
      chipValue.startsWith("'")
        ? searchParam !== chipValue.replace(/'/g, "")
        : searchParam !== `search:${chipValue}`,
    )
    .join(",");
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
  useSearchAsQuery,
  search,
  ...urlParams
}) => {
  const result = { totalChipsToRenderCount: 0 } as CheckRenderConditionsReturn;

  if (filtersToMonitor.includes("search")) {
    result.areSearchQueryChipsRender = useSearchAsQuery && Boolean(search);
    result.isSearchChipRender = !useSearchAsQuery && Boolean(search);

    result.totalChipsToRenderCount += useSearchAsQuery
      ? search.split(",").length
      : Number(result.isSearchChipRender);
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

        const resultValue = Boolean(value);

        result[resultKey] = resultValue;
        result.totalChipsToRenderCount += Number(resultValue);
      }
    }
  }

  return result;
};
