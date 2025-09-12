import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { FC } from "react";
import { useRepositoryProfiles } from "../../hooks";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileAddButton from "../RepositoryProfileAddButton";
import RepositoryProfileHeader from "../RepositoryProfileHeader";
import RepositoryProfileList from "../RepositoryProfileList";

interface RepositoryProfileContainerProps {
  readonly unfilteredRepositoryProfilesResult: UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>
  >;
}

const RepositoryProfileContainer: FC<RepositoryProfileContainerProps> = ({
  unfilteredRepositoryProfilesResult: {
    data: unfilteredRepositoryProfilesResponse,
    isPending: isPendingUnfilteredRepositoryProfiles,
    error: unfilteredRepositoryProfilesError,
  },
}) => {
  const { currentPage, pageSize, search } = usePageParams();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const {
    data: repositoryProfilesResponse,
    isPending: isPendingRepositoryProfiles,
    error: repositoryProfilesError,
  } = getRepositoryProfilesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search ? [search] : undefined,
  });

  if (isPendingUnfilteredRepositoryProfiles) {
    return <LoadingState />;
  }

  if (!unfilteredRepositoryProfilesResponse) {
    throw unfilteredRepositoryProfilesError;
  }

  if (!unfilteredRepositoryProfilesResponse.data.count) {
    return (
      <EmptyState
        title="No repository profiles found"
        body={
          <>
            <p>You haven’t added any repository profiles yet.</p>
            <a
              href="https://ubuntu.com/landscape/docs/manage-repositories-web-portal"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              How to manage repositories in Landscape
            </a>
          </>
        }
        cta={[<RepositoryProfileAddButton key="add" />]}
      />
    );
  }

  if (isPendingRepositoryProfiles) {
    return <LoadingState />;
  }

  if (!repositoryProfilesResponse) {
    throw repositoryProfilesError;
  }

  return (
    <>
      <RepositoryProfileHeader />
      <RepositoryProfileList
        repositoryProfiles={repositoryProfilesResponse.data.results}
      />
      <TablePagination
        totalItems={repositoryProfilesResponse.data.count}
        currentItemCount={repositoryProfilesResponse.data.results.length}
      />
    </>
  );
};

export default RepositoryProfileContainer;
