import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { GetRepoInfoParams, RepoInfo } from "@/features/mirrors";
import { repoInfo } from "@/tests/mocks/repo";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, GetRepoInfoParams, RepoInfo>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetRepoInfo")) {
      return;
    }

    return HttpResponse.json(repoInfo);
  }),
];
