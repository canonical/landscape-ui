import { delay, http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  ComputerPackageSearchGroupedResponse,
  SearchPackagesRequest,
  SearchPackagesResponse,
  GetPackageChangePlanSummaryResponse,
  CreatePackageChangePlanRequest,
  PackageChangePlan,
  ListPackageChangePlanItemsRequest,
  ListPackageChangePlanItemsResponse,
  SearchUpgradesRequest,
  PackageChangePlanItem,
  Package,
  PackageChangePlanAction,
  GetPackageChangePlanExclusionItemsRequest,
  GetPackageChangePlanExclusionItemsResponse,
  PackageSearchResultPackage,
} from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import {
  downgradePackageVersions,
  getComputerPackageSearchResults,
  legacyPackages,
  packages,
} from "@/tests/mocks/packages";
import {
  generateFilteredResponse,
  generatePaginatedResponse,
  isAction,
  shouldApplyEndpointStatus,
} from "./_helpers";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import { instances } from "@/tests/mocks/instance";

const parseBooleanParam = (value: string | null): boolean | undefined => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
};

const getPackageChangePlanSummaryAction = (
  id: string,
  { id: packageId, name, version }: Package,
): PackageChangePlanAction => {
  switch (id) {
    case "1": // install
      return {
        type: "install",
        package: {
          id: packageId,
          name,
          version,
        },
      };
    case "2": // remove
      return {
        type: "remove",
        package: {
          id: packageId,
          name,
          version,
        },
      };
    case "3": // hold
      return {
        type: "hold",
        package: {
          id: packageId,
          name,
          version,
        },
      };
    case "4": // unhold
      return {
        type: "unhold",
        package: {
          id: packageId,
          name,
          version,
        },
      };
    case "5": // change_version
      return {
        type: "change_version",
        from_package: {
          id: packageId,
          name,
          version,
        },
        to_package: {
          id: packageId + 1,
          name,
          version: `${version}-1`,
        },
      };
    case "6": // upgrade
      return {
        type: "upgrade",
        to_package: {
          id: packageId,
          name,
          version,
        },
      };
    default:
      return {
        type: "install",
        package: {
          id: packageId,
          name,
          version,
        },
      };
  }
};

const getPackageChangePlanActionType = (id: string) => {
  switch (id) {
    case "1":
      return "install";
    case "2":
      return "remove";
    case "3":
      return "hold";
    case "4":
      return "unhold";
    case "5":
      return "change_version";
    case "6":
      return "upgrade";
    default:
      return "install";
  }
};

export default [
  http.post<never, SearchUpgradesRequest>(
    `${API_URL}packages\\:search-upgrades`,
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

      const computerQueryIds = body.computer_query
        ? body.computer_query
            .split(" OR ")
            .map((part) => Number(part.replace("id:", "")))
            .filter((id) => !Number.isNaN(id))
        : [];

      const selectedComputerIds =
        computerQueryIds.length > 0
          ? new Set(computerQueryIds)
          : new Set(
              legacyPackages.flatMap((pkg) => pkg.computers.map((c) => c.id)),
            );

      let results: PackageSearchResultPackage[] = legacyPackages
        .filter(
          (pkg) =>
            (!body.names?.length || body.names.includes(pkg.name)) &&
            pkg.computers.some(
              (c) =>
                selectedComputerIds.has(c.id) && c.available_version !== null,
            ),
        )
        .map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          summary: pkg.summary,
          version: pkg.computers[0]?.current_version ?? "1.0.0",
          computers: {
            count: pkg.computers.filter(
              (c) =>
                selectedComputerIds.has(c.id) && c.available_version !== null,
            ).length,
          },
        }));

      if (body.text) {
        results = generateFilteredResponse(results, body.text, [
          "name",
          "summary",
        ]);
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

  http.post(`${API_URL}computers/upgrade-packages`, async () => {
    return HttpResponse.json();
  }),

  http.post<never, SearchPackagesRequest, SearchPackagesResponse>(
    `${API_URL}packages\\:search`,
    async ({ request }) => {
      const body = await request.json();

      const response = generatePaginatedResponse({
        data: packages.filter((pkg) => {
          if (body.names === undefined) {
            return true;
          }

          return body.names.split(",").includes(pkg.name);
        }),
        limit: body.limit,
        offset: body.offset,
        search: body.text,
        searchFields: ["name", "summary"],
      });

      return HttpResponse.json<SearchPackagesResponse>({
        packages: response.results,
        count: response.count,
        next: response.next,
        prev: response.previous,
      });
    },
  ),

  http.get<
    { id: string },
    ListPackageChangePlanItemsRequest,
    ListPackageChangePlanItemsResponse
  >(`${API_URL}package-change-plans/:id/items`, async ({ params, request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit"));
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("computer_instance_name") || "";

    const filteredInstances = instances.filter((instance) =>
      instance.title.toLowerCase().includes(search.toLowerCase()),
    );

    const actionType = getPackageChangePlanActionType(params.id);

    return HttpResponse.json<ListPackageChangePlanItemsResponse>({
      action: actionType,
      items: filteredInstances
        .slice(offset, offset + limit)
        .map<PackageChangePlanItem>((instance) => ({
          action: getPackageChangePlanSummaryAction(params.id, packages[0]!),
          computer: { id: instance.id, name: instance.title },
        })),
      count: filteredInstances.length,
      next: "",
      previous: "",
    });
  }),

  http.get<{ id: string }, never, GetPackageChangePlanSummaryResponse>(
    `${API_URL}package-change-plans/:id/summary`,
    async ({ params }) => {
      return HttpResponse.json<GetPackageChangePlanSummaryResponse>({
        actions: packages
          .slice(0, 10)
          .map<GetPackageChangePlanSummaryResponse["actions"][number]>(
            (pkg) => ({
              action: getPackageChangePlanSummaryAction(params.id, pkg),
              computer_count: pkg.computers.count,
            }),
          ),
        exclusions: packages.slice(0, 10).map(({ name, computers }) => ({
          package_name: name,
          computer_count: computers.count,
        })),
      });
    },
  ),

  http.get<
    { id: string; package_name: string },
    GetPackageChangePlanExclusionItemsRequest,
    GetPackageChangePlanExclusionItemsResponse
  >(
    `${API_URL}package-change-plans/:id/exclusions/:package_name`,
    async ({ params, request }) => {
      const url = new URL(request.url);
      const search = url.searchParams.get("computer_instance_name") || "";

      const filteredInstances = instances.filter((instance) =>
        instance.title.toLowerCase().includes(search.toLowerCase()),
      );

      const actionType = getPackageChangePlanActionType(params.id);

      return HttpResponse.json<GetPackageChangePlanExclusionItemsResponse>({
        action: actionType,
        computers: filteredInstances.map((instance) => ({
          id: instance.id,
          name: instance.title,
        })),
        package_name: params.package_name,
      });
    },
  ),

  http.post<never, CreatePackageChangePlanRequest, PackageChangePlan>(
    `${API_URL}package-change-plans`,
    async ({ request }) => {
      const body = await request.json();

      let id: number;

      if ("install_config" in body) {
        id = 1;
      } else if ("remove_config" in body) {
        id = 2;
      } else if ("hold_config" in body) {
        id = 3;
      } else if ("unhold_config" in body) {
        id = 4;
      } else if ("change_version_config" in body) {
        id = 5;
      } else if ("upgrade_config" in body) {
        id = 6;
      } else {
        id = 7;
      }

      return HttpResponse.json<PackageChangePlan>({
        id,
        state: "pending",
        action: "install",
        created_at: new Date().toISOString(),
        item_count: packages.length,
        activity_id: activities[0].id,
        executed_at: null,
        expires_at: null,
      });
    },
  ),

  http.post<never, never, Activity>(
    `${API_URL}package-change-plans/:id\\:execute`,
    async () => {
      return HttpResponse.json<Activity>(activities[0]);
    },
  ),

  http.delete(`${API_URL}package-change-plans/:id`, async () => {
    return HttpResponse.json();
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
