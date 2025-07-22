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
import { http, HttpResponse } from "msw";

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
  >(`${API_URL}tags/profile-diff`, () => {
    const response = generatePaginatedResponse<ProfileChange>({
      data: profileChanges,
      offset: 0,
      limit: 100,
    });

    return HttpResponse.json(response);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "AddTagsToComputers")) {
      return;
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
