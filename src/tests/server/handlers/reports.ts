import { API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { isAction, shouldApplyEndpointStatus } from "./_helpers";

const usnTimeToFix = {
  "2": [],
  "14": [],
  "30": [],
  "60": [],
  pending: [],
};

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetCSVComplianceData")) {
      return;
    }

    if (shouldApplyEndpointStatus("reports")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "empty") {
        return HttpResponse.json("");
      }
    }

    return HttpResponse.json("name,status\ninstance-1,ok");
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetComputersNotUpgraded")) {
      return;
    }

    return HttpResponse.json([]);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetNotPingingComputers")) {
      return;
    }

    return HttpResponse.json([]);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetUSNTimeToFix")) {
      return;
    }

    return HttpResponse.json(usnTimeToFix);
  }),
];
