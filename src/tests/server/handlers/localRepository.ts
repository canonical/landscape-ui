import { http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import {
  repoPackages,
  repositories,
} from "@/tests/mocks/localRepositories";

export default [
  http.get(`${API_URL_DEB_ARCHIVE}locals`, () => {
    return HttpResponse.json({
      locals: repositories,
      next_page_token: "token",
    });
  }),

  http.get(`${API_URL_DEB_ARCHIVE}locals/:repository`, ({ request }) => {
    const url = new URL(request.url);
    const repository = url.pathname.split("/").pop();
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
      next_page_token: "token",
    });
  }),

  http.post(`${API_URL_DEB_ARCHIVE}locals/:repository/uploads`, () => {
    return HttpResponse.json(repoPackages[0]);
  }),

  http.delete(`${API_URL_DEB_ARCHIVE}locals/:repository/packages`, () => {
    return HttpResponse.json(repoPackages[0]);
  }),
];
