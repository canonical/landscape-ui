import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

interface CreateStandaloneAccountParams {
  email: string;
  name: string;
  password: string;
}

export const standaloneAccountState = {
  exists: true,
};

export default [
  http.get(`${API_URL}standalone-account`, () => {
    return HttpResponse.json({ exists: standaloneAccountState.exists });
  }),

  http.post<never, CreateStandaloneAccountParams>(
    `${API_URL}standalone-account`,
    async ({ request }) => {
      const { email, name } = await request.json();

      if (standaloneAccountState.exists) {
        return HttpResponse.json(
          {
            error: "BadRequest",
            message: "Standalone account already exists",
          },
          { status: 400 },
        );
      }

      standaloneAccountState.exists = true;

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
