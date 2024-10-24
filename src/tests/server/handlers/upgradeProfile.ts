import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";

export default [
  http.get(`${API_URL_OLD}`, ({ request }) => {
    const requestSearchParams = new URL(request.url).searchParams;
    const action = requestSearchParams.get("action");

    if (
      action &&
      ["CreateUpgradeProfile", "EditUpgradeProfile"].includes(action)
    ) {
      return HttpResponse.json(requestSearchParams);
    }
  }),
];
