import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { GetRepoInfoParams, RepoInfo } from "@/features/mirrors";
import { repoInfo } from "@/tests/mocks/repo";

export default [
  http.get<never, GetRepoInfoParams, RepoInfo>(
    `${API_URL_OLD}GetRepoInfo`,
    () => {
      return HttpResponse.json(repoInfo);
    },
  ),
];
