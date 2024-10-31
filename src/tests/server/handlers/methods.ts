import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { LoginMethods } from "@/features/auth";
import { allLoginMethods } from "@/tests/mocks/loginMethods";

export default [
  http.get<never, never, LoginMethods>(`${API_URL}login/methods`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus === "error") {
      throw new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(allLoginMethods);
  }),
];
