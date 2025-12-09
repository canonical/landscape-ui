import type { SavedSearch } from "../../types";

interface GetFilteredSavedSearchesParams {
  inputText: string;
  savedSearches: SavedSearch[] | undefined;
  search: string;
}

export const getFilteredSavedSearches = ({
  inputText,
  savedSearches,
  search,
}: GetFilteredSavedSearchesParams) => {
  if (!savedSearches) {
    return [];
  }

  let filteredSearches = savedSearches;

  if (search) {
    const searchParams = search.split(",").filter(Boolean);

    filteredSearches = filteredSearches.filter(({ name }) =>
      searchParams.every((param) => param !== `search:${name}`),
    );
  }

  if (inputText) {
    const lowerInputText = inputText.trim().toLowerCase();
    filteredSearches = filteredSearches.filter(
      ({ name, search: searchQuery }) =>
        name.toLowerCase().includes(lowerInputText) ||
        searchQuery.toLowerCase().includes(lowerInputText),
    );
  }

  return filteredSearches;
};
