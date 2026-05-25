import ModalTablePagination from "@/components/layout/TablePagination/components/ModalTablePagination/ModalTablePagination";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import type { Publication } from "@canonical/landscape-openapi";
import TooltipCell from "@/components/layout/TooltipCell";
import PublicationLink from "./PublicationLink/PublicationLink";
import MirrorLink from "./MirrorLink/MirrorLink";
import LocalLink from "./LocalLink/LocalLink";
import { getSourceType } from "@/features/publications";

const EMPTY_SOURCE_DISPLAY_NAMES: Record<string, string> = {};

interface AssociatedPublicationsListProps {
  readonly publications: Publication[];
  readonly pageSize?: number;
  readonly openInNewTab?: boolean;
  readonly showSources?: boolean;
  readonly sourceDisplayNames?: Record<string, string>;
}

const AssociatedPublicationsList: FC<AssociatedPublicationsListProps> = ({
  publications,
  pageSize = 10,
  openInNewTab = false,
  showSources = true,
  sourceDisplayNames = EMPTY_SOURCE_DISPLAY_NAMES,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        accessor: "displayName",
        Header: "Publication",
        Cell: ({ row: { original } }: CellProps<Publication>): ReactNode => {
          const link = (
            <PublicationLink
              publication={original}
              openInNewTab={openInNewTab}
            />
          );
          return openInNewTab ? (
            link
          ) : (
            <TooltipCell message={original.displayName ?? ""}>
              {link}
            </TooltipCell>
          );
        },
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
                const displayName = sourceDisplayNames[source];
                let content: ReactNode;
                if (sourceType === "Mirror") {
                  content = (
                    <MirrorLink
                      mirrorName={source}
                      displayName={displayName}
                      openInNewTab={openInNewTab}
                    />
                  );
                } else if (sourceType === "Local repository") {
                  content = (
                    <LocalLink
                      localName={source}
                      displayName={displayName}
                      openInNewTab={openInNewTab}
                    />
                  );
                } else {
                  content = source;
                }
                return openInNewTab ? (
                  content
                ) : (
                  <TooltipCell message={displayName ?? source ?? ""}>
                    {content}
                  </TooltipCell>
                );
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
    [openInNewTab, showSources, sourceDisplayNames],
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
        emptyMsg="No associated publications were found."
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
