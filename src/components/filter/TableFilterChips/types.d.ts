import type usePageParams from "@/hooks/usePageParams";
import type { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";

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
  | "query"
  | "passRateFrom"
  | "passRateTo"
  | "wsl"
>;

export type FilterKey = keyof FilterType;

export interface ExtendedSearchAndFilterChip extends SearchAndFilterChip {
  title?: string;
}

interface CheckRenderConditionsParams extends FilterType {
  filtersToMonitor: FilterKey[];
}

export type PluralChipsKey = keyof {
  [key in FilterKey as FilterType[key] extends string[]
    ? `are${Capitalize<key>}ChipsRender`
    : never]: unknown;
};

export type SingularChipKey = keyof {
  [key in FilterKey as FilterType[key] extends string[]
    ? never
    : `is${Capitalize<key>}ChipRender`]: unknown;
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
