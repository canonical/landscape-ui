import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { GetGPGKeysParams } from "@/hooks/useGPGKeys";
import { GPGKey } from "@/types/GPGKey";
import { gpgKeys } from "@/tests/mocks/gpgKey";

export default [
  // @ts-ignore-next-line
  http.get<GetGPGKeysParams, never, GPGKey[]>(
    `${API_URL_OLD}GetGPGKeys`,
    () => {
      return HttpResponse.json(gpgKeys);
    },
  ),
];
