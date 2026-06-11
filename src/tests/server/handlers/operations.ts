import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  failedOperation,
  inProgressOperation,
  emptyOperation,
  succeededOperation,
  overCountOperation,
  timeoutOperation,
  idleOperation,
  operations,
} from "@/tests/mocks/operations";
import { http, delay, HttpResponse } from "msw";

let progress = inProgressOperation.metadata.progressPercent;

export default [
  http.post<never, { names: string[] }>(
    `${API_URL_DEB_ARCHIVE}operations\\:batchGet`,
    async ({ request }) => {
      const { names } = await request.json();

      return HttpResponse.json({
        operations: operations.filter(({ name }) => names.includes(name ?? "")),
      });
    },
  ),

  http.get(`${API_URL_DEB_ARCHIVE}operations/:operationId`, ({ params }) => {
    const { operationId } = params;
    delay(1000);

    if (operationId === "ffff-llll-dddd") {
      return HttpResponse.json(failedOperation);
    }

    if (operationId === "iiii-dddd-llll") {
      return HttpResponse.json(idleOperation);
    }

    if (operationId === "tttt-mmmm-oooo") {
      return HttpResponse.json(timeoutOperation);
    }

    if (operationId === "pppp-gggg-ssss") {
      progress += 10;

      if (progress >= 100) {
        progress = inProgressOperation.metadata.progressPercent;
        return HttpResponse.json(succeededOperation);
      }

      return HttpResponse.json({
        ...inProgressOperation,
        metadata: {
          ...inProgressOperation.metadata,
          progressPercent: progress,
        },
      });
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
