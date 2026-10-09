import { delay, http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import type {
  SearchPackagesRequest,
  SearchPackagesResponse,
  SearchUpgradesRequest,
  SearchUpgradesResponse,
} from "@/features/packages";
import type { GetPackagesParams, PackageOld } from "@/features/packages";
import type { Activity } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { packages } from "@/tests/mocks/packages";
import {
  downgradePackageVersions,
  getInstancePackages,
  packagesOld,
} from "@/tests/mocks/packagesOld";
import { activities } from "@/tests/mocks/activity";
import {
  generatePaginatedResponse,
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
          data: packagesOld,
          limit,
          offset,
        }),
      );
    },
  ),

  http.get(`${API_URL}computers/:id/packages`, async ({ params, request }) => {
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

  http.post<never, SearchUpgradesRequest, SearchUpgradesResponse>(
    `${API_URL}packages\\:search-upgrades`,
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

      return HttpResponse.json<SearchUpgradesResponse>({
        packages: response.results,
        count: response.count,
        next: response.next,
        prev: response.previous,
      });
    },
  ),
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
