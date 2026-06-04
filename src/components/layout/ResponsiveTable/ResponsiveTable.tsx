import { BREAKPOINT_PX } from "@/constants";
import {
  ModularTable,
  type ModularTableProps,
} from "@canonical/react-components";
import classNames from "classnames";
import { type JSX } from "react";
import { useMediaQuery } from "usehooks-ts";
import classes from "./ResponsiveTable.module.scss";

const DEFAULT_MIN_TABLE_WIDTH = 950;

export interface ResponsiveTableProps<
  Row extends Record<string, unknown> = Record<string, unknown>,
> extends ModularTableProps<Row> {
  readonly minWidth?: number;
}

export default function ResponsiveTable<
  Row extends Record<string, unknown> = Record<string, unknown>,
>({
  style,
  minWidth = DEFAULT_MIN_TABLE_WIDTH,
  ...tableProps
}: ResponsiveTableProps<Row>): JSX.Element {
  const isSmall = useMediaQuery(`(max-width: ${BREAKPOINT_PX.sm}px)`);

  const [firstColumn, ...remainingColumns] = tableProps.columns;

  const shouldDecorateFirstColumn = !isSmall && firstColumn;

  const columns = shouldDecorateFirstColumn
    ? [
        {
          ...firstColumn,
          className: classNames(firstColumn.className, classes.firstColumn),
        },
        ...remainingColumns,
      ]
    : tableProps.columns;

  return (
    <div className={classes.responsiveTable} style={style}>
      <ModularTable {...tableProps} columns={columns} style={{ minWidth }} />
    </div>
  );
}
