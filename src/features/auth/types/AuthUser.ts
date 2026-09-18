export interface Account {
  name: string;
  title: string;
  subdomain: string | null;
  classic_dashboard_url: string;
  default?: boolean;
}

export interface AuthUser {
  accounts: Account[];
  current_account: string;
  email: string;
  /** Staff (super admin) roles, e.g. `SupportProvider`; empty for regular users. */
  global_roles: string[];
  has_password: boolean;
  name: string;
  token: string;
}
