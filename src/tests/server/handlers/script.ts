import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { isAction } from "@/tests/server/handlers/_helpers";
import { GetScriptCodeParams } from "@/features/scripts";
import { scriptCodes } from "@/tests/mocks/script";
import { getTestErrorParams } from "@/tests/mocks/error";

export default [
  http.get<never, GetScriptCodeParams, string>(
    API_URL_OLD,
    async ({ request }) => {
      if (!isAction(request, "GetScriptCode")) {
        return;
      }

      const { script_id } = await request.json();

      const script = scriptCodes.find(
        (scriptCode) => scriptCode.script_id === script_id,
      );

      if (!script) {
        const { testError } = getTestErrorParams();

        throw testError;
      }

      return HttpResponse.json(script.code);
    },
  ),
];
