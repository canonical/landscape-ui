import { delay, http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  paginatedPackages,
  repositories,
} from "@/tests/mocks/localRepositories";
import type {
  ImportLocalPackagesRequest,
  BatchGetLocalsRequest,
  LocalWritable,
} from "@canonical/landscape-openapi";
import { idleOperation } from "@/tests/mocks/operations";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { shouldApplyEndpointStatus } from "./_helpers";
import { createEndpointStatusError } from "./_constants";

const applyEndpointStatus = async (emptyResponse = {}) => {
  const endpointStatus = getEndpointStatus("locals");

  if (endpointStatus.status === "error") {
    throw createEndpointStatusError();
  }

  if (endpointStatus.status === "empty") {
    return HttpResponse.json(emptyResponse);
  }

  if (endpointStatus.status === "loading") {
    await delay("infinite");
  }

  if (endpointStatus.status === "variant") {
    return HttpResponse.json(endpointStatus.response ?? {});
  }
};

export default [
  http.get(`${API_URL_DEB_ARCHIVE}locals`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("filter")?.split("=").pop() ?? "";

    if (shouldApplyEndpointStatus("locals")) {
      return applyEndpointStatus({ locals: [] });
    }

    if (!search) {
      return HttpResponse.json({ locals: repositories });
    }

    return HttpResponse.json({
      locals: repositories.filter(({ displayName }) =>
        displayName.startsWith(search.replaceAll(/"|\*/gm, "")),
      ),
    });
  }),

  http.post<never, LocalWritable>(
    `${API_URL_DEB_ARCHIVE}locals`,
    async ({ request }) => {
      const { displayName: namePosted } = await request.json();

      if (shouldApplyEndpointStatus("locals")) {
        return applyEndpointStatus();
      }

      return HttpResponse.json(
        repositories.find(({ displayName }) => namePosted === displayName),
      );
    },
  ),

  http.post<never, BatchGetLocalsRequest>(
    `${API_URL_DEB_ARCHIVE}locals\\:batchGet`,
    async ({ request }) => {
      const { names } = await request.json();

      if (shouldApplyEndpointStatus("locals")) {
        return applyEndpointStatus({ locals: [] });
      }

      return HttpResponse.json({
        locals: repositories.filter(({ name }) => names.includes(name ?? "")),
      });
    },
  ),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ params }) => {
    const { repository } = params;

    if (shouldApplyEndpointStatus("locals")) {
      return applyEndpointStatus();
    }

    return HttpResponse.json(
      repositories.find(({ localId }) => localId === repository),
    );
  }),

  http.patch(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ params }) => {
    const { repository } = params;

    if (shouldApplyEndpointStatus("locals")) {
      return applyEndpointStatus();
    }

    return HttpResponse.json(
      repositories.find(({ localId }) => localId === repository),
    );
  }),

  http.delete(`${API_URL_DEB_ARCHIVE}locals/:repository`, () => {
    if (shouldApplyEndpointStatus("locals")) {
      return applyEndpointStatus();
    }

    return HttpResponse.json();
  }),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository/packages`, () => {
    if (shouldApplyEndpointStatus("locals")) {
      return applyEndpointStatus({ localPackages: [] });
    }

    return HttpResponse.json({
      localPackages: paginatedPackages,
    });
  }),

  http.post<never, ImportLocalPackagesRequest>(
    `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
    async ({ request }) => {
      const { url } = await request.json();

      if (shouldApplyEndpointStatus("locals")) {
        return applyEndpointStatus();
      }

      let id = "oooo-vvvv-cccc";

      if (url === "https://example.com/failed") {
        id = "ffff-llll-dddd";
      }

      if (url === "https://example.com/timeout") {
        id = "tttt-mmmm-oooo";
      }

      if (url === "https://example.com/idle") {
        id = "iiii-dddd-llll";
      }

      if (url === "https://example.com/in/progress") {
        id = "pppp-gggg-ssss";
      }

      if (url === "https://example.com/empty") {
        id = "mmmm-pppp-tttt";
      }

      if (url === "https://example.com/succeeded") {
        id = "ssss-cccc-dddd";
      }

      return HttpResponse.json({ ...idleOperation, name: `operations/${id}` });
    },
  ),
];
