import EmptyState from "@/components/layout/EmptyState";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { FC } from "react";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileAddButton from "../RepositoryProfileAddButton";
import RepositoryProfileHeader from "../RepositoryProfileHeader";
import RepositoryProfileList from "../RepositoryProfileList";

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

  return (
    <>
      <RepositoryProfileHeader />
      <RepositoryProfileList
        repositoryProfiles={unfilteredRepositoryProfilesResponse.data.results}
      />
    </>
  );
};

export default RepositoryProfileContainer;
