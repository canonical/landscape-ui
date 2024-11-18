import { delay, http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { generatePaginatedResponse } from "./_helpers";
import { User } from "@/types/User";
import { userDetails, users } from "@/tests/mocks/user";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  http.get(`${API_URL}users`, () => {
    const endpointStatus = getEndpointStatus();
    const offset = 0;
    const limit = 1000;

    return HttpResponse.json(
      generatePaginatedResponse<User>({
        data: endpointStatus === "default" ? users : [],
        limit,
        offset,
      }),
    );
  }),

  http.get(`${API_URL}person`, async () => {
    await delay();

    return HttpResponse.json(userDetails);
  }),
];
