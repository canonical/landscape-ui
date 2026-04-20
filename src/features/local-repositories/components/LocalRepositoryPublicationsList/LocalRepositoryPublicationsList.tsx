import { ROUTES } from "@/libs/routes";
import type { LocalRepository, Publication } from "../../types";
import { useMemo, type FC } from "react";
import StaticLink from "@/components/layout/StaticLink";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Column, CellProps } from "react-table";
import useGetPublications from "../../api/useGetPublications";

interface LocalRepositoryPublicationsListProps {
  readonly repository: LocalRepository;
}

const LocalRepositoryPublicationsList: FC<LocalRepositoryPublicationsListProps> = ({ repository }) => {
  const { data, isGettingPublications } = useGetPublications({ filter: `source=locals/${repository.name}` });
  const publications = data?.publications ?? [];
  
  const columns = useMemo<Column<Publication>[]>(() => [
    {
        Header: "Publication",
        meta: {
          ariaLabel: ({ original: publication }) =>
            `${publication.name} publication name`,
        },
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => (
          <StaticLink to={
            ROUTES.repositories.publications({
              search: publication.name,
            })
          }>{publication.name}</StaticLink>
        )
      },
      {
        Header: "Date published",
        meta: {
          ariaLabel: ({ original: publication }) =>
            `Date when the ${publication.name} publication was published`,
        },
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => publication.publishTime
      },
    ],
    [],
  );

  if (isGettingPublications) {
    return <LoadingState />;
  }

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
