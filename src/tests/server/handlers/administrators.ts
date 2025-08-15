import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { administrators } from "@/tests/mocks/administrators";
import { isAction } from "@/tests/server/handlers/_helpers";
import type { Administrator } from "@/types/Administrator";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, never, Administrator[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetAdministrators")) {
      return;
    }

    const { path, status } = getEndpointStatus();

    if (path === "GetAdministrators" && status === "empty") {
      return HttpResponse.json([]);
    }

    return HttpResponse.json(administrators);
  }),

  http.put<never, never, Administrator>(`${API_URL}administrators/:id`, () => {
    return HttpResponse.json(administrators[0]);
  }),
];
