import { API_URL_DEB_ARCHIVE } from "@/constants";
import type { Operation } from "@/features/operations";
import {
  inProgressOperation,
  succeededOperation,
  idleOperation,
  failedOperation,
  operations,
} from "@/tests/mocks/operations";
import { delay, http, HttpResponse } from "msw";
import { shouldApplyEndpointStatus } from "./_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { createEndpointStatusError } from "./_constants";

let progress = inProgressOperation.metadata.progressPercent;

export const resetLroProgress = () => {
  progress = inProgressOperation.metadata.progressPercent;
  inProgressOperation.metadata.status = "in progress";
  inProgressOperation.done = false;
  inProgressOperation.error = undefined;
  idleOperation.metadata.status = "idle";
  idleOperation.done = false;
  idleOperation.error = undefined;
};

const getOperationResponse = (operation: Operation) => {
  if (operation.metadata.status === "in progress") {
    progress += 1;

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
  http.post<never, { names: string[]; returnPartialSuccess?: boolean }>(
    `${API_URL_DEB_ARCHIVE}operations\\:batchGet`,
    async ({ request }) => {
      const { names, returnPartialSuccess } = await request.json();

      const found = operations.filter(({ name }) => names.includes(name ?? ""));
      const unreachable = names.filter(
        (name) => !found.some((operation) => operation.name === name),
      );

      // Mirrors the real API: an unreachable name fails the whole batch unless
      // the caller opts into partial success.
      if (unreachable.length > 0 && !returnPartialSuccess) {
        return HttpResponse.json(
          {
            code: 5,
            message: `The following operations could not be found: ${unreachable.join(", ")}`,
          },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        operations: found.map((operation) => getOperationResponse(operation)),
        ...(unreachable.length > 0 ? { unreachable } : {}),
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

  http.post(
    `${API_URL_DEB_ARCHIVE}operations/:operationId\\:cancel`,
    async ({ params }) => {
      const { operationId } = params;

      const operation = operations.find(
        (op) => op.metadata.operationId === operationId,
      );

      await delay(10);

      if (shouldApplyEndpointStatus("operations/cancel")) {
        const { status } = getEndpointStatus();

        if (status === "error") {
          throw createEndpointStatusError();
        }

        if (status === "loading") {
          await delay("infinite");
        }
      }

      if (operation) {
        operation.metadata.status = "failed";
        operation.done = true;
        operation.error = failedOperation.error;
        return HttpResponse.json();
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
