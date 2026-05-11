import type { APTSource } from "../../types";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import TooltipCell from "@/components/layout/TooltipCell";
import { Button, Icon, ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./RepositoryProfileFormSourcesSection.module.scss";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

interface SourceRow extends Record<string, unknown> {
  name: string;
  line: string;
  isPending: boolean;
  source: APTSource;
}

interface RepositoryProfileFormSourcesSectionProps {
  readonly sources: APTSource[];
  readonly onRemoveSource: (source: APTSource) => void;
  readonly onEditSource: (source: APTSource) => void;
  readonly error?: string;
}

const RepositoryProfileFormSourcesSection: FC<
  RepositoryProfileFormSourcesSectionProps
> = ({ sources, onRemoveSource, onEditSource, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const rows: SourceRow[] = useMemo(
    () =>
      sources.map((s) => ({
        name: s.name,
        line: s.line,
        isPending: s.id === 0,
        source: s,
      })),
    [sources],
  );

  const safePage = Math.min(
    currentPage,
    Math.max(1, Math.ceil(rows.length / pageSize)),
  );

  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize],
  );

  const columns = useMemo<Column<SourceRow>[]>(
    () => [
      {
        accessor: "name",
        Header: "Source name",
        className: classes.nameColumn,
        Cell: ({ row: { original } }: CellProps<SourceRow>) => original.name,
      },
      {
        accessor: "line",
        Header: "Deb line",
        className: classes.debLine,
        Cell: ({ row: { original } }: CellProps<SourceRow>) => (
          <TooltipCell message={original.line}>{original.line}</TooltipCell>
        ),
      },
      {
        id: "fingerprint",
        accessor: (row: SourceRow) =>
          row.source.gpg_key?.fingerprint ?? NO_DATA_TEXT,
        Header: "Fingerprint",
        Cell: ({ row: { original } }: CellProps<SourceRow>) => {
          if (!original.source.gpg_key) {
            return NO_DATA_TEXT;
          }
          if (original.isPending) {
            return "(pending)";
          }
          return (
            <TooltipCell
              message={String(
                original.source.gpg_key.fingerprint ?? NO_DATA_TEXT,
              )}
            >
              {original.source.gpg_key.fingerprint ?? NO_DATA_TEXT}
            </TooltipCell>
          );
        },
      },
      {
        id: "actions",
        Header: "",
        className: classes.actionsColumn,
        Cell: ({ row: { original } }: CellProps<SourceRow>) => (
          <div className={classes.actionsCell}>
            <Button
              appearance="base"
              hasIcon
              dense
              type="button"
              className="u-no-margin--bottom u-no-padding"
              aria-label={`Edit ${original.name}`}
              onClick={() => {
                onEditSource(original.source);
              }}
            >
              <Icon
                name="edit"
                className="u-no-margin--left u-no-margin--right"
              />
            </Button>
            <Button
              appearance="base"
              hasIcon
              dense
              type="button"
              className="u-no-margin--bottom u-no-padding"
              aria-label={`Remove ${original.name}`}
              onClick={() => {
                onRemoveSource(original.source);
              }}
            >
              <Icon
                name="delete"
                className="u-no-margin--left u-no-margin--right"
              />
            </Button>
          </div>
        ),
      },
    ],
    [onRemoveSource, onEditSource],
  );

  return (
    <>
      <ModularTable
        columns={columns}
        data={pagedRows}
        emptyMsg="No sources have been added yet."
      />
      <ModalTablePagination
        current={safePage}
        max={Math.max(1, Math.ceil(rows.length / pageSize))}
        onPrev={() => {
          setCurrentPage(safePage - 1);
        }}
        onNext={() => {
          setCurrentPage(safePage + 1);
        }}
      />
      {error && (
        <div className="p-form-validation is-error">
          <p className="p-form-validation__message">{error}</p>
        </div>
      )}
    </>
  );
};

export default RepositoryProfileFormSourcesSection;
