import { API_URL, API_URL_OLD } from "@/constants";
import type {
  DiffPullPocketParams,
  ListPocketParams,
} from "@/features/mirrors";
import type { PackageDiff, PackageObject } from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";
import { diffPocket, listPockets } from "@/tests/mocks/pockets";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get<never, ListPocketParams, ApiPaginatedResponse<PackageObject>>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "ListPocket")) {
        return;
      }

      const DEFAULT_PAGE_SIZE = 20;

      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? "";
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
      const shouldUseEmptyData =
        endpointStatus.status === "empty" &&
        (!endpointStatus.path || endpointStatus.path === "ListPocket");
      const listPocketSource =
        endpointStatus.path === "ListPocketMany"
          ? Array.from({ length: 25 }, (_, index) => {
              const basePocket = listPockets[index % listPockets.length];
              if (!basePocket) {
                throw new Error(
                  "Expected at least one pocket in mock pocket data",
                );
              }
              return {
                ...basePocket,
                name: `${basePocket.name}-${index + 1}`,
              };
            })
          : listPockets;

      return HttpResponse.json(
        generatePaginatedResponse<PackageObject>({
          data: shouldUseEmptyData ? [] : listPocketSource,
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

      const endpointStatus = getEndpointStatus();

      if (endpointStatus.path === "DiffPullPocketUpdate") {
        return HttpResponse.json({
          "main:amd64": {
            add: [],
            update: [["pocket1", "1.0.0", "2.0.0"]],
            delete: [["pocket2", "1.0.0"]],
          },
        });
      }

      if (endpointStatus.path === "DiffPullPocketAddOnly") {
        return HttpResponse.json({
          "main:amd64": {
            add: [["pocket1", "1.0.0"]],
            update: [],
            delete: [],
          },
        });
      }

      if (endpointStatus.path === "DiffPullPocketNoChanges") {
        return HttpResponse.json({});
      }

      return HttpResponse.json(diffPocket);
    },
  ),
  http.get(API_URL_OLD, async ({ request }) => {
    if (
      !isAction(request, [
        "EditPocket",
        "SyncMirrorPocket",
        "PullPackagesToPocket",
      ])
    ) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    const action = new URL(request.url).searchParams.get("action");
    if (
      endpointStatus.path === "SyncMirrorPocketLoading" &&
      isAction(request, "SyncMirrorPocket")
    ) {
      return new Promise<never>(() => undefined);
    }

    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === action)
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(activities[0]);
  }),
  http.get(API_URL_OLD, async ({ request }) => {
    if (
      !isAction(request, [
        "RemovePocket",
        "RemovePackagesFromPocket",
        "AddPackageFiltersToPocket",
        "RemovePackageFiltersFromPocket",
        "AddUploaderGPGKeysToPocket",
        "RemoveUploaderGPGKeysFromPocket",
      ])
    ) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    const action = new URL(request.url).searchParams.get("action");
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === action)
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(null);
  }),
  http.post(`${API_URL}pockets/sync`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "pockets/sync")
    ) {
      throw getEndpointStatusApiError();
    }
    return HttpResponse.json(activities[0]);
  }),
  http.post(`${API_URL}pockets/pull`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "pockets/pull")
    ) {
      throw getEndpointStatusApiError();
    }
    return HttpResponse.json(activities[0]);
  }),
  http.delete(`${API_URL}pockets/:distribution/:series/:name`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "pockets/delete")
    ) {
      throw getEndpointStatusApiError();
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
