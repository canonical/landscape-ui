import { API_URL_DEB_ARCHIVE } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { mirrors as mockMirrors } from "@/tests/mocks/mirrors";
import type { StrictResponse } from "msw";
import { delay, http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import type {
  DeleteMirrorResponse,
  ListMirrorPackagesResponse,
  GetMirrorResponse,
  UpdateMirrorResponse,
  CreateMirrorResponse,
  SyncMirrorResponse,
  BatchGetMirrorsResponse,
  MirrorWritable,
  Mirror,
} from "@canonical/landscape-openapi";
import {
  getDebArchivePaginatedResponse,
  getDebArchivePaginationParams,
} from "./_helpers";

const mirrors = [...(mockMirrors as Mirror[])];

const getMirrorsResponse = (requestUrl: string) => {
  const { pageSize, pageToken } = getDebArchivePaginationParams(requestUrl);
  const { paginatedData, nextPageToken } = getDebArchivePaginatedResponse(
    mirrors,
    pageToken,
    pageSize,
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

    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "mirrors"
    ) {
      return ENDPOINT_STATUS_API_ERROR;
    }

    if (
      endpointStatus.status === "empty" &&
      endpointStatus.path === "mirrors"
    ) {
      return HttpResponse.json({ mirrors: [], nextPageToken: undefined });
    }

    return getMirrorsResponse(request.url);
  }),

  http.post<never, MirrorWritable>(
    `${API_URL_DEB_ARCHIVE}mirrors`,
    async ({ request }) => {
      await delay();

      const requestBody = await request.json();
      const mirrorId = requestBody.displayName.toLowerCase();

      mirrors.push({
        name: `mirrors/${mirrorId}`,
        mirrorId,
        ...requestBody,
      });

      return HttpResponse.json<CreateMirrorResponse>();
    },
  ),

  http.get(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`, async ({ params }) => {
    await delay();

    const mirror = mirrors.find(({ mirrorId }) => mirrorId === params.mirrorId);

    if (!mirror) {
      return new HttpResponse(null, { status: 404 });
    } else {
      return HttpResponse.json<GetMirrorResponse>(mirror);
    }
  }),

  http.get(
    `${API_URL_DEB_ARCHIVE}mirrors/:mirrorId/packages`,
    async ({ params }) => {
      await delay();

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

      const mirrorIndex = mirrors.findIndex(
        ({ mirrorId }) => mirrorId === params.mirrorId,
      );

      if (mirrorIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      const requestBody = await request.json();
      mirrors[mirrorIndex] = {
        ...mirrors[mirrorIndex],
        ...requestBody,
      } as Mirror;

      return HttpResponse.json<UpdateMirrorResponse>();
    },
  ),

  http.delete(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorId`, async ({ params }) => {
    await delay();

    const mirror = mirrors.find(({ mirrorId }) => mirrorId === params.mirrorId);

    if (!mirror) {
      return new HttpResponse(null, { status: 404 });
    } else {
      mirrors.splice(mirrors.indexOf(mirror), 1);
      return HttpResponse.json<DeleteMirrorResponse>(mirror);
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
        return HttpResponse.json<SyncMirrorResponse>();
      }
    },
  ),
];
