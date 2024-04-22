import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { GetRepoInfoParams, RepoInfo } from "@/hooks/useSeries";
import { repoInfo } from "@/tests/mocks/repo";

export default [
  // @ts-ignore-next-line
  http.get<GetRepoInfoParams, never, RepoInfo>(
    `${API_URL_OLD}GetRepoInfo`,
    () => {
      return HttpResponse.json(repoInfo);
    },
  ),
];
