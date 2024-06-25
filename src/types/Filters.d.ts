import { SelectOption } from "./SelectOption";

interface ListFilterBase {
  label: string;
  slug: string;
}

interface ListFilterInput {
  type: "text" | "date" | "checkbox" | "file";
}

interface ListFilterSelect {
  type: "select" | "multi-select";
  options: SelectOption[];
}

export type ListFilter = ListFilterBase & (ListFilterInput | ListFilterSelect);
