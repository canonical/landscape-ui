import { API_URL_OLD } from "@/constants";
import { ListPocketParams } from "@/features/mirrors";
import { PackageDiff, PackageObject } from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";
import { diffPocket, listPockets } from "@/tests/mocks/pockets";
import { DiffPullPocketParams } from "@/features/mirrors";

export default [
  http.get<never, ListPocketParams, ApiPaginatedResponse<PackageObject>>(
    `${API_URL_OLD}ListPocket`,
    ({ request }) => {
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? "";
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 20;

      return HttpResponse.json(
        generatePaginatedResponse<PackageObject>({
          data: endpointStatus === "default" ? listPockets : [],
          limit,
          offset,
          search,
        }),
      );
    },
  ),
  http.get<never, DiffPullPocketParams, PackageDiff>(
    `${API_URL_OLD}DiffPullPocket`,
    () => {
      return HttpResponse.json(diffPocket);
    },
  ),
];
