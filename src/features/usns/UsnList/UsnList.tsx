import classNames from "classnames";
import moment from "moment/moment";
import { FC, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import ExpandableTable from "@/components/layout/ExpandableTable";
import OverflowingCell from "@/components/layout/OverflowingCell";
import UsnPackageList from "@/features/usns/UsnPackageList";
import { Usn } from "@/types/Usn";
import { USN_LOADING } from "./constants";
import { getUsnsWithExpanded, handleSecurityIssuesCellProps } from "./helpers";
import classes from "./UsnList.module.scss";
import { Instance } from "@/types/Instance";

type UsnListProps = {
  isUsnsLoading: boolean;
  usns: Usn[];
} & (
  | {
      instance: Instance;
      onSelectedUsnsChange: (usns: Usn[]) => void;
      search: string;
      selectedUsns: Usn[];
      tableType: "paginated";
    }
  | {
      instanceIds: number[];
      tableType: "expandable";
    }
);

const UsnList: FC<UsnListProps> = ({ isUsnsLoading, usns, ...otherProps }) => {
  const [usnLimit, setUsnLimit] = useState(5);
  const [expandedUsn, setExpandedUsn] = useState<string>("");
  const [innerTableLimit, setInnerTableLimit] = useState(5);

  const securityIssues = useMemo<Usn[]>(
    (): Usn[] =>
      isUsnsLoading
        ? [USN_LOADING]
        : getUsnsWithExpanded(
            usns,
            expandedUsn,
            otherProps.tableType,
            usnLimit,
          ),
    [usns, expandedUsn, isUsnsLoading, usnLimit, otherProps.tableType],
  );

  const selectedUsns =
    otherProps.tableType === "paginated" ? otherProps.selectedUsns : [];

  const handleToggleSingleUsn = (usn: Usn) => {
    if (otherProps.tableType === "expandable") {
      return;
    }

    const filteredUsns = selectedUsns.filter(
      (selectedUsn) => selectedUsn.usn !== usn.usn,
    );

    otherProps.onSelectedUsnsChange(
      selectedUsns.length !== filteredUsns.length
        ? filteredUsns
        : [...filteredUsns, usn],
    );
  };

  const securityIssueColumns = useMemo<Column<Usn>[]>(
    () =>
      [
        {
          accessor: "checkbox",
          className: classes.checkboxColumn,
          Header: () =>
            otherProps.tableType === "paginated" && (
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">
                    Toggle all security issues
                  </span>
                }
                disabled={
                  securityIssues.length === 0 ||
                  securityIssues[0].usn === "loading"
                }
                indeterminate={
                  selectedUsns.length > 0 && selectedUsns.length < usns.length
                }
                checked={
                  selectedUsns.length > 0 && selectedUsns.length === usns.length
                }
                onChange={() =>
                  otherProps.onSelectedUsnsChange(
                    selectedUsns.length > 0 ? [] : usns,
                  )
                }
              />
            ),
          Cell: ({ row }: CellProps<Usn>) =>
            otherProps.tableType === "paginated" && (
              <CheckboxInput
                labelClassName="u-no-margin--bottom u-no-padding--top"
                label={
                  <span className="u-off-screen">{`Toggle ${row.original.usn}`}</span>
                }
                name="usn"
                checked={selectedUsns.some(
                  ({ usn }) => usn === row.original.usn,
                )}
                onChange={() => handleToggleSingleUsn(row.original)}
              />
            ),
        },
        {
          accessor: "usn",
          Header: "USN",
          Cell: ({ row }: CellProps<Usn>) => {
            if (row.original.usn === "expandedUsn") {
              return otherProps.tableType === "expandable" ? (
                <UsnPackageList
                  isRemovable={false}
                  instanceIds={otherProps.instanceIds}
                  limit={innerTableLimit}
                  onLimitChange={() =>
                    setInnerTableLimit((prevState) => prevState + 5)
                  }
                  usn={expandedUsn}
                />
              ) : (
                <UsnPackageList
                  isRemovable={true}
                  instance={otherProps.instance}
                  limit={innerTableLimit}
                  onLimitChange={() =>
                    setInnerTableLimit((prevState) => prevState + 5)
                  }
                  usn={expandedUsn}
                />
              );
            }

            if (row.original.usn === "loading") {
              return <LoadingState />;
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
          Cell: ({ row }: CellProps<Usn>) => (
            <OverflowingCell
              items={row.original.cves.map(({ cve, cve_link }) => (
                <a
                  key={cve}
                  href={cve_link}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  {cve}
                </a>
              ))}
            />
          ),
        },
        {
          accessor: "date",
          Header: "Date published",
          Cell: ({ row }: CellProps<Usn>) => (
            <>
              {moment(row.original.date).isValid()
                ? moment(row.original.date).format(DISPLAY_DATE_FORMAT)
                : "---"}
            </>
          ),
        },
        {
          accessor: "release_packages",
          Header: "Affected packages",
          Cell: ({ row }: CellProps<Usn>) => (
            <>
              <Button
                type="button"
                className={classNames("p-accordion__tab", classes.expandButton)}
                aria-expanded={row.original.usn === expandedUsn}
                onClick={() => {
                  setExpandedUsn((prevState) =>
                    prevState === row.original.usn ? "" : row.original.usn,
                  );
                  setInnerTableLimit(5);
                }}
              >
                {`${row.original.usn === expandedUsn ? "Hide" : "Show"} packages`}
              </Button>
            </>
          ),
        },
      ].filter(
        ({ accessor }) =>
          otherProps.tableType === "paginated" || accessor !== "checkbox",
      ),
    [
      securityIssues,
      innerTableLimit,
      selectedUsns.length,
      otherProps.tableType,
    ],
  );

  return otherProps.tableType === "expandable" ? (
    <ExpandableTable
      columns={securityIssueColumns}
      data={securityIssues}
      getCellProps={handleSecurityIssuesCellProps(
        otherProps.tableType,
        expandedUsn,
      )}
      itemNames={{ plural: "security issues", singular: "security issue" }}
      limit={usnLimit}
      onLimitChange={() => setUsnLimit((prevState) => prevState + 5)}
      title="Security issues"
      totalCount={usns.length}
    />
  ) : (
    <ModularTable
      columns={securityIssueColumns}
      data={securityIssues}
      getCellProps={handleSecurityIssuesCellProps(
        otherProps.tableType,
        expandedUsn,
      )}
      emptyMsg={`No security issues found with the search "${otherProps.search}"`}
    />
  );
};

export default UsnList;
