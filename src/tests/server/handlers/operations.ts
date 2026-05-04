import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  failedOperation,
  inProgressOperation,
  emptyOperation,
  succeededOperation,
  overCountOperation,
} from "@/tests/mocks/operations";
import { http, delay, HttpResponse } from "msw";

export default [
  http.get(`${API_URL_DEB_ARCHIVE}operations/:operationId`, ({ params }) => {
    const { operationId } = params;
    delay(1000);

    if (operationId === "ffff-llll-dddd") {
      return HttpResponse.json(failedOperation);
    }

    if (operationId === "pppp-gggg-ssss") {
      return HttpResponse.json(inProgressOperation);
    }

    if (operationId === "mmmm-pppp-tttt") {
      return HttpResponse.json(emptyOperation);
    }

    if (operationId === "ssss-cccc-dddd") {
      return HttpResponse.json(succeededOperation);
    }

    return HttpResponse.json(overCountOperation);
  }),
];
