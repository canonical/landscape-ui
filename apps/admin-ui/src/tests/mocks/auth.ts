import type { AuthStateResponse, AuthUser } from "@/features/auth";
import { features } from "@/tests/mocks/features";

const testAccount = "test-account";

export const authUser: AuthUser = {
  features: [],
  accounts: [
    {
      classic_dashboard_url: "",
      default: true,
      name: testAccount,
      subdomain: null,
      title: "Test Account",
    },
  ],
  current_account: testAccount,
  email: "example@mail.com",
  has_password: true,
  name: "Test User",
  token: "test-account-token",
};

export const authResponse: AuthStateResponse = {
  ...authUser,
  return_to: null,
};
