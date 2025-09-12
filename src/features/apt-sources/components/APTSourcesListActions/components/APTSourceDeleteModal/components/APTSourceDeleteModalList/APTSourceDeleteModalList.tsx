import LoadingState from "@/components/layout/LoadingState";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { RepositoryProfile } from "@/features/repository-profiles";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { ModularTable, Notification } from "@canonical/react-components";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useMemo, type FC } from "react";
import type { Column } from "react-table";

interface APTSourceDeleteModalListProps {
  readonly repositoryProfilesResult: UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>
  >;
  readonly pageNumber: number;
  readonly goToNextPage: () => void;
  readonly goToPreviousPage: () => void;
}

const APTSourceDeleteModalList: FC<APTSourceDeleteModalListProps> = ({
  repositoryProfilesResult: { isPending, data: response, error },
  goToNextPage,
  goToPreviousPage,
  pageNumber,
}) => {
  const columns = useMemo<Column<RepositoryProfile>[]>(
    () => [
      {
        Header: "Repository profile",
        accessor: "title",
      },
    ],
    [],
  );

  if (isPending) {
    return <LoadingState />;
  }

  if (response) {
    return (
      <>
        <ModularTable columns={columns} data={response.data.results} />
        <ModalTablePagination
          current={pageNumber}
          max={Math.ceil(response.data.count / DEFAULT_MODAL_PAGE_SIZE)}
          onNext={goToNextPage}
          onPrev={goToPreviousPage}
        />
      </>
    );
  }

  return (
    <Notification severity="negative">
      The associated repository profiles could not be loaded due to an
      unexpected error: &quot;{error.message}&quot;
    </Notification>
  );
};

export default APTSourceDeleteModalList;
