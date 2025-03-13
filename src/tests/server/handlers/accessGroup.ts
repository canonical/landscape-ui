import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";
import type { AccessGroup } from "@/features/access-groups";
import { isAction } from "@/tests/server/handlers/_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  http.get<never, never, AccessGroup[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetAccessGroups")) {
      return;
    }

    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "empty") {
      return HttpResponse.json([]);
    }

    return HttpResponse.json(accessGroups);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "ChangeComputersAccessGroup")) {
      return;
    }

    return HttpResponse.json({ success: true });
  }),
];
