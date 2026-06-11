import { useBoolean } from "usehooks-ts";
import useFetch from "./useFetch";
import { redirectToExternalUrl } from "@/features/auth";

export const useRedirectToClassicDashboard = (path = "") => {
  const authFetch = useFetch();

  const { value: isRedirecting, setTrue: setIsRedirectingTrue } = useBoolean();

  return {
    redirectToClassicDashboard: async () => {
      setIsRedirectingTrue();

      const response = await authFetch.get<{ url: string }>(
        "classic_dashboard_url",
      );

      redirectToExternalUrl(response.data.url + path);
    },

    isRedirectingToClassicDashboard: isRedirecting,
  };
};
