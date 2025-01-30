import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { tags } from "@/tests/mocks/tag";

export default [
  http.get<never, never, ApiPaginatedResponse<string>>(`${API_URL}tags`, () => {
    const response = generatePaginatedResponse<string>({
      data: tags,
      offset: 0,
      limit: 100,
    });

    return HttpResponse.json(response);
  }),
];
