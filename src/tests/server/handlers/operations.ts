import { API_URL_DEB_ARCHIVE } from "@/constants";
import type { Operation } from "@/features/operations";
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

const getOperationResponse = (operation: Operation) => {
  if (operation.metadata.operationId === "pppp-gggg-ssss") {
    progress += 5;

    if (progress >= 100) {
      progress = inProgressOperation.metadata.progressPercent;

      return {
        ...succeededOperation,
        name: operation.name,
        metadata: {
          ...operation.metadata,
          progressPercent: 100,
          status: succeededOperation.metadata.status,
        },
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
            return getOperationResponse(operation);
          }),
      });
    },
  ),

  http.get(
    `${API_URL_DEB_ARCHIVE}operations/:operationId`,
    async ({ params }) => {
      const { operationId } = params;

      const operation = operations.find(
        (op) => op.metadata.operationId === operationId,
      );

      if (operation) {
        return HttpResponse.json(getOperationResponse(operation));
      }

      return HttpResponse.json(
        {
          code: 13,
          message: "The requested operation could not be found.",
        },
        { status: 404 },
      );
    },
  ),
];
