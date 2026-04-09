import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import type {
  GetGPGKeysParams,
  ImportGPGKeyParams,
  GPGKey,
} from "@/features/gpg-keys";
import { gpgKeys } from "@/tests/mocks/gpgKey";
import { isAction } from "@/tests/server/handlers/_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  http.post<ImportGPGKeyParams, never, GPGKey>(
    `${API_URL}gpg-key`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      const { name } = await request.json();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json<GPGKey>({ ...gpgKeys[0], name });
    },
  ),

  http.get<never, GetGPGKeysParams, GPGKey[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetGPGKeys")) {
      return;
    }

    return HttpResponse.json(gpgKeys);
  }),
];
