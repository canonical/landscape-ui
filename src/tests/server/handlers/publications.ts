import { API_URL_DEB_ARCHIVE } from "@/constants";
import type {
  PublishPublicationResponse,
  BatchGetPublicationTargetsResponse,
  BatchGetMirrorsResponse,
  BatchGetLocalsResponse,
} from "@/features/publications";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  locals,
  mirrors,
  publications,
  publicationTargets,
} from "@/tests/mocks/publications";
import type { StrictResponse } from "msw";
import { delay, http, HttpResponse } from "msw";
import { generateFilteredResponse } from "./_helpers";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import type { ListMirrorPackagesResponse } from "@canonical/landscape-openapi";

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

const getPaginationParams = (requestUrl: string) => {
  const { searchParams } = new URL(requestUrl);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
  const pageToken = parseInt(searchParams.get("pageToken") ?? "0", 10) || 0;

  return {
    pageSize,
    pageToken,
  };
};

const getPaginatedResponse = <T extends Record<string, unknown>>(
  data: T[],
  pageToken: number,
  pageSize: number,
) => {
  const paginatedData = data.slice(pageToken, pageToken + pageSize);

  const nextPageToken =
    pageToken + pageSize < data.length
      ? String(pageToken + pageSize)
      : undefined;

  return {
    paginatedData,
    nextPageToken,
  };
};

const getMirrorsResponse = (requestUrl: string) => {
  const { pageSize, pageToken } = getPaginationParams(requestUrl);
  const { paginatedData, nextPageToken } = getPaginatedResponse(
    mirrors,
    pageToken,
    pageSize,
  );

  return HttpResponse.json({
    mirrors: paginatedData,
    nextPageToken,
  });
};

const getLocalsResponse = (requestUrl: string) => {
  const { pageSize, pageToken } = getPaginationParams(requestUrl);
  const { paginatedData, nextPageToken } = getPaginatedResponse(
    locals,
    pageToken,
    pageSize,
  );

  return HttpResponse.json({
    locals: paginatedData,
    nextPageToken,
  });
};

const getPublicationTargetsResponse = (requestUrl: string) => {
  const { pageSize, pageToken } = getPaginationParams(requestUrl);
  const { paginatedData, nextPageToken } = getPaginatedResponse(
    publicationTargets,
    pageToken,
    pageSize,
  );

  return HttpResponse.json({
    publicationTargets: paginatedData,
    nextPageToken,
  });
};

const getPublicationsResponse = (requestUrl: string) => {
  const { searchParams } = new URL(requestUrl);
  const search = searchParams.get("search") ?? undefined;
  const { pageSize, pageToken } = getPaginationParams(requestUrl);

  const filteredPublications = search
    ? generateFilteredResponse(publications, search, [
        "name",
        "source",
        "publicationTarget",
      ])
    : publications;

  const { paginatedData, nextPageToken } = getPaginatedResponse(
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

const getUpdatePublicationResponse = async (
  publicationName: string,
  request: Request,
) => {
  const publication = getPublicationParam(publicationName);

  if (!publication) {
    return HttpResponse.json(
      { message: "Publication not found" },
      { status: 404 },
    );
  }

  const body = toObjectBody(await request.json());

  return HttpResponse.json({
    ...publication,
    ...body,
  });
};

const getDeletePublicationResponse = () => {
  return HttpResponse.json({}, { status: 200 });
};

const getPublishPublicationResponse =
  (): StrictResponse<PublishPublicationResponse> => {
    return HttpResponse.json(
      {
        task: {
          name: "tasks/2b3f9f18-2f74-4b6f-95f0-57c4e12fd8d3",
          displayName:
            "publish publications/7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
          taskId: "2b3f9f18-2f74-4b6f-95f0-57c4e12fd8d3",
          status: "RUNNING",
          output: "",
        },
      },
      { status: 200 },
    );
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

const getBatchLocalsResponse = async (
  request: Request,
): Promise<StrictResponse<BatchGetLocalsResponse>> => {
  const body = (await request.json()) as { names?: string[] };
  const requestedNames = body.names ?? [];
  const matched = locals.filter(({ name }) =>
    name ? requestedNames.includes(name) : false,
  );
  return HttpResponse.json({ locals: matched });
};

export default [
  http.post(
    `${API_URL_DEB_ARCHIVE}publicationTargets:batchGet`,
    async ({ request }) => {
      return getBatchPublicationTargetsResponse(request);
    },
  ),

  http.post(`${API_URL_DEB_ARCHIVE}mirrors:batchGet`, async ({ request }) => {
    return getBatchMirrorsResponse(request);
  }),

  http.post(`${API_URL_DEB_ARCHIVE}locals:batchGet`, async ({ request }) => {
    return getBatchLocalsResponse(request);
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

    return getMirrorsResponse(request.url);
  }),

  http.get(`${API_URL_DEB_ARCHIVE}mirrors/:mirrorName/packages`, async () => {
    await delay();

    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      matchesPublicationsPath(endpointStatus.path)
    ) {
      return HttpResponse.json(
        { message: "Failed to get packages" },
        { status: 500 },
      );
    }

    return HttpResponse.json<ListMirrorPackagesResponse>({
      mirrorPackages: ["package-1", "package-2", "package-3"],
    });
  }),

  http.get(`${API_URL_DEB_ARCHIVE}locals`, ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error" && endpointStatus.path === "locals") {
      return ENDPOINT_STATUS_API_ERROR;
    }

    return getLocalsResponse(request.url);
  }),

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

  http.patch(
    `${API_URL_DEB_ARCHIVE}publications/:publicationName`,
    async ({ params, request }) => {
      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.status === "error" &&
        matchesPublicationsPath(endpointStatus.path)
      ) {
        return ENDPOINT_STATUS_API_ERROR;
      }

      return getUpdatePublicationResponse(
        params.publicationName as string,
        request,
      );
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

  http.post(
    new RegExp(`${API_URL_DEB_ARCHIVE}publications/.+:publish$`),
    () => {
      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.status === "error" &&
        matchesPublicationsPath(endpointStatus.path)
      ) {
        return ENDPOINT_STATUS_API_ERROR;
      }

      return getPublishPublicationResponse();
    },
  ),
];
