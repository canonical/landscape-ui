import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { GetGPGKeysParams, GPGKey } from "@/features/gpg-keys";
import { gpgKeys } from "@/tests/mocks/gpgKey";

export default [
  http.get<never, GetGPGKeysParams, GPGKey[]>(
    `${API_URL_OLD}GetGPGKeys`,
    () => {
      return HttpResponse.json(gpgKeys);
    },
  ),
];
