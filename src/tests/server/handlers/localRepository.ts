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
  ImportLocalPackagesRequest,
  BatchGetLocalsRequest,
  CreateLocalRequest,
} from "@/features/local-repositories";

export default [
  http.get(`${API_URL_DEB_ARCHIVE}locals`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("filter")?.split("=").pop() ?? "";

    if (!search) {
      return HttpResponse.json({ locals: repositories });
    }

    return HttpResponse.json({
      locals: repositories.filter(({ display_name }) =>
        display_name.includes(search),
      ),
    });
  }),

  http.post<never, CreateLocalRequest>(
    `${API_URL_DEB_ARCHIVE}locals`,
    async ({ request }) => {
      const { display_name: namePosted } = await request.json();

      return HttpResponse.json(
        repositories.find(({ display_name }) => namePosted === display_name),
      );
    },
  ),

  http.post<never, BatchGetLocalsRequest>(
    `${API_URL_DEB_ARCHIVE}locals\\:batchGet`,
    async ({ request }) => {
      const { names } = await request.json();

      return HttpResponse.json(
        repositories.filter(({ name }) => names.includes(name)),
      );
    },
  ),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ params }) => {
    const { repository } = params;

    return HttpResponse.json(
      repositories.find(({ local_id }) => local_id === repository),
    );
  }),

  http.patch(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ params }) => {
    const { repository } = params;

    return HttpResponse.json(
      repositories.find(({ local_id }) => local_id === repository),
    );
  }),

  http.delete(`${API_URL_DEB_ARCHIVE}locals/:repository`, () => {
    return HttpResponse.json(repositories[0]);
  }),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository/packages`, () => {
    return HttpResponse.json({
      local_packages: repoPackages,
    });
  }),

  http.post<never, ImportLocalPackagesRequest>(
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
