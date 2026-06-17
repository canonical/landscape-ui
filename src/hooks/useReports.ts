import { useQuery } from "@tanstack/react-query";
import useFetchOld from "@/hooks/useFetchOld";
import type { QueryFnType } from "@/types/api/QueryFnType";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";

interface CommonGetParams {
  query?: string;
  /** Only include USN/CVE issues released within this many days. */
  max_days?: number;
  /** Key the CSV columns by CVE instead of by USN. */
  by_cve?: boolean;
}

export default function useReports() {
  const authFetchOld = useFetchOld();

  const getCsvComplianceData: QueryFnType<
    AxiosResponse<string>,
    CommonGetParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<string>, AxiosError<ApiError>>({
      queryKey: ["csvComplianceData", queryParams],
      queryFn: async () =>
        authFetchOld.get("GetCSVComplianceData", {
          params: queryParams,
        }),
      ...config,
    });

  return {
    getCsvComplianceData,
  };
}
