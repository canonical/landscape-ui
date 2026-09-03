import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { administrators } from "@/tests/mocks/administrators";
import {
  isAction,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import type { Administrator } from "@/types/Administrator";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<never, never, Administrator[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetAdministrators")) {
      return;
    }

    if (shouldApplyEndpointStatus("GetAdministrators")) {
      const { status } = getEndpointStatus("GetAdministrators");

      if (status === "error") {
        throw createEndpointStatusError();
      }

      if (status === "empty") {
        return HttpResponse.json([]);
      }
    }

    return HttpResponse.json(administrators);
  }),

  http.put<never, never, Administrator>(`${API_URL}administrators/:id`, () => {
    return HttpResponse.json(administrators[0]);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "DisableAdministrator")) {
      return;
    }

    return new HttpResponse(null, { status: 200 });
  }),
];
