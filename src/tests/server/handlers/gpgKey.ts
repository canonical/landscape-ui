import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import type { GetGPGKeysParams, GPGKey } from "@/features/gpg-keys";
import { gpgKeys } from "@/tests/mocks/gpgKey";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, GetGPGKeysParams, GPGKey[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetGPGKeys")) {
      return;
    }

    return HttpResponse.json(gpgKeys);
  }),
];
