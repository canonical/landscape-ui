import { API_URL_OLD } from "@/constants";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { isAction } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";

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
];
