import { SavedSearch } from "@/types/SavedSearch";
import { ExtendedSearchAndFilterChip } from "../../types";

export const areChipArraysEqual = (
  chipArray1: ExtendedSearchAndFilterChip[],
  chipArray2: ExtendedSearchAndFilterChip[],
) => {
  return (
    chipArray1.length === chipArray2.length &&
    chipArray1.every((chip, index) => {
      return chip.value === chipArray2[index].value;
    })
  );
};

export const parseSearchToChips = (
  search: string,
  savedSearches: SavedSearch[] | undefined,
): ExtendedSearchAndFilterChip[] => {
  if (!search || !savedSearches) {
    return [];
  }

  return search.split(",").map((searchParam): ExtendedSearchAndFilterChip => {
    const savedSearch = savedSearches.find(({ name }) => name === searchParam);
    return savedSearch
      ? {
          lead: "search",
          title: savedSearch.name,
          value: savedSearch.name,
        }
      : {
          value: searchParam,
          quoteValue: true,
        };
  });
};
