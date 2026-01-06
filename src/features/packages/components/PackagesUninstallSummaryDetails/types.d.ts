import type { Column } from "react-table";

export interface InstanceColumn
  extends Column<InstancePackageInfoWithInstanceId> {
  accessor: string;
}
