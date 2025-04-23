import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import moment from "moment";

export interface RunScriptParams {
  query: string;
  script_id: number;
  username: string;
  time_limit?: number;
  in_access_group?: string;
  // `YYYY-MM-DDTHH:MM:SSZ`
  deliver_after?: string;
}

export const useRunScript = () => {
  const authFetch = useFetchOld();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RunScriptParams
  >({
    mutationKey: ["scripts", "execute"],
    mutationFn: async (params) => {
      const formattedParams = {
        ...params,
        deliver_after: params.deliver_after
          ? moment(params.deliver_after).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
          : undefined,
      };

      return authFetch.get("ExecuteScript", { params: formattedParams });
    },
  });

  return {
    runScript: mutateAsync,
    isRunning: isPending,
  };
};
