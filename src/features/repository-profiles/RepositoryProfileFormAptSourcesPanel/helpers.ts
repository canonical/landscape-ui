import { APTSource } from "@/types/APTSource";

export const getFilteredAptSources = (
  aptSources: APTSource[],
  searchText: string,
) => {
  return searchText
    ? aptSources.filter(
        ({ name, line }) => name.match(searchText) || line.match(searchText),
      )
    : aptSources;
};
