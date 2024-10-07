import { AuthStateResponse, AuthUser } from "@/features/auth";

export const authUser: AuthUser = {
  accounts: [
    {
      classic_dashboard_url: "",
      default: true,
      name: "test-account",
      subdomain: null,
      title: "Test Account",
    },
  ],
  current_account: "test-account",
  email: "example@mail.com",
  name: "Test User",
  token: "test-account-token",
};

export const authResponse: AuthStateResponse = {
  ...authUser,
  return_to: null,
};
