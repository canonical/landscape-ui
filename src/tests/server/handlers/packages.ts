import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  SearchPackagesRequest,
  SearchPackagesResponse,
  GetPackageChangePlanSummaryResponse,
  CreatePackageChangePlanRequest,
  PackageChangePlan,
  ListPackageChangePlanItemsRequest,
  ListPackageChangePlanItemsResponse,
} from "@/features/packages";
import {
  PackageChangePlanAction,
  PackageChangePlanState,
  type GetPackagesParams,
  type PackageOld,
} from "@/features/packages";
import type {
  GetPackageUpgradeParams,
  PackageUpgrade,
} from "@/features/upgrades";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import {
  downgradePackageVersions,
  getInstancePackages,
  packagesOld,
  upgradePackages,
} from "@/tests/mocks/packagesOld";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import {
  generatePaginatedResponse,
  isAction,
  shouldApplyEndpointStatus,
} from "./_helpers";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import {
  packageChangePlanSummaryItems,
  packages,
} from "@/tests/mocks/packages";
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

export default [
  http.get<never, GetPackagesParams>(
    `${API_URL}packages`,
    async ({ request }) => {
      if (shouldApplyEndpointStatus("packages")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusNetworkError();
        }
      }

      const url = new URL(request.url);
      const limit = Number(url.searchParams.get("limit"));
      const offset = Number(url.searchParams.get("offset")) || 0;
      const search = url.searchParams.get("search") || "";
      const names = url.searchParams.getAll("names");

      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.status === "empty" &&
        endpointStatus.path === "packages"
      ) {
        return HttpResponse.json(
          generatePaginatedResponse<PackageOld>({ data: [], limit, offset }),
        );
      }

      return HttpResponse.json(
        generatePaginatedResponse<PackageOld>({
          data: names.length
            ? packagesOld.filter(({ name }) => names.includes(name))
            : packagesOld,
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),

  http.get(`${API_URL}computers/:id/packages`, ({ params, request }) => {
    if (shouldApplyEndpointStatus("computers-packages")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusNetworkError();
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

    let instancePackages = getInstancePackages(instanceId);

    if (!hasFilters && installed !== true) {
      instancePackages = [];
    }

    if (upgrade === true) {
      instancePackages = instancePackages.filter(
        ({ available_version }) => available_version,
      );
    }

    if (available === true) {
      instancePackages = instancePackages.filter(
        ({ available_version }) => available_version,
      );
    }

    if (security === true) {
      instancePackages = instancePackages.filter(
        ({ status }) => status === "security",
      );
    }

    if (held === true) {
      instancePackages = instancePackages.filter(
        ({ status }) => status === "held",
      );
    }

    return HttpResponse.json(
      generatePaginatedResponse({
        data: instancePackages,
        limit,
        offset,
        search,
        searchFields: ["name"],
      }),
    );
  }),

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

  http.get<
    never,
    GetPackageUpgradeParams,
    ApiPaginatedResponse<PackageUpgrade>
  >(`${API_URL}packages/upgrades`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit"));
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("search") || "";
    const priorities = url.searchParams.get("priorities")?.split(",");
    const severities = url.searchParams.get("severities")?.split(",");
    const upgradeType = url.searchParams.get("upgrade_type") || "all";

    let filteredPackages = upgradePackages.filter((upgradePackage) =>
      upgradePackage.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (priorities) {
      filteredPackages = filteredPackages.filter((upgradePackage) =>
        upgradePackage.priority
          ? priorities.includes(upgradePackage.priority)
          : false,
      );
    }

    if (severities) {
      filteredPackages = filteredPackages.filter((upgradePackage) =>
        upgradePackage.severity
          ? severities.includes(upgradePackage.severity)
          : false,
      );
    }

    if (upgradeType === "security") {
      filteredPackages = filteredPackages.filter(
        (upgradePackage) => upgradePackage.usn,
      );
    }

    return HttpResponse.json(
      generatePaginatedResponse({
        data: filteredPackages,
        limit,
        offset,
      }),
    );
  }),

  http.post(`${API_URL}computers/upgrade-packages`, async () => {
    return HttpResponse.json();
  }),

  http.post<never, SearchPackagesRequest, SearchPackagesResponse>(
    `${API_URL}packages:search`,
    async ({ request }) => {
      const body = await request.json();

      const response = generatePaginatedResponse({
        data: packages
          .filter((pkg) => {
            if (body.names === undefined) {
              return true;
            }

            return body.names.includes(pkg.name);
          })
          .filter((pkg) => {
            if (body.text === undefined) {
              return true;
            }

            const text = body.text.toLowerCase();

            return (
              pkg.name.toLowerCase().includes(text) ||
              pkg.summary.toLowerCase().includes(text)
            );
          }),
        limit: body.limit,
        offset: body.offset,
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
    never,
    ListPackageChangePlanItemsRequest,
    ListPackageChangePlanItemsResponse
  >(`${API_URL}package-change-plans/:id/items`, async ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit"));
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("computer_instance_name") || "";

    const filteredInstances = instances.filter((instance) =>
      instance.title.toLowerCase().includes(search.toLowerCase()),
    );

    return HttpResponse.json<ListPackageChangePlanItemsResponse>({
      items: filteredInstances
        .slice(offset, offset + limit)
        .map((instance) => ({
          computer: { id: instance.id, name: instance.title },
          id: 0,
          package_id: 0,
        })),
      count: filteredInstances.length,
    });
  }),

  http.get<never, never, GetPackageChangePlanSummaryResponse>(
    `${API_URL}package-change-plans/:id/summary`,
    async () => {
      return HttpResponse.json<GetPackageChangePlanSummaryResponse>({
        summary_items: packageChangePlanSummaryItems,
      });
    },
  ),

  http.post<never, CreatePackageChangePlanRequest, PackageChangePlan>(
    `${API_URL}package-change-plans`,
    async () => {
      return HttpResponse.json<PackageChangePlan>({
        id: 1,
        state: PackageChangePlanState.CREATED,
        action: PackageChangePlanAction.INSTALL,
        created_at: new Date().toISOString(),
        item_count: 10,
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
