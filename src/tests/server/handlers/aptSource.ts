import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import type { APTSource, GetAPTSourcesParams } from "@/features/apt-sources";
import { aptSources } from "@/tests/mocks/apt-sources";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, GetAPTSourcesParams, APTSource[]>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "GetAPTSources")) {
        return;
      }

      return HttpResponse.json(aptSources);
    },
  ),
];
