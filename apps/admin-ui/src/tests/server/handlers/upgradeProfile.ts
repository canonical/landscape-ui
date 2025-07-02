import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, ["CreateUpgradeProfile", "EditUpgradeProfile"])) {
      return;
    }

    const requestSearchParams = new URL(request.url).searchParams;

    return HttpResponse.json(requestSearchParams);
  }),
];
