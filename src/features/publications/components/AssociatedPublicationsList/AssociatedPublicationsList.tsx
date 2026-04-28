import ModalTablePagination from "@/components/layout/TablePagination/components/ModalTablePagination/ModalTablePagination";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import type { Publication } from "@canonical/landscape-openapi";
import PublicationLink from "./PublicationLink/PublicationLink";
import MirrorLink from "./MirrorLink/MirrorLink";
import LocalLink from "./LocalLink/LocalLink";
import { getSourceType } from "@/features/publications";

interface AssociatedPublicationsListProps {
  readonly publications: Publication[];
  readonly pageSize?: number;
  readonly openInNewTab?: boolean;
  readonly showSources?: boolean;
}

const AssociatedPublicationsList: FC<AssociatedPublicationsListProps> = ({
  publications,
  pageSize = 10,
  openInNewTab = false,
  showSources = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: replace label with displayName once it's available in the API, link mirror to /mirrors with sidebar open
  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        accessor: "displayName",
        Header: "Publication",
        Cell: ({ row: { original } }: CellProps<Publication>): ReactNode => (
          <PublicationLink publication={original} openInNewTab={openInNewTab} />
        ),
      },
      ...(showSources
        ? [
            {
              accessor: "source" as const,
              Header: "Source",
              Cell: ({
                row: {
                  original: { source },
                },
              }: CellProps<Publication>): ReactNode => {
                const sourceType = getSourceType(source);
                if (sourceType === "Mirror") {
                  return (
                    <MirrorLink
                      mirrorName={source}
                      openInNewTab={openInNewTab}
                    />
                  );
                }
                if (sourceType === "Local repository") {
                  return (
                    <LocalLink localName={source} openInNewTab={openInNewTab} />
                  );
                }
                return <>{source}</>;
              },
            },
          ]
        : []),
      {
        accessor: "publishTime",
        Header: "Date Published",
        className: "date-cell",
        Cell: ({
          row: {
            original: { publishTime },
          },
        }: CellProps<Publication>): ReactNode =>
          publishTime ? (
            <span>
              {moment(publishTime).format(DISPLAY_DATE_TIME_FORMAT) + " UTC"}
            </span>
          ) : (
            <NoData />
          ),
      },
    ],
    [openInNewTab, showSources],
  );

  const pagedData =
    pageSize != null
      ? publications.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : publications;

  const maxPage =
    pageSize != null ? Math.ceil(publications.length / pageSize) : 1;

  return (
    <>
      <ModularTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={pagedData as unknown as Record<string, unknown>[]}
      />
      <ModalTablePagination
        current={currentPage}
        max={maxPage}
        onPrev={() => {
          setCurrentPage((p) => Math.max(1, p - 1));
        }}
        onNext={() => {
          setCurrentPage((p) => Math.min(maxPage, p + 1));
        }}
      />
    </>
  );
};

export default AssociatedPublicationsList;
