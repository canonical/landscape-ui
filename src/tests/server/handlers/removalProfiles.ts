import { API_URL_OLD } from "@/constants";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { http, HttpResponse } from "msw";
import { isAction } from "./_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetRemovalProfiles")) {
      return;
    }

    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      endpointStatus.path.includes("GetRemovalProfiles")
    ) {
      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }
      if (endpointStatus.status === "empty") {
        return HttpResponse.json([], { status: 200 });
      }
    }

    return HttpResponse.json(removalProfiles, { status: 200 });
  }),

  http.get(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "CreateRemovalProfile")) {
      return;
    }

    return HttpResponse.json(removalProfiles[0], { status: 201 });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "EditRemovalProfile")) {
      return;
    }

    return HttpResponse.json(removalProfiles[0], { status: 200 });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveRemovalProfile")) {
      return;
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
