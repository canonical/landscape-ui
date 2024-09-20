import { ListFilter } from "@/types/Filters";

export const getOptionQuery = (filter: ListFilter, optionValue: string) => {
  return filter.type === "select"
    ? (filter.options.find((option) => option.value === optionValue)?.query ??
        "")
    : "";
};
