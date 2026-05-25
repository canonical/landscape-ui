import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { preferences } from "@/tests/mocks/organisationPreferences";
import type { Preferences } from "@/types/Preferences";
import { http, HttpResponse } from "msw";
import { shouldApplyEndpointStatus } from "./_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

export default [
  http.get<never, never, Preferences>(`${API_URL}preferences`, () => {
    if (shouldApplyEndpointStatus("preferences")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }
    }

    return HttpResponse.json(preferences);
  }),

  http.patch(`${API_URL}preferences`, () => {
    return HttpResponse.json();
  }),
];
