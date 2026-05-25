import type { Instance } from "@/types/Instance";
import { createTablePropGetters } from "@/utils/table";

export const { getCellProps, getRowProps } = createTablePropGetters<Instance>({
  itemTypeName: "script instance",
  headerColumnId: "title",
});
