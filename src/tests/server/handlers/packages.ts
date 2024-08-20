import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { GetPackagesParams, OldPackage } from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { packages } from "@/tests/mocks/packages";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { generatePaginatedResponse } from "./_helpers";

export default [
  // @ts-ignore-next-line
  http.get<GetPackagesParams, never, ApiPaginatedResponse<OldPackage>>(
    `${API_URL}packages`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "error") {
        return HttpResponse.json(
          {
            error: "InternalServerError",
            message: "Error response",
          },
          {
            status: 500,
          },
        );
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) ?? 0;
      const limit = Number(url.searchParams.get("limit"));

      return HttpResponse.json(
        generatePaginatedResponse<OldPackage>({
          data: packages,
          limit,
          offset,
        }),
      );
    },
  ),
];
