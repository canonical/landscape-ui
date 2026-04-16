import { API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { isAction } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (isAction(request, "GetUpgradeProfiles")) {
      return HttpResponse.json(upgradeProfiles);
    }

    if (!isAction(request, ["CreateUpgradeProfile", "EditUpgradeProfile"])) {
      return;
    }

    const requestSearchParams = new URL(request.url).searchParams;

    return HttpResponse.json(requestSearchParams);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveUpgradeProfile")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (endpointStatus.status === "error") {
      throw ENDPOINT_STATUS_API_ERROR;
    }

    return HttpResponse.json();
  }),
];
