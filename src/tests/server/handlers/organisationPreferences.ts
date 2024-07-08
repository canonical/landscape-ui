import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { preferences } from "@/tests/mocks/organisationPreferences";
import { Preferences } from "@/types/Preferences";
import { http, HttpResponse } from "msw";

export default [
  // @ts-ignore-next-line
  http.get<undefined, never, Preferences>(`${API_URL}preferences`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus === "error") {
      return HttpResponse.json(
        {
          error: "InternalServerError",
          message: "Error response",
        },
        {
          status: 500,
        },
      );
    }

    return HttpResponse.json(preferences);
  }),
];
