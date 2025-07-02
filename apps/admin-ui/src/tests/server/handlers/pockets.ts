import { API_URL_OLD, COMMON_NUMBERS } from "@/constants";
import type {
  DiffPullPocketParams,
  ListPocketParams,
} from "@/features/mirrors";
import type { PackageDiff, PackageObject } from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";
import { diffPocket, listPockets } from "@/tests/mocks/pockets";

export default [
  http.get<never, ListPocketParams, ApiPaginatedResponse<PackageObject>>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "ListPocket")) {
        return;
      }

      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? "";
      const offset =
        Number(url.searchParams.get("offset")) || COMMON_NUMBERS.ZERO;
      const limit = Number(url.searchParams.get("limit")) || 20;

      return HttpResponse.json(
        generatePaginatedResponse<PackageObject>({
          data: endpointStatus.status === "default" ? listPockets : [],
          limit,
          offset,
          search,
        }),
      );
    },
  ),
  http.get<never, DiffPullPocketParams, PackageDiff>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "DiffPullPocket")) {
        return;
      }

      return HttpResponse.json(diffPocket);
    },
  ),
];
