import { http, HttpResponse } from "msw";
import { GetUsnsParams } from "@/features/usns";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Usn } from "@/types/Usn";
import { API_URL } from "@/constants";
import { usnPackages, usns } from "@/tests/mocks/usn";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";

export default [
  // @ts-ignore-next-line
  http.get<GetUsnsParams, never, ApiPaginatedResponse<Usn>>(
    `${API_URL}usns`,
    async ({ request }) => {
      const url = new URL(request.url);

      const limit = Number(url.searchParams.get("limit")) ?? usns.length;
      const offset = Number(url.searchParams.get("offset")) ?? 0;
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<Usn>({
          data: usns,
          limit,
          offset,
          search,
          searchFields: ["usn"],
        }),
      );
    },
  ),

  http.get(`${API_URL}usns/:usnName`, () => {
    return HttpResponse.json(usnPackages);
  }),
];
