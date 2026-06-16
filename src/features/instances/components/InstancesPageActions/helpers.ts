import { pluralize } from "@/utils/_helpers";

export const getExportTitle = ({
  isAllSelected,
  selectedCount,
  instanceCount,
}: {
  isAllSelected: boolean;
  selectedCount: number;
  instanceCount: number | undefined;
}): string => {
  if (!isAllSelected && selectedCount > 0) {
    return `Export ${pluralize(selectedCount, ["instance"], "exact")} as TSV`;
  }
  if (instanceCount !== undefined) {
    return `Export ${pluralize(instanceCount, ["instance"], "exact")} as TSV`;
  }
  return "Export instances as TSV";
};
