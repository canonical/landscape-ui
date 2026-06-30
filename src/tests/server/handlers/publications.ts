import { API_URL_DEB_ARCHIVE } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import type { StrictResponse } from "msw";
import { delay, http, HttpResponse } from "msw";
import {
  getDebArchivePaginatedResponse,
  getDebArchivePaginationParams,
  shouldApplyEndpointStatus,
} from "./_helpers";
import { createEndpointStatusError } from "./_constants";
import type {
  Publication,
  PublicationServicePublishPublicationResponse,
} from "@canonical/landscape-openapi";
import { succeededOperation } from "@/tests/mocks/operations";

const getPublicationParam = (requestPublicationName: string) => {
  const decodedPublicationName = decodeURIComponent(requestPublicationName);

  return publications.find(
    ({ name, publicationId }) =>
      name === decodedPublicationName ||
      publicationId === decodedPublicationName,
  );
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
    const [, prefix = ""] = displayNameMatch;
    return (pub) =>
      pub.displayName.startsWith(prefix) ||
      (pub.label?.startsWith(prefix) ?? false);
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

const getCreatePublicationResponse = () =>
  HttpResponse.json(
    {
      ...publications[0],
    } satisfies Publication,
    { status: 200 },
  );

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
  (): StrictResponse<PublicationServicePublishPublicationResponse> => {
    return HttpResponse.json(
      { ...succeededOperation, response: undefined },
      { status: 200 },
    );
  };

export default [
  http.get(`${API_URL_DEB_ARCHIVE}publications`, async ({ request }) => {
    await delay();

    if (shouldApplyEndpointStatus("publications")) {
      const endpointStatus = getEndpointStatus("publications");

      if (endpointStatus.status === "variant") {
        return HttpResponse.json(endpointStatus.response);
      }

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json({
          publications: [],
          nextPageToken: "",
        });
      }
    }

    return getPublicationsResponse(request.url);
  }),

  http.post(`${API_URL_DEB_ARCHIVE}publications`, async () => {
    if (shouldApplyEndpointStatus("publications")) {
      const endpointStatus = getEndpointStatus("publications");

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return getCreatePublicationResponse();
  }),

  http.get(
    `${API_URL_DEB_ARCHIVE}publications/:publicationName`,
    ({ params }) => {
      if (shouldApplyEndpointStatus("publications")) {
        const endpointStatus = getEndpointStatus("publications");

        if (endpointStatus.status === "error") {
          throw createEndpointStatusError();
        }
      }

      return getPublicationDetailsResponse(params.publicationName as string);
    },
  ),

  http.delete(`${API_URL_DEB_ARCHIVE}publications/:publicationName`, () => {
    if (shouldApplyEndpointStatus("publications")) {
      const endpointStatus = getEndpointStatus("publications");

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return getDeletePublicationResponse();
  }),

  http.post(
    `${API_URL_DEB_ARCHIVE}publications/:publication\\:publish`,
    async () => {
      if (shouldApplyEndpointStatus("publications")) {
        const endpointStatus = getEndpointStatus("publications");

        if (endpointStatus.status === "error") {
          throw createEndpointStatusError();
        }
      }

      return getPublishPublicationResponse();
    },
  ),
];
