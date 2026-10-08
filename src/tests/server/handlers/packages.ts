import { delay, http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import type {
  ComputerPackageSearchGroupedResponse,
  PackageSearchResultPackage,
  SearchPackagesResponse,
  SearchUpgradesRequest,
} from "@/features/packages";
import type { Activity } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  downgradePackageVersions,
  getComputerPackageSearchResults,
  upgradablePackages,
} from "@/tests/mocks/packages";
import { activities } from "@/tests/mocks/activity";
import {
  generateFilteredResponse,
  isAction,
  shouldApplyEndpointStatus,
} from "./_helpers";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";

const parseBooleanParam = (value: string | null): boolean | undefined => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
};

export default [
  http.post<never, SearchUpgradesRequest>(
    `${API_URL}packages:search-upgrades`,
    async ({ request }) => {
      if (
        shouldApplyEndpointStatus("package-upgrades") ||
        shouldApplyEndpointStatus("packages")
      ) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusNetworkError();
        }
        if (status === "empty") {
          return HttpResponse.json<SearchPackagesResponse>({
            packages: [],
            count: 0,
            next: null,
            prev: null,
          });
        }
      }

      let body: SearchUpgradesRequest = { computer_query: "" };
      try {
        body = await request.json();
      } catch {
        // default empty
      }

      const limit = body.limit ?? 10;
      const offset = body.offset ?? 0;

      let results: PackageSearchResultPackage[] = [...upgradablePackages];
      if (body.text) {
        results = generateFilteredResponse(results, body.text, ["name"]);
      }

      const totalCount = results.length;
      const paginatedResults = results.slice(offset, offset + limit);

      return HttpResponse.json<SearchPackagesResponse>({
        packages: paginatedResults,
        count: totalCount,
        next: offset + limit < totalCount ? "next" : null,
        prev: offset > 0 ? "prev" : null,
      });
    },
  ),

  http.get(
    `${API_URL}computers/:id/packages/search`,
    async ({ params, request }) => {
      if (shouldApplyEndpointStatus("computers-packages")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusNetworkError();
        }

        if (status === "loading") {
          await delay("infinite");
        }
      }

      const url = new URL(request.url);
      const limit = Number(url.searchParams.get("limit"));
      const offset = Number(url.searchParams.get("offset")) || 0;
      const search = url.searchParams.get("search") || "";
      const available = parseBooleanParam(url.searchParams.get("available"));
      const installed = parseBooleanParam(url.searchParams.get("installed"));
      const upgrade = parseBooleanParam(url.searchParams.get("upgrade"));
      const security = parseBooleanParam(url.searchParams.get("security"));
      const held = parseBooleanParam(url.searchParams.get("held"));
      const instanceId = Number(params.id);

      const hasFilters = [upgrade, security, held, available].some(
        (value) => value === true,
      );

      let groupedResults = getComputerPackageSearchResults(instanceId);

      if (!hasFilters && installed !== true) {
        groupedResults = [];
      }

      if (upgrade === true) {
        groupedResults = groupedResults.filter(({ installation_candidates }) =>
          installation_candidates.some((c) => c.upgrade),
        );
      }

      if (available === true) {
        groupedResults = groupedResults.filter(
          ({ installation_candidates }) => installation_candidates.length > 0,
        );
      }

      if (security === true) {
        groupedResults = groupedResults.filter(({ security: isSec }) => isSec);
      }

      if (held === true) {
        groupedResults = groupedResults.filter(({ held: isHeld }) => isHeld);
      }

      if (search) {
        groupedResults = generateFilteredResponse(groupedResults, search, [
          "name",
        ]);
      }

      const totalCount = groupedResults.length;
      const paginated = limit
        ? groupedResults.slice(offset, offset + limit)
        : groupedResults;

      return HttpResponse.json<ComputerPackageSearchGroupedResponse>({
        count: totalCount,
        results: paginated,
      });
    },
  ),

  http.get(
    `${API_URL}computers/:id/packages/installed/:packageName/downgrades`,
    () => {
      return HttpResponse.json({
        results: downgradePackageVersions,
      });
    },
  ),

  http.post<never, never, Activity>(
    `${API_URL}computers/:id/packages/installed`,
    async () => {
      return HttpResponse.json<Activity>(activities[0]);
    },
  ),

  http.post<never, never, Activity>(`${API_URL}packages`, async () => {
    return HttpResponse.json<Activity>(activities[0]);
  }),

  http.get<never, never, Activity>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "UpgradePackages")) {
      return;
    }

    if (shouldApplyEndpointStatus("UpgradePackages")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json<Activity>(activities[0]);
  }),
];
