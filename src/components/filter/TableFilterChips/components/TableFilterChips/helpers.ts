import type { SelectOption } from "@/types/SelectOption";

export const parseSearchQuery = (searchQuery: string) => {
  if (!searchQuery) {
    return [];
  }

  return searchQuery
    .split(",")
    .filter((searchQueryParam) => searchQueryParam.trim() !== "")
    .map((searchQueryParam) => ({
      label: `'${searchQueryParam}'`,
      value: searchQueryParam,
    }));
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

export const getItem = (
  options: SelectOption[] | undefined,
  valueToFind: string,
) => {
  if (!valueToFind) {
    return undefined;
  }

  return (
    options?.find((option) => option.value === valueToFind)?.label ??
    valueToFind
  );
};

export const getItems = (
  options: SelectOption[] | undefined,
  values: string[],
) =>
  options
    ? values.filter(Boolean).map(
        (value) =>
          options?.find((option) => option.value === value) ?? {
            label: value,
            value,
          },
      )
    : [];

export const filterItem = (items: unknown[], value: unknown) => {
  return items.filter((item) => item !== value);
};

export const getPassRate = (passRate: number, defaultValue: number) => {
  return passRate === defaultValue ? undefined : `${passRate}%`;
};
