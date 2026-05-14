import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { FC } from "react";
import { useRepositoryProfiles } from "../../api";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileAddButton from "../RepositoryProfileAddButton";
import RepositoryProfileList from "../RepositoryProfileList";
import HeaderWithSearch from "@/components/form/HeaderWithSearch/HeaderWithSearch";

interface RepositoryProfileContainerProps {
  readonly unfilteredRepositoryProfilesResult: UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>
  > & { isPending: false };
}

const RepositoryProfileContainer: FC<RepositoryProfileContainerProps> = ({
  unfilteredRepositoryProfilesResult: {
    data: unfilteredRepositoryProfilesResponse,
    error: unfilteredRepositoryProfilesError,
  },
}) => {
  const { currentPage, pageSize, search } = usePageParams();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const {
    data: repositoryProfilesResponse,
    isPending: isPendingRepositoryProfiles,
  } = getRepositoryProfilesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search || undefined,
  });

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

  return (
    <>
      <HeaderWithSearch />
      <RepositoryProfileList
        repositoryProfiles={repositoryProfilesResponse?.data.results ?? []}
        totalCount={repositoryProfilesResponse?.data.count ?? 0}
      />
    </>
  );
};

export default RepositoryProfileContainer;
