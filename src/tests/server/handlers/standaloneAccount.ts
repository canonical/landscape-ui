import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { shouldApplyEndpointStatus } from "./_helpers";

interface CreateStandaloneAccountParams {
  email: string;
  name: string;
  password: string;
}

export const standaloneAccountState = {
  exists: true,
};

const getStandaloneAccountExists = () => {
  if (shouldApplyEndpointStatus("standalone-account")) {
    const endpointStatus = getEndpointStatus("standalone-account");

    if (
      endpointStatus.status === "variant" &&
      typeof endpointStatus.response === "object" &&
      endpointStatus.response !== null &&
      "exists" in endpointStatus.response &&
      typeof endpointStatus.response.exists === "boolean"
    ) {
      return endpointStatus.response.exists;
    }
  }

  return standaloneAccountState.exists;
};

export default [
  http.get(`${API_URL}standalone-account`, () => {
    return HttpResponse.json({ exists: getStandaloneAccountExists() });
  }),

  http.post<never, CreateStandaloneAccountParams>(
    `${API_URL}standalone-account`,
    async ({ request }) => {
      const { email, name } = await request.json();

      if (getStandaloneAccountExists()) {
        return HttpResponse.json(
          {
            error: "BadRequest",
            message: "Standalone account already exists",
          },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        {
          account: "standalone",
          creation_time: new Date().toISOString(),
          administrators: [
            {
              name,
              email,
              openid: null,
            },
          ],
          disabled: false,
          disabled_reason: null,
          computers: 0,
          company: "Organization",
          last_login_time: new Date().toISOString(),
          licenses: [],
          salesforce_account_key: null,
          enabled_features: [],
          subdomain: null,
        },
        { status: 201 },
      );
    },
  ),
];
