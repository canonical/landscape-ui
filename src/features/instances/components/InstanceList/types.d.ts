import type { Instance } from "@/types/Instance";
import type { CellProps, Column } from "react-table";

export interface InstanceColumn extends Column<Instance> {
  accessor: string;
  canBeHidden: boolean;
  optionLabel: string;
  getCellIcon?: (cell: CellProps<Instance>) => string | undefined;
}
