import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface VerifyOtpCodeParams {
  attach_code: string;
}

interface UseVerifyOtpCodeResult {
  valid: boolean;
  valid_until: string | null;
}

const useVerifyOtpCode = () => {
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<UseVerifyOtpCodeResult>,
    AxiosError<ApiError>,
    VerifyOtpCodeParams
  >({
    mutationFn: (params: VerifyOtpCodeParams) =>
      authFetch.get(
        `ubuntu-installer-attach-sessions/code/${params.attach_code}`,
      ),
  });

  return {
    verify: mutateAsync,
    isVerifying: isPending,
  };
};

export default useVerifyOtpCode;
