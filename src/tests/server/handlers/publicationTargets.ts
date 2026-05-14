import { API_URL_DEB_ARCHIVE } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import type {
  PublicationTarget,
  BatchGetPublicationTargetsResponse,
} from "@canonical/landscape-openapi";
import { http, HttpResponse, type StrictResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import {
  getDebArchivePaginatedResponse,
  getDebArchivePaginationParams,
} from "./_helpers";

const getPublicationTargetsResponse = (requestUrl: string) => {
  const { pageSize, pageToken } = getDebArchivePaginationParams(requestUrl);
  const { paginatedData, nextPageToken } = getDebArchivePaginatedResponse(
    publicationTargets,
    pageToken,
    pageSize,
  );

  return HttpResponse.json({
    publicationTargets: paginatedData,
    nextPageToken,
  });
};

const getBatchPublicationTargetsResponse = async (
  request: Request,
): Promise<StrictResponse<BatchGetPublicationTargetsResponse>> => {
  const body = (await request.json()) as { names?: string[] };
  const requestedNames = body.names ?? [];
  const matched = publicationTargets.filter(({ name }) =>
    name ? requestedNames.includes(name) : false,
  );
  return HttpResponse.json({ publicationTargets: matched });
};

export default [
  http.post(`${API_URL_DEB_ARCHIVE}publicationTargets`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      PublicationTarget,
      "name" | "publicationTargetId"
    >;
    const now = Date.now();
    const newTarget: PublicationTarget = {
      name: `publicationTargets/new-${now}`,
      publicationTargetId: `new-${now}`,
      ...body,
    };
    return HttpResponse.json(newTarget, { status: 201 });
  }),

  http.delete(`${API_URL_DEB_ARCHIVE}publicationTargets/:id`, ({ params }) => {
    const idx = publicationTargets.findIndex(
      (t) => t.name === `publicationTargets/${params.id}`,
    );
    if (idx !== -1) publicationTargets.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(
    `${API_URL_DEB_ARCHIVE}publicationTargets/:id`,
    async ({ params, request }) => {
      const body = (await request.json()) as Partial<PublicationTarget>;
      const idx = publicationTargets.findIndex(
        (t) => t.name === `publicationTargets/${params.id}`,
      );
      const existing = publicationTargets[idx];
      if (idx === -1 || !existing)
        return new HttpResponse(null, { status: 404 });
      const updated: PublicationTarget = {
        ...existing,
        ...body,
        ...(body.s3 ? { s3: { ...existing.s3, ...body.s3 } } : {}),
        ...(body.swift ? { swift: { ...existing.swift, ...body.swift } } : {}),
        ...(body.filesystem
          ? { filesystem: { ...existing.filesystem, ...body.filesystem } }
          : {}),
      } as PublicationTarget;
      publicationTargets[idx] = updated;
      return HttpResponse.json(updated);
    },
  ),

  http.post(
    `${API_URL_DEB_ARCHIVE}publicationTargets:batchGet`,
    async ({ request }) => {
      return getBatchPublicationTargetsResponse(request);
    },
  ),

  // Fallback GET for integration tests that don't mock useGetPublicationTargets directly
  http.get(`${API_URL_DEB_ARCHIVE}publicationTargets`, ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "publicationTargets"
    ) {
      return ENDPOINT_STATUS_API_ERROR;
    }

    if (
      endpointStatus.status === "empty" &&
      endpointStatus.path === "publicationTargets"
    ) {
      return HttpResponse.json({
        publicationTargets: [],
        nextPageToken: "",
      });
    }

    return getPublicationTargetsResponse(request.url);
  }),
];
