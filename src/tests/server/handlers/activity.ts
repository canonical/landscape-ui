import { API_URL } from "@/constants";
import { GetPackagesParams } from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";
import { Activity } from "@/features/activities";
import { activities } from "@/tests/mocks/activity";

export default [
  // @ts-ignore-next-line
  http.get<GetPackagesParams, never, ApiPaginatedResponse<Activity>>(
    `${API_URL}activities`,
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
      const limit = Number(url.searchParams.get("limit")) ?? 1;

      return HttpResponse.json(
        generatePaginatedResponse<Activity>({
          data: activities,
          limit,
          offset,
        }),
      );
    },
  ),
];
