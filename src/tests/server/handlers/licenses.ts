import { API_URL } from "@/constants";
import { licenses } from "@/tests/mocks/licenses";
import { delay, http, HttpResponse } from "msw";
import { shouldApplyEndpointStatus } from "./_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get(`${API_URL}legacy-licenses`, async ({ request }) => {
    if (shouldApplyEndpointStatus("legacy-licenses")) {
      const { status, response } = getEndpointStatus("legacy-licenses");

      if (status === "error") {
        throw createEndpointStatusError();
      }

      if (status === "loading") {
        await delay("infinite");
      }

      if (status === "empty") {
        return HttpResponse.json({ results: [] });
      }

      if (status === "variant") {
        return HttpResponse.json({ results: response });
      }
    }

    const { searchParams } = new URL(request.url);

    if (searchParams.get("include_details") === "true") {
      return HttpResponse.json({ results: licenses });
    }

    const results = licenses.map(
      ({ id, available_seats, expiration_date }) => ({
        id,
        available_seats,
        expiration_date,
      }),
    );

    return HttpResponse.json({ results });
  }),
];
