import { API_URL_DEB_ARCHIVE } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import type { StrictResponse } from "msw";
import { delay, http, HttpResponse } from "msw";
import {
  getDebArchivePaginatedResponse,
  getDebArchivePaginationParams,
} from "./_helpers";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import type {
  Publication,
  PublishPublicationResponse,
} from "@canonical/landscape-openapi";
import { succeededOperation } from "@/tests/mocks/operations";

const matchesPublicationsPath = (endpointPath?: string) =>
  !endpointPath || endpointPath.includes("publications");

const getPublicationParam = (requestPublicationName: string) => {
  const decodedPublicationName = decodeURIComponent(requestPublicationName);

  return publications.find(
    ({ name, publicationId }) =>
      name === decodedPublicationName ||
      publicationId === decodedPublicationName,
  );
};

const toObjectBody = (value: unknown): Record<string, unknown> => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return {};
};

const parseApiFilter = (filter: string): ((pub: Publication) => boolean) => {
  const targetMatch = filter.match(/^publication_target="([^"]+)"$/);
  if (targetMatch) {
    const [, targetValue] = targetMatch;
    return (pub) => pub.publicationTarget === targetValue;
  }

  const sourceMatch = filter.match(/^source="([^"]+)"$/);
  if (sourceMatch) {
    const [, sourceValue] = sourceMatch;
    return (pub) => pub.source === sourceValue;
  }

  const displayNameMatch = filter.match(/^display_name="([^"]*)\*"$/);
  if (displayNameMatch) {
    const [, rawPrefix = ""] = displayNameMatch;
    const prefix = rawPrefix.toLowerCase();
    return (pub) =>
      pub.displayName.toLowerCase().startsWith(prefix) ||
      (pub.label?.toLowerCase().startsWith(prefix) ?? false);
  }

  return () => true;
};

const getPublicationsResponse = (requestUrl: string) => {
  const { searchParams } = new URL(requestUrl);
  const filter = searchParams.get("filter") ?? undefined;
  const publicationTargetId =
    searchParams.get("publicationTargetId") ?? undefined;
  const { pageSize, pageToken } = getDebArchivePaginationParams(requestUrl);

  let filteredPublications = filter
    ? publications.filter(parseApiFilter(filter))
    : publications;

  if (publicationTargetId) {
    filteredPublications = filteredPublications.filter(
      (pub) =>
        pub.publicationTarget === `publicationTargets/${publicationTargetId}`,
    );
  }

  const { paginatedData, nextPageToken } = getDebArchivePaginatedResponse(
    filteredPublications,
    pageToken,
    pageSize,
  );

  return HttpResponse.json({
    publications: paginatedData,
    nextPageToken,
  });
};

const getCreatePublicationResponse = async (request: Request) => {
  const publicationBody = toObjectBody(await request.json());

  return HttpResponse.json(
    {
      ...publications[0],
      ...publicationBody,
    },
    { status: 200 },
  );
};

const getPublicationDetailsResponse = (publicationName: string) => {
  const publication = getPublicationParam(publicationName);

  if (!publication) {
    return HttpResponse.json(
      { message: "Publication not found" },
      { status: 404 },
    );
  }

  return HttpResponse.json(publication);
};

const getDeletePublicationResponse = () => {
  return HttpResponse.json({}, { status: 200 });
};

const getPublishPublicationResponse =
  (): StrictResponse<PublishPublicationResponse> => {
    return HttpResponse.json(
      { ...succeededOperation, response: undefined },
      { status: 200 },
    );
  };

export default [
  http.get(`${API_URL_DEB_ARCHIVE}publications`, async ({ request }) => {
    await delay();

    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      matchesPublicationsPath(endpointStatus.path)
    ) {
      return ENDPOINT_STATUS_API_ERROR;
    }

    if (
      endpointStatus.status === "empty" &&
      matchesPublicationsPath(endpointStatus.path)
    ) {
      return HttpResponse.json({
        publications: [],
        nextPageToken: "",
      });
    }

    return getPublicationsResponse(request.url);
  }),

  http.post(`${API_URL_DEB_ARCHIVE}publications`, async ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      matchesPublicationsPath(endpointStatus.path)
    ) {
      return ENDPOINT_STATUS_API_ERROR;
    }

    return getCreatePublicationResponse(request);
  }),

  http.get(
    `${API_URL_DEB_ARCHIVE}publications/:publicationName`,
    ({ params }) => {
      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.status === "error" &&
        matchesPublicationsPath(endpointStatus.path)
      ) {
        return ENDPOINT_STATUS_API_ERROR;
      }

      return getPublicationDetailsResponse(params.publicationName as string);
    },
  ),

  http.delete(`${API_URL_DEB_ARCHIVE}publications/:publicationName`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      matchesPublicationsPath(endpointStatus.path)
    ) {
      return ENDPOINT_STATUS_API_ERROR;
    }

    return getDeletePublicationResponse();
  }),

  http.post(`${API_URL_DEB_ARCHIVE}publications/:publication\\:publish`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      matchesPublicationsPath(endpointStatus.path)
    ) {
      return ENDPOINT_STATUS_API_ERROR;
    }

    return getPublishPublicationResponse();
  }),
];
