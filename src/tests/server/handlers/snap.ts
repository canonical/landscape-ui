import { API_URL } from "@/constants";
import type {
  GetSnapsParams,
  InstalledSnap,
  SnapAction,
  SnapActionParams,
} from "@/features/snaps";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  availableSnapInfo,
  availableSnaps,
  installedSnaps,
  successfulSnapInstallResponse,
} from "@/tests/mocks/snap";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { delay, http, HttpResponse } from "msw";
import {
  generateFilteredResponse,
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "./_helpers";
import { createEndpointStatusError } from "./_constants";

const SNAP_ACTION_VERBS: Record<SnapAction, string> = {
  install: "Install",
  remove: "Remove",
  refresh: "Refresh",
  hold: "Hold",
  unhold: "Unhold",
  changeChannel: "Change channel of",
};

export default [
  http.get(
    `${API_URL}computers/:computerId/snaps/available`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("name_startswith") ?? "";
      if (endpointStatus.status === "error") {
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
      return HttpResponse.json({
        results: generateFilteredResponse(availableSnaps, search, ["name"]),
      });
    },
  ),

  http.get<{ name: string }>(
    `${API_URL}computers/:computerId/snaps/:name/info`,
    async ({ params }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
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

      return HttpResponse.json(
        availableSnapInfo.find(
          (snap) => snap.name === decodeURIComponent(params.name),
        ) || null,
      );
    },
  ),

  http.get(`${API_URL}snaps/installed`, async ({ request }) => {
    if (shouldApplyEndpointStatus("snaps")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      if (endpointStatus.status === "loading") {
        await delay("infinite");
      }
    }

    const DEFAULT_PAGE_SIZE = 20;
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const offset = Number(url.searchParams.get("offset")) || 0;
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;

    return HttpResponse.json(
      generatePaginatedResponse({
        data: installedSnaps,
        limit,
        offset,
        search,
        searchFields: ["snap.name"],
      }),
    );
  }),

  http.post<never, SnapActionParams>(`${API_URL}snaps`, async ({ request }) => {
    if (shouldApplyEndpointStatus("snaps/action")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      if (endpointStatus.status === "loading") {
        await delay("infinite");
      }
    }

    const { action } = await request.json();

    return HttpResponse.json({
      ...successfulSnapInstallResponse,
      summary: `${SNAP_ACTION_VERBS[action as SnapAction]} snaps on computer`,
    });
  }),

  http.get<never, GetSnapsParams, ApiPaginatedResponse<InstalledSnap>>(
    `${API_URL}computers/:computerId/snaps/installed`,
    async ({ request }) => {
      const DEFAULT_PAGE_SIZE = 20;
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? "";
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;

      if (
        shouldApplyEndpointStatus("computers/:computerId/snaps/installed") &&
        endpointStatus.status === "error"
      ) {
        throw createEndpointStatusError();
      }

      return HttpResponse.json(
        generatePaginatedResponse<InstalledSnap>({
          data: endpointStatus.status === "default" ? installedSnaps : [],
          limit,
          offset,
          search,
          searchFields: ["snap.name"],
        }),
      );
    },
  ),
];
