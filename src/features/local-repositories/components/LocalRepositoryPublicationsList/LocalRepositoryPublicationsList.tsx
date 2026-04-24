import { ROUTES } from "@/libs/routes";
import type { Publication } from "@/features/publications";
import { useMemo, type FC } from "react";
import StaticLink from "@/components/layout/StaticLink";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Column, CellProps } from "react-table";
import usePageParams from "@/hooks/usePageParams";
import { TablePagination } from "@/components/layout/TablePagination";

interface LocalRepositoryPublicationsListProps {
  readonly publications: Publication[];
  readonly openNewTab?: boolean;
}

const LocalRepositoryPublicationsList: FC<
  LocalRepositoryPublicationsListProps
> = ({ publications, openNewTab }) => {
  const { currentPage, pageSize } = usePageParams();

  const pagedPublications = useMemo(
    () =>
      publications.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [publications, currentPage, pageSize],
  );

  const columns = useMemo<Column<Publication>[]>(() => {
    const newTabProps = openNewTab
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : undefined;

    return [
      {
        Header: "Publication",
        meta: {
          ariaLabel: ({ original: publication }) =>
            `${publication.displayName} publication name`,
        },
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => (
          <StaticLink
            to={ROUTES.repositories.publications({
              sidePath: ["view"],
              name: publication.publicationId,
            })}
            {...newTabProps}
          >
            {publication.label}
          </StaticLink>
        ),
      },
      {
        Header: "Date published",
        meta: {
          ariaLabel: ({ original: publication }) =>
            `Date when the ${publication.displayName} publication was published`,
        },
        Cell: ({ row: { original: publication } }: CellProps<Publication>) =>
          publication.publishTime,
      },
    ] as Column<Publication>[];
  }, [openNewTab]);

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={pagedPublications}
        emptyMsg={"No publications associated with this local repository."}
        minWidth={320}
      />
      <TablePagination
        totalItems={publications.length}
        currentItemCount={pagedPublications.length}
      />
    </>
  );
};

export default LocalRepositoryPublicationsList;
