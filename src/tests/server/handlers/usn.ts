import { http, HttpResponse } from "msw";
import { GetUsnsParams } from "@/hooks/useUsns";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Usn } from "@/types/Usn";
import { API_URL } from "@/constants";
import { usnPackages, usns } from "@/tests/mocks/usn";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";

export default [
  // @ts-ignore-next-line
  http.get<GetUsnsParams, never, ApiPaginatedResponse<Usn>>(
    `${API_URL}usns`,
    async ({ params }) => {
      const { limit, offset, search } = params;

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
