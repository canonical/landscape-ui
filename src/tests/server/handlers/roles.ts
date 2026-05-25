import { API_URL_OLD } from "@/constants";
import type { GetRolesParams } from "@/hooks/useRoles";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { permissions, roles as roleMocks } from "@/tests/mocks/roles";
import { isAction } from "@/tests/server/handlers/_helpers";
import type { Permission } from "@/types/Permission";
import type { Role } from "@/types/Role";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<never, GetRolesParams, Role[]>(API_URL_OLD, ({ request }) => {
    const { status, path } = getEndpointStatus();

    if (!isAction(request, "GetRoles")) {
      return;
    }

    if (status === "empty" && (!path || path === "roles")) {
      return HttpResponse.json([]);
    }

    return HttpResponse.json(roleMocks);
  }),

  http.get<never, never, Permission[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetPermissions")) {
      return;
    }

    return HttpResponse.json(permissions);
  }),

  http.get<never, never, Role>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateRole")) {
      return;
    }

    const { searchParams } = new URL(request.url);
    const roleName = searchParams.get("name") ?? "NewRole";
    const [role] = roleMocks;
    if (!role) {
      throw new Error("Expected at least one role in mock role data");
    }

    return HttpResponse.json({ ...role, name: roleName });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveRole")) {
      return;
    }

    return new HttpResponse(null, { status: 200 });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (
      !isAction(request, [
        "AddPermissionsToRole",
        "RemovePermissionsFromRole",
        "AddAccessGroupsToRole",
        "RemoveAccessGroupsFromRole",
      ])
    ) {
      return;
    }

    const { status, path } = getEndpointStatus();

    if (status === "error" && (!path || path === "editRole")) {
      throw createEndpointStatusError();
    }

    const [role] = roleMocks;

    const { searchParams } = new URL(request.url);
    const roleName = searchParams.get("name");
    const getMultiValueParams = (baseName: string): string[] => {
      const values = searchParams.getAll(baseName);

      for (const [key, value] of searchParams.entries()) {
        if (key.startsWith(`${baseName}.`)) {
          values.push(value);
        }
      }

      return values;
    };

    const accessGroups = Array.from(
      new Set(getMultiValueParams("access_groups")),
    );
    const permissionsParams = Array.from(
      new Set(getMultiValueParams("permissions")),
    );

    return HttpResponse.json({
      ...role,
      name: roleName ?? role.name,
      access_groups:
        accessGroups.length > 0 ? accessGroups : role.access_groups,
      permissions:
        permissionsParams.length > 0 ? permissionsParams : role.permissions,
    });
  }),
];
