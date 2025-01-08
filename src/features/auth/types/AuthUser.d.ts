export interface Account {
  classic_dashboard_url: string;
  name: string;
  subdomain: string | null;
  title: string;
  default?: boolean;
}

export interface AuthUser {
  accounts: Account[];
  current_account: string;
  email: string;
  has_password: boolean;
  name: string;
  token: string;
}
