import { delay, http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { generatePaginatedResponse } from "./_helpers";
import { User } from "@/types/User";
import { userDetails, users } from "@/tests/mocks/user";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { MAX_USERS_LIMIT } from "@/pages/dashboard/instances/[single]/tabs/users/UserPanel/constants";

export default [
  http.get(`${API_URL}users`, () => {
    const endpointStatus = getEndpointStatus();
    const offset = 0;

    return HttpResponse.json(
      generatePaginatedResponse<User>({
        data: endpointStatus === "default" ? users : [],
        limit: MAX_USERS_LIMIT,
        offset,
      }),
    );
  }),

  http.get(`${API_URL}person`, async () => {
    await delay();

    return HttpResponse.json(userDetails);
  }),
];
