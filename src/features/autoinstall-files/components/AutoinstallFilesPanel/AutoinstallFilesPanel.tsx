import LoadingState from "@/components/layout/LoadingState";
import {
  getEmployeeGroupOptions,
  useGetEmployeeGroups,
} from "@/features/employee-groups";
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
  const {
    employeeGroups: [employeeGroup],
    search,
    setPageParams,
  } = usePageParams();
  const { getAutoinstallFilesQuery } = useAutoinstallFiles();

  const { employeeGroups, isEmployeeGroupsLoading } = useGetEmployeeGroups();

  const {
    data: { data: { results: autoinstallFiles } } = {
      data: { results: [] as AutoinstallFileWithGroups[] },
    },
    isLoading,
  } = getAutoinstallFilesQuery({
    employee_group_id: employeeGroup ? parseInt(employeeGroup) : undefined,
    with_groups: true,
    search,
  }) as UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFileWithGroups>>,
    AxiosError<ApiError>
  >;

  if (isEmployeeGroupsLoading) {
    return <LoadingState />;
  }

  const handleEmployeeGroupSelect = (employeeGroup: string): void => {
    setPageParams({ employeeGroups: [employeeGroup] });
  };

  return (
    <>
      <AutoinstallFilesHeader
        employeeGroupOptions={[
          { label: "All", value: "" },
          ...getEmployeeGroupOptions(employeeGroups),
        ]}
        handleEmployeeGroupSelect={handleEmployeeGroupSelect}
        selectedEmployeeGroup={employeeGroup ?? ""}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
      )}
    </>
  );
};

export default AutoinstallFilesPanel;
