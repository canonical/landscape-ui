import { API_URL_DEB_ARCHIVE } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { mirrors as mockMirrors } from "@/tests/mocks/mirrors";
import type { StrictResponse } from "msw";
import { delay, http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";
import type {
  ListMirrorPackagesResponse,
  MirrorServiceGetMirrorResponse,
  MirrorServiceUpdateMirrorResponse,
  MirrorServiceCreateMirrorResponse,
  MirrorServiceSyncMirrorResponse,
  BatchGetMirrorsResponse,
  MirrorWritable,
  Mirror,
} from "@canonical/landscape-openapi";
import {
  getDebArchivePaginatedResponse,
  getDebArchivePaginationParams,
  shouldApplyEndpointStatus,
} from "./_helpers";

const mirrors = [...(mockMirrors as Mirror[])];

export const resetMirrors = (): void => {
  mirrors.length = 0;
  mirrors.push(...(mockMirrors as Mirror[]));
};

const getMirrorsResponse = (requestUrl: string) => {
  const { pageSize, pageToken, search } =
    getDebArchivePaginationParams(requestUrl);
  const { paginatedData, nextPageToken } = getDebArchivePaginatedResponse(
    mirrors,
    pageToken,
    pageSize,
    search,
  );

  return HttpResponse.json({
    mirrors: paginatedData,
    nextPageToken,
  });
};

const getBatchMirrorsResponse = async (
  request: Request,
): Promise<StrictResponse<BatchGetMirrorsResponse>> => {
  const body = (await request.json()) as { names?: string[] };
  const requestedNames = body.names ?? [];
  const matched = mirrors.filter(({ name }) =>
    name ? requestedNames.includes(name) : false,
  );
  return HttpResponse.json({ mirrors: matched });
};

export default [
  http.post(`${API_URL_DEB_ARCHIVE}mirrors:batchGet`, async ({ request }) => {
    return getBatchMirrorsResponse(request);
  }),

  http.get(`${API_URL_DEB_ARCHIVE}mirrors`, async ({ request }) => {
    await delay();

    if (shouldApplyEndpointStatus("mirrors")) {
      const endpointStatus = getEndpointStatus("mirrors");

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json({ mirrors: [], nextPageToken: undefined });
      }
    }

    return getMirrorsResponse(request.url);
  }),

  http.post<never, MirrorWritable>(
    `${API_URL_DEB_ARCHIVE}mirrors`,
    async ({ request }) => {
      await delay();

      if (shouldApplyEndpointStatus("mirrors/create")) {
        const endpointStatus = getEndpointStatus("mirrors/create");

        if (endpointStatus.status === "variant") {
          return HttpResponse.json(
            endpointStatus.response as MirrorServiceCreateMirrorResponse,
          );
        }
      }

      const requestBody = await request.json();
      const mirrorId = requestBody.displayName.toLowerCase();
      const newMirror: Mirror = {
        mirrorId,
        name: `mirrors/${mirrorId}`,
        ...requestBody,
      };
      return HttpResponse.json<MirrorServiceCreateMirrorResponse>(newMirror);
    },
  ),

  http.get(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`, async ({ params }) => {
    await delay();

    const mirror = mirrors.find(({ mirrorId }) => mirrorId === params.mirrorId);

    if (!mirror) {
      return new HttpResponse(null, { status: 404 });
    } else {
      return HttpResponse.json<MirrorServiceGetMirrorResponse>(mirror);
    }
  }),

  http.get(
    `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId/packages`,
    async ({ params }) => {
      await delay();

      if (shouldApplyEndpointStatus("mirrors/packages")) {
        const endpointStatus = getEndpointStatus("mirrors/packages");

        if (endpointStatus.status === "variant") {
          return HttpResponse.json(
            endpointStatus.response as ListMirrorPackagesResponse,
          );
        }

        if (endpointStatus.status === "empty") {
          return HttpResponse.json<ListMirrorPackagesResponse>({
            mirrorPackages: [],
          });
        }

        if (endpointStatus.status === "error") {
          throw createEndpointStatusError();
        }
      }

      const mirror = mirrors.find(
        ({ mirrorId }) => mirrorId === params.mirrorId,
      );

      if (!mirror) {
        return new HttpResponse(null, { status: 404 });
      } else {
        return HttpResponse.json<ListMirrorPackagesResponse>({
          mirrorPackages: ["package-1", "package-2", "package-3"],
        });
      }
    },
  ),

  http.patch<{ mirrorId: string }, Partial<MirrorWritable>>(
    `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`,
    async ({ params, request }) => {
      await delay();

      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.status === "error" &&
        endpointStatus.path === "mirrors/:mirrorId"
      ) {
        throw createEndpointStatusError();
      }

      const mirrorIndex = mirrors.findIndex(
        ({ mirrorId }) => mirrorId === params.mirrorId,
      );

      if (mirrorIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      await request.json();

      if (shouldApplyEndpointStatus("mirrors/update")) {
        const endpointStatus = getEndpointStatus("mirrors/update");

        if (endpointStatus.status === "variant") {
          return HttpResponse.json(
            endpointStatus.response as MirrorServiceUpdateMirrorResponse,
          );
        }
      }

      return HttpResponse.json<MirrorServiceUpdateMirrorResponse>();
    },
  ),

  http.delete(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`, async ({ params }) => {
    await delay();

    const mirror = mirrors.find(({ mirrorId }) => mirrorId === params.mirrorId);

    if (shouldApplyEndpointStatus("mirrors/delete")) {
      const endpointStatus = getEndpointStatus("mirrors/delete");

      if (endpointStatus.status === "variant") {
        return HttpResponse.json(endpointStatus.response);
      }
    }

    if (!mirror) {
      return new HttpResponse(null, { status: 404 });
    } else {
      return HttpResponse.json();
    }
  }),

  http.post(
    `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId\\:sync`,
    async ({ params }) => {
      await delay();

      const mirror = mirrors.find(
        ({ mirrorId }) => mirrorId === params.mirrorId,
      );

      if (!mirror) {
        return new HttpResponse(null, { status: 404 });
      } else {
        return HttpResponse.json<MirrorServiceSyncMirrorResponse>();
      }
    },
  ),
];
