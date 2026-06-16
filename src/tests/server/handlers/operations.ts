import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  inProgressOperation,
  succeededOperation,
  operations,
} from "@/tests/mocks/operations";
import { http, HttpResponse } from "msw";

let progress = inProgressOperation.metadata.progressPercent;

export const resetLroProgress = () => {
  progress = inProgressOperation.metadata.progressPercent;
};

export default [
  http.post<never, { names: string[] }>(
    `${API_URL_DEB_ARCHIVE}operations\\:batchGet`,
    async ({ request }) => {
      const { names } = await request.json();

      return HttpResponse.json({
        operations: operations
          .filter(({ name }) => names.includes(name ?? ""))
          .map((operation) => {
            if (operation.metadata.operationId === "pppp-gggg-ssss") {
              progress += 10;

              if (progress >= 100) {
                progress = inProgressOperation.metadata.progressPercent;

                return {
                  ...succeededOperation,
                  name: operation.name,
                };
              }

              return {
                ...operation,
                metadata: {
                  ...operation.metadata,
                  progressPercent: progress,
                },
              };
            }
            return operation;
          }),
      });
    },
  ),

  http.get(
    `${API_URL_DEB_ARCHIVE}operations/:operationId`,
    async ({ params }) => {
      const { operationId } = params;

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

      return HttpResponse.json(
        operations.find(
          (operation) => operation.metadata.operationId === operationId,
        ),
      );
    },
  ),
];
