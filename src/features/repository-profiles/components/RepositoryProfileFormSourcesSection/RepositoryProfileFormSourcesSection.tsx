import type { APTSource } from "@/features/apt-sources";
import { Button, Icon, ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";

interface SourceRow extends Record<string, unknown> {
  name: string;
  line: string;
  isPending: boolean;
  source: APTSource;
}

interface RepositoryProfileFormSourcesSectionProps {
  readonly sources: APTSource[];
  readonly onRemoveSource: (source: APTSource) => void;
  readonly error?: string;
}

const RepositoryProfileFormSourcesSection: FC<
  RepositoryProfileFormSourcesSectionProps
> = ({
  sources,
  onRemoveSource,
  error,
}) => {
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

  const columns = useMemo<Column<SourceRow>[]>(
    () => [
      {
        accessor: "name",
        Header: "Source name",
        Cell: ({ row: { original } }: CellProps<SourceRow>) => (
          <>
            {original.name}
            {original.isPending && (
              <span className="p-label--information u-no-margin--bottom u-nudge-right--small">
                Pending
              </span>
            )}
          </>
        ),
      },
      {
        accessor: "line",
        Header: "Deb line",
        Cell: ({ value }: CellProps<SourceRow>) => (
          <span className="u-truncate" title={value}>
            {value}
          </span>
        ),
      },
      {
        id: "actions",
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<SourceRow>) => (
          <Button
            appearance="base"
            hasIcon
            type="button"
            aria-label={`Remove ${original.name}`}
            onClick={() => {
              onRemoveSource(original.source);
            }}
          >
            <Icon name="delete" />
          </Button>
        ),
      },
    ],
    [onRemoveSource],
  );

  return (
    <>
      <ModularTable
        columns={columns}
        data={rows}
        emptyMsg="No sources have been added yet."
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
