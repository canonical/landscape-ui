import type { ForwardedRef, JSX, Ref } from "react";
import { forwardRef } from "react";
import type { ModularTableProps } from "@canonical/react-components";
import { ModularTable } from "@canonical/react-components";
import classes from "./ResponsiveTable.module.scss";

interface ResponsiveTableProps<D extends Record<string, unknown>>
  extends ModularTableProps<D> {
  readonly minWidth?: number;
}

function ResponsiveTableInner<Row extends Record<string, unknown>>(
  { minWidth = 1024, style, ...tableProps }: ResponsiveTableProps<Row>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  return (
    <div className={classes.responsiveTable} style={style}>
      <ModularTable ref={ref} style={{ minWidth }} {...tableProps} />
    </div>
  );
}

type ResponsiveTableComponent = <
  Row extends Record<string, unknown> = Record<string, unknown>,
>(
  props: ResponsiveTableProps<Row> & { ref?: Ref<HTMLTableElement> },
) => JSX.Element;

const ResponsiveTable = forwardRef(
  ResponsiveTableInner,
) as ResponsiveTableComponent;

export default ResponsiveTable;
