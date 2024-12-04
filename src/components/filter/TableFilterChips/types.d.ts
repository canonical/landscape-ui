import { usePageParams } from "@/hooks/usePageParams";
import { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";

export type FilterType = Pick<
  ReturnType<typeof usePageParams>,
  | "accessGroups"
  | "availabilityZones"
  | "fromDate"
  | "os"
  | "search"
  | "status"
  | "tags"
  | "toDate"
  | "type"
>;

export type FilterKey = keyof FilterType;

export interface ExtendedSearchAndFilterChip extends SearchAndFilterChip {
  title?: string;
}

interface CheckRenderConditionsParams extends FilterType {
  filtersToMonitor: FilterKey[];
  useSearchAsQuery: boolean;
}

export type PluralChipsKey = keyof {
  [key in FilterKey as FilterType[key] extends string[]
    ? `are${Capitalize<key>}ChipsRender`
    : never]: unknown;
};

export type SingularChipKey = keyof {
  [key in FilterKey as FilterType[key] extends string
    ? `is${Capitalize<key>}ChipRender`
    : never]: unknown;
};

export type CheckRenderConditionsReturn = {
  [key in FilterKey as FilterType[key] extends string[]
    ? PluralChipsKey
    : SingularChipKey]?: boolean;
} & {
  totalChipsToRenderCount: number;
  areSearchQueryChipsRender?: boolean;
};

export type CheckRenderConditions = (
  params: CheckRenderConditionsParams,
) => CheckRenderConditionsReturn;
