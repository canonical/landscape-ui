import { delay, http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  repoPackages,
  repositories,
  succeededTask,
  failedTask,
  inProgressTask,
  emptyTask,
} from "@/tests/mocks/localRepositories";
import type {
  LocalServiceImportLocalPackagesBody,
  BatchGetLocalsRequest,
  LocalWritable,
} from "@canonical/landscape-openapi";

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
      localPackages: repoPackages,
    });
  }),

  http.post<never, LocalServiceImportLocalPackagesBody>(
    `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
    async ({ request }) => {
      const { url } = await request.json();

      delay(1000);

      if (url === "failed") {
        return HttpResponse.json(failedTask);
      }

      if (url === "in/progress") {
        return HttpResponse.json(inProgressTask);
      }

      if (url === "empty") {
        return HttpResponse.json(emptyTask);
      }

      return HttpResponse.json(succeededTask);
    },
  ),

  http.delete(`${API_URL_DEB_ARCHIVE}locals/:repository/packages`, () => {
    return HttpResponse.json(repoPackages[0]);
  }),
];
