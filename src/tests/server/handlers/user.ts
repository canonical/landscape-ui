import { delay, http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { generatePaginatedResponse } from "./_helpers";
import type { User } from "@/types/User";
import { userDetails, users } from "@/tests/mocks/user";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { MAX_USERS_LIMIT } from "@/pages/dashboard/instances/[single]/tabs/users/UserPanel/constants";
import type { UserCredentials } from "@/features/api-credentials";
import { createEndpointStatusError } from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";

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
    const offset = 0;
    const endpointStatus = getEndpointStatus();

    return HttpResponse.json(
      generatePaginatedResponse<User>({
        data:
          !shouldApplyEndpointStatus("users") ||
          endpointStatus.status === "default"
            ? users
            : [],
        limit: MAX_USERS_LIMIT,
        offset,
      }),
    );
  }),

  http.post(`${API_URL}users`, async () => {
    if (shouldApplyEndpointStatus("users")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(userDetails);
  }),

  http.put(`${API_URL}users`, async () => {
    if (shouldApplyEndpointStatus("users")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(userDetails);
  }),

  http.delete(`${API_URL}users`, async () => {
    if (shouldApplyEndpointStatus("users")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(userDetails);
  }),

  http.post(`${API_URL}users/lock`, async () => {
    if (shouldApplyEndpointStatus("lockUser")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(userDetails);
  }),

  http.post(`${API_URL}users/unlock`, async () => {
    if (shouldApplyEndpointStatus("unlockUser")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(userDetails);
  }),

  http.get(`${API_URL}person`, async () => {
    await delay();

    return HttpResponse.json(userDetails);
  }),

  http.post(`${API_URL}person`, async () => {
    if (shouldApplyEndpointStatus("person")) {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(userDetails);
  }),

  http.get(`${API_URL}credentials`, async () => {
    await delay();

    return HttpResponse.json(userCredentials);
  }),
];
