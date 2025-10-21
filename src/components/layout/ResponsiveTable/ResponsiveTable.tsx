import { BREAKPOINT_PX } from "@/constants";
import {
  ModularTable,
  type ModularTableProps,
} from "@canonical/react-components";
import classNames from "classnames";
import type { JSX } from "react";
import { useMediaQuery } from "usehooks-ts";
import classes from "./ResponsiveTable.module.scss";

export interface ResponsiveTableProps<
  Row extends Record<string, unknown> = Record<string, unknown>,
> extends ModularTableProps<Row> {
  readonly minWidth?: number;
}

export default function ResponsiveTable<
  Row extends Record<string, unknown> = Record<string, unknown>,
>({
  ref,
  style,
  minWidth = 1024,
  columns,
  ...tableProps
}: ResponsiveTableProps<Row>): JSX.Element {
  const isSmall = useMediaQuery(`(max-width: ${BREAKPOINT_PX.sm}px)`);

  columns = isSmall
    ? columns
    : [
        {
          ...columns[0],
          className: classNames(columns[0].className, classes.firstColumn),
        },
        ...columns.slice(1),
      ];

  return (
    <div className={classes.responsiveTable} style={style}>
      <ModularTable
        ref={ref}
        style={{ minWidth }}
        columns={columns}
        {...tableProps}
      />
    </div>
  );
}
