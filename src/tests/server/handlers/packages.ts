import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  AvailableVersion,
  GetDryRunInstancesParams,
  GetPackagesParams,
  Package,
  VersionCount,
  DowngradeVersionCount,
} from "@/features/packages";
import type {
  GetPackageUpgradeParams,
  PackageUpgrade,
} from "@/features/upgrades";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import {
  availableVersions,
  downgradePackageVersions,
  downgradeVersions,
  getInstancePackages,
  packageInstances,
  packages,
  upgradePackages,
} from "@/tests/mocks/packages";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";

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
  http.get<never, GetPackagesParams, ApiPaginatedResponse<Package>>(
    `${API_URL}packages`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const limit = Number(url.searchParams.get("limit"));
      const offset = Number(url.searchParams.get("offset")) || 0;
      const search = url.searchParams.get("search") || "";
      const names = url.searchParams.getAll("names");

      return HttpResponse.json(
        generatePaginatedResponse<Package>({
          data: names.length
            ? packages.filter(({ name }) => names.includes(name))
            : packages,
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),

  http.get(`${API_URL}computers/:id/packages`, ({ params, request }) => {
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

  http.get(`${API_URL}packages/:id/available_versions`, ({ request }) => {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    const response: VersionCount = {
      out_of_scope: 4,
      versions: availableVersions,
    };

    if (action == "hold" || action == "unhold") {
      response.uninstalled = 1;
    }

    return HttpResponse.json<VersionCount>(response);
  }),

  http.get(`${API_URL}packages/:id/downgrade_versions`, () => {
    return HttpResponse.json<DowngradeVersionCount>({
      out_of_scope: 4,
      versions: downgradeVersions,
    });
  }),

  http.get<never, GetDryRunInstancesParams, AvailableVersion[]>(
    `${API_URL}packages/:packageId/dry-run`,
    ({ request }) => {
      const url = new URL(request.url);
      const versions = url.searchParams.get("versions")?.split(",") || [];
      const response = [
        ...availableVersions,
        { name: "", num_computers: 1 },
      ].filter(({ name }) => versions.includes(name));

      return HttpResponse.json<AvailableVersion[]>(response);
    },
  ),

  http.get(`${API_URL}packages/:packageId/dry-run/computers`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit"));
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("search") || "";

    return HttpResponse.json(
      generatePaginatedResponse({
        data: packageInstances,
        limit,
        offset,
        search,
        searchFields: ["name"],
      }),
    );
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

  http.get<never, never, Activity>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "UpgradePackages")) {
      return;
    }

    return HttpResponse.json<Activity>(activities[0]);
  }),
];
