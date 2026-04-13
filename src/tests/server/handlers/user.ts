import { delay, http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { generatePaginatedResponse } from "./_helpers";
import type { User } from "@/types/User";
import { userDetails, users } from "@/tests/mocks/user";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { MAX_USERS_LIMIT } from "@/pages/dashboard/instances/[single]/tabs/users/UserPanel/constants";
import type { UserCredentials } from "@/features/api-credentials";
import { getEndpointStatusApiError } from "./_constants";

const [defaultAccount] = userDetails.accounts;

if (!defaultAccount) {
  throw new Error("Expected at least one account in mock userDetails data");
}

const userCredentials: UserCredentials = {
  credentials: [
    {
      account_name: defaultAccount.name,
      account_title: defaultAccount.title,
      endpoint: "https://api.example.com/test-account",
      access_key: "",
      secret_key: "",
      exports: "",
    },
  ],
};

export default [
  http.get(`${API_URL}users`, () => {
    const endpointStatus = getEndpointStatus();
    const offset = 0;

    return HttpResponse.json(
      generatePaginatedResponse<User>({
        data: endpointStatus.status === "default" ? users : [],
        limit: MAX_USERS_LIMIT,
        offset,
      }),
    );
  }),

  http.post(`${API_URL}users`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "users")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(userDetails);
  }),

  http.put(`${API_URL}users`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "users")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(userDetails);
  }),

  http.delete(`${API_URL}users`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "users")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(userDetails);
  }),

  http.post(`${API_URL}users/lock`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "lockUser")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(userDetails);
  }),

  http.post(`${API_URL}users/unlock`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "unlockUser")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(userDetails);
  }),

  http.get(`${API_URL}person`, async () => {
    await delay();

    return HttpResponse.json(userDetails);
  }),

  http.get(`${API_URL}credentials`, async () => {
    await delay();

    return HttpResponse.json(userCredentials);
  }),
];
