import { API_URL, API_URL_OLD } from "@/constants";
import type {
  ProfileChange,
  UseGetProfileChangesParams,
} from "@/features/tags";
import { profileChanges, tags } from "@/tests/mocks/tag";
import {
  generatePaginatedResponse,
  isAction,
} from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<never, never, ApiPaginatedResponse<string>>(`${API_URL}tags`, () => {
    const response = generatePaginatedResponse<string>({
      data: tags,
      offset: 0,
      limit: 100,
    });

    return HttpResponse.json(response);
  }),

  http.get<
    never,
    UseGetProfileChangesParams,
    ApiPaginatedResponse<ProfileChange>
  >(`${API_URL}tags/profile-diff`, ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "tags/profile-diff"
    ) {
      throw createEndpointStatusError();
    }

    const { searchParams } = new URL(request.url);

    const offset = searchParams.get("offset");
    const limit = searchParams.get("limit");
    const parsedOffset = offset ? parseInt(offset) : 0;
    const parsedLimit = limit ? parseInt(limit) : 100;

    if (
      endpointStatus.status === "empty" &&
      endpointStatus.path === "tags/profile-diff"
    ) {
      return HttpResponse.json(
        generatePaginatedResponse<ProfileChange>({
          data: [],
          offset: parsedOffset,
          limit: parsedLimit,
        }),
      );
    }

    const response = generatePaginatedResponse<ProfileChange>({
      data: profileChanges,
      offset: parsedOffset,
      limit: parsedLimit,
    });

    return HttpResponse.json(response);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "AddTagsToComputers")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "AddTagsToComputers")
    ) {
      throw createEndpointStatusError();
    }

    const { searchParams } = new URL(request.url);

    const queryParam = searchParams.get("query") || "";
    const tagsParam = searchParams.get("tags") || "";

    return HttpResponse.json({
      query: queryParam,
      tags: tagsParam,
    });
  }),
];
