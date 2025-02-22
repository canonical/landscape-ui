import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import {
  computersNotUpgraded,
  notPingingComputers,
  usnTimeToFix,
} from "@/tests/mocks/reportIds";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, number[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetInstancesNotUpgraded")) {
      return;
    }

    return HttpResponse.json(computersNotUpgraded);
  }),
  http.get<never, number[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetNotPingingInstances")) {
      return;
    }

    return HttpResponse.json(notPingingComputers);
  }),
  http.get<never, Record<string, number>[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetUSNTimeToFix")) {
      return;
    }

    return HttpResponse.json(usnTimeToFix);
  }),
];
