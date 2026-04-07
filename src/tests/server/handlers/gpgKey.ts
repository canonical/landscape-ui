import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import type { GetGPGKeysParams, GPGKey } from "@/features/gpg-keys";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { gpgKeys } from "@/tests/mocks/gpgKey";
import { isAction } from "@/tests/server/handlers/_helpers";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get<never, GetGPGKeysParams, GPGKey[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetGPGKeys")) {
      return;
    }

    const endpointStatus = getEndpointStatus();

    if (!endpointStatus.path || endpointStatus.path === "gpgKey") {
      if (endpointStatus.status === "error") {
        throw getEndpointStatusApiError();
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json([]);
      }
    }

    return HttpResponse.json(gpgKeys);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "ImportGPGKey")) {
      return;
    }

    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "importGpgKey")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(gpgKeys[0]);
  }),
];
