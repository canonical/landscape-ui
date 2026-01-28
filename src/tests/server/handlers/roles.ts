import { API_URL_OLD } from "@/constants";
import type { GetRolesParams } from "@/hooks/useRoles";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { permissions, roles } from "@/tests/mocks/roles";
import { isAction } from "@/tests/server/handlers/_helpers";
import type { Permission } from "@/types/Permission";
import type { Role } from "@/types/Role";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetRolesParams, Role[]>(API_URL_OLD, ({ request }) => {
    const { status } = getEndpointStatus();

    if (!isAction(request, "GetRoles")) {
      return;
    }

    if (status === "empty") {
      return HttpResponse.json([]);
    }

    return HttpResponse.json(roles);
  }),

  http.get<never, never, Permission[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetPermissions")) {
      return;
    }

    return HttpResponse.json(permissions);
  }),
];
