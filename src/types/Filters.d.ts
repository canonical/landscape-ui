import { SelectOption } from "./SelectOption";

interface ListFilterBase {
  label: string;
  slug: string;
}

interface ListFilterInput {
  type: "text" | "date" | "checkbox";
}

interface FilterOption extends SelectOption {
  query?: string;
}

interface ListFilterSelect {
  type: "select" | "multi-select";
  options: FilterOption[];
}

export type ListFilter = ListFilterBase & (ListFilterInput | ListFilterSelect);
