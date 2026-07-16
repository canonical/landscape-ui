import { ModularTable, Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, HTMLProps, ReactNode } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column, Row, TableRowProps } from "react-table";
import classes from "./ReportLegendTable.module.scss";

// Extends `Record<string, unknown>` so it satisfies ModularTable's data
// constraint (react-table's generic requires an index signature).
export interface ReportLegendRow extends Record<string, unknown> {
  readonly key: string;
  readonly marker: ReactNode;
  readonly label: string;
  readonly detail?: string;
  readonly count: number;
  /** Deep-link URL the count navigates to (omitted, or with a zero count,
   *  renders the count as plain text). */
  readonly countHref?: string;
  /** Side effect to run when the count link is activated, e.g. closing the
   *  side panel. */
  readonly onCountActivate?: () => void;
  readonly countAriaLabel?: string;
}

interface ReportLegendTableProps {
  readonly variant: "dot" | "bar";
  readonly markerHeader?: string;
  readonly labelHeader: string;
  readonly countHeader: string;
  readonly rows: readonly ReportLegendRow[];
  readonly activeKey?: string | null;
  readonly onRowHover?: (key: string | null) => void;
}

const ReportLegendTable: FC<ReportLegendTableProps> = ({
  variant,
  markerHeader,
  labelHeader,
  countHeader,
  rows,
  activeKey,
  onRowHover,
}) => {
  const columns = useMemo<Column<ReportLegendRow>[]>(
    () => [
      {
        id: "marker",
        Header: markerHeader ?? "",
        className: classes.markerCell,
        Cell: ({ row: { original } }: CellProps<ReportLegendRow>) => (
          <>{original.marker}</>
        ),
      },
      {
        id: "label",
        Header: labelHeader,
        className: classes.labelCell,
        Cell: ({ row: { original } }: CellProps<ReportLegendRow>) =>
          original.detail ? (
            <span className={classes.labelWithHelp}>
              {original.label}
              <Tooltip message={original.detail} position="top-center">
                <i
                  className="p-icon--help"
                  role="img"
                  aria-label={original.detail}
                />
              </Tooltip>
            </span>
          ) : (
            <span>{original.label}</span>
          ),
      },
      {
        id: "count",
        Header: countHeader,
        className: classes.countCell,
        Cell: ({ row: { original } }: CellProps<ReportLegendRow>) =>
          original.countHref && original.count > 0 ? (
            <Link
              to={original.countHref}
              aria-label={original.countAriaLabel}
              onClick={original.onCountActivate}
            >
              {original.count.toLocaleString()}
            </Link>
          ) : (
            <span
              className={original.count === 0 ? classes.countZero : undefined}
            >
              {original.count.toLocaleString()}
            </span>
          ),
      },
    ],
    [markerHeader, labelHeader, countHeader],
  );

  const data = useMemo(() => [...rows], [rows]);

  // Hover coordination with the donut chart: the hovered row stays full
  // strength while the rest dim, so the matching segment reads clearly. Keyboard
  // focus mirrors the hover so the highlight is reachable without a pointer.
  const getRowProps = (
    row: Row<ReportLegendRow>,
  ): Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> => {
    const { key } = row.original;
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> = {
      className: classNames({
        [classes.rowActive]: activeKey === key,
        [classes.rowDimmed]: activeKey != null && activeKey !== key,
      }),
    };

    if (onRowHover) {
      rowProps.onMouseEnter = () => {
        onRowHover(key);
      };
      rowProps.onMouseLeave = () => {
        onRowHover(null);
      };
      rowProps.onFocus = () => {
        onRowHover(key);
      };
      rowProps.onBlur = () => {
        onRowHover(null);
      };
    }

    return rowProps;
  };

  return (
    <ModularTable
      className={classNames(classes.table, variant === "bar" && classes.bar)}
      columns={columns}
      data={data}
      getRowProps={getRowProps}
    />
  );
};

export default ReportLegendTable;
