import type { Row, CellProps } from "react-table";
import "react-table";

declare module "react-table" {
  export interface ColumnInterface {
    meta?: {
      ariaLabel?: string | ((row: Row<D>) => string);
      isExpandable?: boolean;
    };
    className?: string;
    getCellIcon?: (props: CellProps<D>) => React.ReactNode;
    disableSortBy?: boolean;
    sortType?: SortByFn<D> | DefaultSortTypes | string;
    sortDescFirst?: boolean;
  }
}
