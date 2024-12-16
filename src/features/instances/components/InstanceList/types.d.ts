import { Instance } from "@/types/Instance";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";

export interface InstanceColumn extends Column<Instance> {
  accessor: string;
  canBeHidden: boolean;
  optionLabel: string;
  getCellIcon?: (cell: CellProps<Instance>) => string | undefined;
}
