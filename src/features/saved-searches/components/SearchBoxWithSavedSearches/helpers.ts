import { SavedSearch } from "@/types/SavedSearch";
import { ExtendedSearchAndFilterChip } from "../../types";

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
