import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { AccessGroup } from "@/types/AccessGroup";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, never, AccessGroup[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetAccessGroups")) {
      return;
    }

    return HttpResponse.json(accessGroups);
  }),
];
