import { http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  paginatedPackages,
  repositories,
} from "@/tests/mocks/localRepositories";
import type {
  LocalServiceImportLocalPackagesBody,
  BatchGetLocalsRequest,
  LocalWritable,
} from "@canonical/landscape-openapi";
import { idleOperation } from "@/tests/mocks/operations";

const getBatchLocalsResponse = async (
  request: Request,
): Promise<HttpResponse> => {
  const body = (await request.json()) as { names: string[] };
  const requestedNames = body.names ?? [];
  const matched = repositories.filter(({ name }) =>
    name ? requestedNames.includes(name) : false,
  );
  return HttpResponse.json({ locals: matched });
};

export default [
  http.get(`${API_URL_DEB_ARCHIVE}locals`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("filter")?.split("=").pop() ?? "";

    if (!search) {
      return HttpResponse.json({ locals: repositories });
    }

    return HttpResponse.json({
      locals: repositories.filter(({ displayName }) =>
        displayName.includes(search.replaceAll(/"|\*/gm, "")),
      ),
    });
  }),

  http.post(`${API_URL_DEB_ARCHIVE}locals:batchGet`, async ({ request }) => {
    return getBatchLocalsResponse(request);
  }),

  http.post<never, LocalWritable>(
    `${API_URL_DEB_ARCHIVE}locals`,
    async ({ request }) => {
      const { displayName: namePosted } = await request.json();

      return HttpResponse.json(
        repositories.find(({ displayName }) => namePosted === displayName),
      );
    },
  ),

  http.post<never, BatchGetLocalsRequest>(
    `${API_URL_DEB_ARCHIVE}locals\\:batchGet`,
    async ({ request }) => {
      const { names } = await request.json();

      return HttpResponse.json(
        repositories.filter(({ name }) => names.includes(name ?? "")),
      );
    },
  ),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ params }) => {
    const { repository } = params;

    return HttpResponse.json(
      repositories.find(({ localId }) => localId === repository),
    );
  }),

  http.patch(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ params }) => {
    const { repository } = params;

    return HttpResponse.json(
      repositories.find(({ localId }) => localId === repository),
    );
  }),

  http.delete(`${API_URL_DEB_ARCHIVE}locals/:repository`, () => {
    return HttpResponse.json(repositories[0]);
  }),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository/packages`, () => {
    return HttpResponse.json({
      localPackages: paginatedPackages,
    });
  }),

  http.post<never, LocalServiceImportLocalPackagesBody>(
    `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
    async ({ request }) => {
      const { url } = await request.json();
      let id = "oooo-vvvv-cccc";

      if (url === "failed") {
        id = "ffff-llll-dddd";
      }

      if (url === "timeout") {
        id = "tttt-mmmm-oooo";
      }

      if (url === "idle") {
        id = "iiii-dddd-llll";
      }

      if (url === "in/progress") {
        id = "pppp-gggg-ssss";
      }

      if (url === "empty") {
        id = "mmmm-pppp-tttt";
      }

      if (url === "succeeded") {
        id = "ssss-cccc-dddd";
      }

      return HttpResponse.json({ ...idleOperation, name: `operations/${id}` });
    },
  ),

  http.delete(`${API_URL_DEB_ARCHIVE}locals/:repository/packages`, () => {
    return HttpResponse.json(paginatedPackages[0]);
  }),
];
