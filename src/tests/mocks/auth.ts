import type { AuthStateResponse, AuthUser } from "@/features/auth";

const testAccount = "test-account";
const secondAccount = "second-account";

export const authUser: AuthUser = {
  accounts: [
    {
      classic_dashboard_url: "",
      default: true,
      name: testAccount,
      subdomain: null,
      title: "Test Account",
    },
    {
      classic_dashboard_url: "",
      default: false,
      name: secondAccount,
      subdomain: null,
      title: "Second Account",
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
  attach_code: null,
};
