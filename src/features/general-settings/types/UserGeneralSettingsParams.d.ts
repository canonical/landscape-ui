export interface EditUserDetailsParams {
  email: string;
  name: string;
  timezone: string;
  preferred_account: string;
}

export interface ChangePasswordParams {
  password: string;
  new_password: string;
}
