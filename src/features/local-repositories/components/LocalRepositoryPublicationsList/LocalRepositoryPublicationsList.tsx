import { ROUTES } from "@/libs/routes";
import type { Publication } from "../../types";
import { useMemo, type FC } from "react";
import StaticLink from "@/components/layout/StaticLink";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Column, CellProps } from "react-table";

interface LocalRepositoryPublicationsListProps {
  readonly publications: Publication[];
}

const LocalRepositoryPublicationsList: FC<
  LocalRepositoryPublicationsListProps
> = ({ publications }) => {
  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        Header: "Publication",
        meta: {
          ariaLabel: ({ original: publication }) =>
            `${publication.label} publication name`,
        },
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => (
          <StaticLink
            to={ROUTES.repositories.publications({
              sidePath: ["view"],
              publication: publication.publicationId,
            })}
          >
            {publication.label}
          </StaticLink>
        ),
      },
      {
        Header: "Date published",
        meta: {
          ariaLabel: ({ original: publication }) =>
            `Date when the ${publication.name} publication was published`,
        },
        Cell: ({ row: { original: publication } }: CellProps<Publication>) =>
          publication.publishTime,
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={publications}
      emptyMsg={"No publications associated with this local repository."}
      minWidth={320}
    />
  );
};

export default LocalRepositoryPublicationsList;
