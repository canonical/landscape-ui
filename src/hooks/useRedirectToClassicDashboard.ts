import { useBoolean } from "usehooks-ts";
import useFetch from "./useFetch";
import { redirectToExternalUrl } from "@/features/auth";
import useDebug from "./useDebug";

export const useRedirectToClassicDashboard = (path = "") => {
  const debug = useDebug();
  const authFetch = useFetch();

  const {
    value: isRedirecting,
    setTrue: setIsRedirectingTrue,
    setFalse: setIsRedirectingFalse,
  } = useBoolean();

  return {
    redirectToClassicDashboard: async () => {
      try {
        setIsRedirectingTrue();
        const response = await authFetch.get<{ url: string }>(
          "classic_dashboard_url",
        );
        redirectToExternalUrl(response.data.url + path);
      } catch (error) {
        debug(error);
      } finally {
        setIsRedirectingFalse();
      }
    },

    isRedirectingToClassicDashboard: isRedirecting,
  };
};
