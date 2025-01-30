import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { preferences } from "@/tests/mocks/organisationPreferences";
import type { Preferences } from "@/types/Preferences";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, never, Preferences>(`${API_URL}preferences`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus === "error") {
      throw new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(preferences);
  }),
];
