import { pluralize } from "@/utils/_helpers";

export const getExportTitle = ({
  isAllSelected,
  selectedCount,
  activityCount,
}: {
  isAllSelected: boolean;
  selectedCount: number;
  activityCount: number | undefined;
}): string => {
  if (!isAllSelected && selectedCount > 0) {
    return `Export ${pluralize(selectedCount, ["activity", "activities"], "exact")} as TSV`;
  }
  if (activityCount !== undefined) {
    return `Export ${pluralize(activityCount, ["activity", "activities"], "exact")} as TSV`;
  }
  return "Export activities as TSV";
};
