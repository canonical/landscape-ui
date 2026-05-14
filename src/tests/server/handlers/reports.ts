import { API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { isAction } from "./_helpers";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetCSVComplianceData")) {
      return;
    }

    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "empty" &&
      (!endpointStatus.path || endpointStatus.path === "reports")
    ) {
      return HttpResponse.json("");
    }

    return HttpResponse.json("name,status\ninstance-1,ok");
  }),
];
