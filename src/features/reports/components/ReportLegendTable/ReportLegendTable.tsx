import { Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import classes from "./ReportLegendTable.module.scss";

export interface ReportLegendRow {
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
}) => (
  <table className={classNames(classes.table, variant === "bar" && classes.bar)}>
    <thead>
      <tr>
        <th scope="col" className={classes.markerCell}>
          {markerHeader}
        </th>
        <th scope="col" className={classes.labelCell}>
          {labelHeader}
        </th>
        <th scope="col" className={classes.countCell}>
          {countHeader}
        </th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.key}
          className={classNames({
            [classes.rowActive]: activeKey === row.key,
            [classes.rowDimmed]: activeKey != null && activeKey !== row.key,
          })}
          onMouseEnter={
            onRowHover
              ? () => {
                  onRowHover(row.key);
                }
              : undefined
          }
          onMouseLeave={
            onRowHover
              ? () => {
                  onRowHover(null);
                }
              : undefined
          }
          onFocus={
            onRowHover
              ? () => {
                  onRowHover(row.key);
                }
              : undefined
          }
          onBlur={
            onRowHover
              ? () => {
                  onRowHover(null);
                }
              : undefined
          }
        >
          <td className={classes.markerCell}>{row.marker}</td>
          <td className={classes.labelCell}>
            {row.detail ? (
              <span className={classes.labelWithHelp}>
                {row.label}
                <Tooltip message={row.detail} position="top-center">
                  <i
                    className="p-icon--help"
                    role="img"
                    aria-label={row.detail}
                  />
                </Tooltip>
              </span>
            ) : (
              <span>{row.label}</span>
            )}
          </td>
          <td className={classes.countCell}>
            {row.countHref && row.count > 0 ? (
              <Link
                to={row.countHref}
                aria-label={row.countAriaLabel}
                onClick={row.onCountActivate}
              >
                {row.count.toLocaleString()}
              </Link>
            ) : (
              <span className={row.count === 0 ? classes.countZero : undefined}>
                {row.count.toLocaleString()}
              </span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ReportLegendTable;
