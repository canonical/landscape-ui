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
    filteredSearches = filteredSearches.filter(
      ({ name, search }) =>
        name.toLowerCase() !== inputText.trim().toLowerCase() &&
        search.toLowerCase() !== inputText.trim().toLowerCase(),
    );
  }

  return filteredSearches;
};
