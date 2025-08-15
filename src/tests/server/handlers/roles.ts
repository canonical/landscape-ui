import { API_URL_OLD } from "@/constants";
import type { GetRolesParams } from "@/hooks/useRoles";
import { roles } from "@/tests/mocks/roles";
import { isAction } from "@/tests/server/handlers/_helpers";
import type { Role } from "@/types/Role";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetRolesParams, Role[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetRoles")) {
      return;
    }

    return HttpResponse.json(roles);
  }),
];
