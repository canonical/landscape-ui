import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FC } from "react";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFilesHeader from "../AutoinstallFilesHeader";
import AutoinstallFilesList from "../AutoinstallFilesList";

const AutoinstallFilesPanel: FC = () => {
  const { search } = usePageParams();
  const { getAutoinstallFilesQuery } = useAutoinstallFiles();

  const {
    data: { data: { results: autoinstallFiles } } = {
      data: { results: [] as AutoinstallFileWithGroups[] },
    },
    isLoading,
  } = getAutoinstallFilesQuery({
    with_groups: true,
    search,
  }) as UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFileWithGroups>>,
    AxiosError<ApiError>
  >;

  return (
    <>
      <AutoinstallFilesHeader />
      {isLoading ? (
        <LoadingState />
      ) : (
        <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
      )}
    </>
  );
};

export default AutoinstallFilesPanel;
