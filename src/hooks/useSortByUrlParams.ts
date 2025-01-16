import { useMemo } from "react";
import usePageParams from "./usePageParams";

type SortFunctions<T> = Record<string, (a: T, b: T) => number>;

export default function useSortByUrlParams<T>({
  data,
  sortFunctions,
}: {
  data: T[];
  sortFunctions: SortFunctions<T>;
}): T[] {
  const { sortBy, sort } = usePageParams();

  return useMemo(() => {
    const sorter = sortFunctions[sortBy];

    if (!sortBy || !sort || !sorter) {
      return data;
    }

    return data.toSorted((a, b) => {
      const result = sorter(a, b);
      return sort === "asc" ? result : -result;
    });
  }, [data, sortBy, sort, sortFunctions]);
}
