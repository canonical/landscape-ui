import { SelectOption } from "./SelectOption";

interface ListFilterBase {
  label: string;
}

interface ListFilterInput {
  type: "text" | "date" | "checkbox";
}

interface ListFilterSelect {
  type: "select" | "multi-select";
  options: SelectOption[];
}

export type ListFilter = ListFilterBase & (ListFilterInput | ListFilterSelect);
