import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";
import type { AccessGroup } from "@/features/access-groups";
import {
  isAction,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<never, never, AccessGroup[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetAccessGroups")) {
      return;
    }

    if (shouldApplyEndpointStatus("GetAccessGroups")) {
      const endpointStatus = getEndpointStatus("GetAccessGroups");

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json([]);
      }

      if (endpointStatus.status === "variant") {
        return HttpResponse.json(
          (endpointStatus.response ?? []) as AccessGroup[],
        );
      }
    }

    const url = new URL(request.url);
    const name = url.searchParams.get("names.1");
    const response = name
      ? accessGroups.filter((accessGroup) => accessGroup.name === name)
      : accessGroups;

    return HttpResponse.json(response);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveAccessGroup")) {
      return;
    }

    const endpointStatus = getEndpointStatus("RemoveAccessGroup");
    if (endpointStatus.status === "error") {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({ success: true });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "ChangeComputersAccessGroup")) {
      return;
    }

    const endpointStatus = getEndpointStatus("ChangeComputersAccessGroup");
    if (endpointStatus.status === "error") {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({ success: true });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateAccessGroup")) {
      return;
    }

    const url = new URL(request.url);
    return HttpResponse.json({
      name: url.searchParams.get("name"),
      title: url.searchParams.get("title"),
      parent: url.searchParams.get("parent"),
      children: "",
    });
  }),

  http.patch(`${API_URL}access-groups/:name`, ({ params }) => {
    if (shouldApplyEndpointStatus("access-groups/:name")) {
      const { status } = getEndpointStatus("access-groups/:name");

      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    const accessGroup = accessGroups.find(
      (group) => group.name === params.name,
    );

    if (accessGroup) {
      return HttpResponse.json(accessGroup);
    }

    return HttpResponse.json({}, { status: 404 });
  }),
];
