import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { GetAPTSourcesParams, APTSource } from "@/features/apt-sources";
import { aptSources } from "@/tests/mocks/apt-sources";

export default [
  http.get<never, GetAPTSourcesParams, APTSource[]>(
    `${API_URL_OLD}GetAPTSources`,
    () => {
      return HttpResponse.json(aptSources);
    },
  ),
];
