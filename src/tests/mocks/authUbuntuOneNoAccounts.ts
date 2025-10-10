import type { AuthStateResponse } from "@/features/auth";

export const authUbuntuOneNoAccountsResponse: AuthStateResponse = {
  accounts: [],
  current_account: "",
  email: "new-user@example.com",
  has_password: false,
  name: "New Ubuntu One User",
  token: "new-user-token",
  return_to: null,
  self_hosted: false,
  identity_source: "ubuntu-one",
  attach_code: null,
};
