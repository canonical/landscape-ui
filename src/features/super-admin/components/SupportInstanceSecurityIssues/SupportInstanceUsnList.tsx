import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  getTableRows,
  getUsnListCellProps,
  getUsnListRowProps,
  getUsnsWithExpanded,
} from "@/features/usns";
import date from "@/libs/date";
import type { ExpandedCell } from "@/types/ExpandedCell";
import type { Instance } from "@/types/Instance";
import type { Usn } from "@/types/Usn";
import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import SupportInstanceUsnPackages from "./SupportInstanceUsnPackages";
import classes from "./SupportInstanceUsnList.module.scss";

interface SupportInstanceUsnListProps {
  readonly name: string;
  readonly instance: Instance;
  readonly usns: Usn[];
  readonly search: string;
}

/** The security issues of an instance, without selection or actions. */
const SupportInstanceUsnList: FC<SupportInstanceUsnListProps> = ({
  name,
  instance,
  usns,
  search,
}) => {
  const [expandedCell, setExpandedCell] = useState<ExpandedCell>(null);

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);
  const expandedCveRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    expandedCveRowRef.current =
      expandedCell?.column === "cves"
        ? (tableRowsRef.current[expandedCell.row] ?? null)
        : null;
  }, [expandedCell]);

  useOnClickOutside(expandedCveRowRef, () => {
    if (expandedCell?.column === "cves") {
      setExpandedCell(null);
    }
  });

  useEventListener("keydown", (event) => {
    if (event.key === "Escape" && expandedCell?.column === "cves") {
      setExpandedCell(null);
    }
  });

  const securityIssues = useMemo<Usn[]>(
    (): Usn[] => getUsnsWithExpanded({ expandedCell, usns }),
    [usns, expandedCell],
  );

  const handleExpandCellClick = useCallback(
    (columnId: string, rowIndex: number) => {
      setExpandedCell((prevState) => {
        if (prevState?.column === columnId && prevState.row === rowIndex) {
          return null;
        }

        // An expanded packages row above shifts the clicked row down by one.
        return {
          column: columnId,
          row:
            prevState?.column === "release_packages" && prevState.row < rowIndex
              ? rowIndex - 1
              : rowIndex,
        };
      });
    },
    [],
  );

  const columns = useMemo<Column<Usn>[]>(
    () => [
      {
        accessor: "usn",
        Header: "USN",
        Cell: ({ row }: CellProps<Usn>) => {
          if (
            expandedCell?.column === "release_packages" &&
            expandedCell.row === row.index - 1
          ) {
            return (
              <SupportInstanceUsnPackages
                name={name}
                instance={instance}
                usn={securityIssues[expandedCell.row]?.usn ?? ""}
              />
            );
          }

          return (
            <a
              href={row.original.usn_link}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {row.original.usn}
            </a>
          );
        },
      },
      {
        accessor: "cves",
        Header: "CVE(s)",
        Cell: ({ row: { original, index } }: CellProps<Usn>) =>
          original.cves.length > 0 ? (
            <TruncatedCell
              content={original.cves.map(({ cve, cve_link }) => (
                <span key={cve} className={classes.cve}>
                  <a
                    href={cve_link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={classes.cveLink}
                  >
                    {cve}
                  </a>
                </span>
              ))}
              isExpanded={
                expandedCell?.column === "cves" && expandedCell.row === index
              }
              onExpand={() => {
                handleExpandCellClick("cves", index);
              }}
            />
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "date",
        Header: "Date published",
        Cell: ({ row: { original } }: CellProps<Usn>) =>
          date(original.date).isValid() ? (
            <span className="font-monospace">
              {date(original.date).format(DISPLAY_DATE_TIME_FORMAT)}
            </span>
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "release_packages",
        Header: "Affected packages",
        Cell: ({ column, row: { index } }: CellProps<Usn>) => {
          const isExpanded =
            expandedCell?.column === column.id && expandedCell.row === index;

          return (
            <Button
              type="button"
              className={classNames("p-accordion__tab", classes.expandButton)}
              aria-expanded={isExpanded}
              onClick={() => {
                handleExpandCellClick(column.id, index);
              }}
            >
              {`${isExpanded ? "Hide" : "Show"} packages`}
            </Button>
          );
        },
      },
    ],
    [expandedCell, securityIssues, name, instance, handleExpandCellClick],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ResponsiveTable
        columns={columns}
        data={securityIssues}
        getCellProps={getUsnListCellProps({ expandedCell })}
        getRowProps={getUsnListRowProps(expandedCell)}
        emptyMsg={`No security issues found with the search "${search}"`}
      />
    </div>
  );
};

export default SupportInstanceUsnList;
