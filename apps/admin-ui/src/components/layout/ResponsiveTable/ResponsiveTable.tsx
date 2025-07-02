import type { JSX } from "react";
import {
  ModularTable,
  type ModularTableProps,
} from "@canonical/react-components";
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
  ...tableProps
}: ResponsiveTableProps<Row>): JSX.Element {
  return (
    <div className={classes.responsiveTable} style={style}>
      <ModularTable ref={ref} style={{ minWidth }} {...tableProps} />
    </div>
  );
}
