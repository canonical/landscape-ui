import type { FC } from "react";
import TableFilterCustom from "./components/TableFilterCustom";
import TableFilterMultiple from "./components/TableFilterMultiple";
import TableFilterSingle from "./components/TableFilterSingle";
import type { TableFilterProps } from "./types";

const TableFilter: FC<TableFilterProps> = (props) => {
  switch (props.type) {
    case "single":
      return <TableFilterSingle {...props} />;
    case "multiple":
      return <TableFilterMultiple {...props} />;
    case "custom": {
      return <TableFilterCustom {...props} />;
    }
  }
};

export default TableFilter;
