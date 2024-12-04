import { SavedSearch } from "@/types/SavedSearch";
import { ExtendedSearchAndFilterChip } from "./types";

export const parseSearchToChips = (
  search: string,
  savedSearches?: SavedSearch[],
): ExtendedSearchAndFilterChip[] => {
  if (!search) {
    return [];
  }

  return search.split(",").map((searchParam): ExtendedSearchAndFilterChip => {
    const savedSearch = savedSearches?.find(({ name }) => name === searchParam);
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

export const getChipLabel = (chip: ExtendedSearchAndFilterChip) => {
  if (chip.title) {
    return chip.title;
  }

  if (chip.quoteValue) {
    return `'${chip.value}'`;
  }

  return chip.value;
};
