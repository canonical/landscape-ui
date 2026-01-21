import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

interface CreateStandaloneAccountParams {
  email: string;
  name: string;
  password: string;
}

let standaloneAccountExists = true;

export default [
  http.get(`${API_URL}standalone-account`, () => {
    if (standaloneAccountExists) {
      return HttpResponse.json({ exists: true });
    }
    /**
     * Existing standalone account flow
     */
    return HttpResponse.json({ exists: true });

    /**
     * First time standalone account creation flow
     */
    // return HttpResponse.json({ exists: false });
  }),

  http.post<never, CreateStandaloneAccountParams>(
    `${API_URL}standalone-account`,
    async ({ request }) => {
      const { email, name } = await request.json();

      if (standaloneAccountExists) {
        return HttpResponse.json(
          {
            error: "BadRequest",
            message: "Standalone account already exists",
          },
          { status: 400 },
        );
      }

      standaloneAccountExists = true;

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
