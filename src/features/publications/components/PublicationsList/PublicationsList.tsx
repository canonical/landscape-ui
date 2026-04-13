import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions/constants";
import StaticLink from "@/components/layout/StaticLink";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { Publication } from "../../types";
import PublicationDetails from "../PublicationDetails";
import PublicationsListActions from "../PublicationsListActions";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

interface PublicationsListProps {
  readonly publications: Publication[];
}

const PublicationsList: FC<PublicationsListProps> = ({ publications }) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const openPublicationDetails = useCallback(
    (publication: Publication) => {
      setSidePanelContent(
        publication.name,
        <PublicationDetails publication={publication} />,
      );
    },
    [setSidePanelContent],
  );

  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row }: CellProps<Publication>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              openPublicationDetails(row.original);
            }}
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        accessor: "source_type",
        Header: "source type",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <>{original.source_type}</>
        ),
      },
      {
        accessor: "source",
        Header: "source",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <StaticLink to={"/"}>{original.source}</StaticLink>
        ),
      },
      {
        accessor: "publication_target",
        Header: "publication target",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <StaticLink to={"/"}>{original.publication_target}</StaticLink>
        ),
      },
      {
        accessor: "date_published",
        Header: "date published",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <>
            {moment(original.date_published).format(DISPLAY_DATE_TIME_FORMAT)}{" "}
            UTC
          </>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <PublicationsListActions publication={original} />
        ),
      },
    ],
    [openPublicationDetails],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={publications}
      emptyMsg={`No profiles found with the search: "${search}"`}
    />
  );
};

export default PublicationsList;
