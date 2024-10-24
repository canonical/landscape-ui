export interface Account {
  classic_dashboard_url: string;
  name: string;
  subdomain: string | null;
  title: string;
  default?: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  token: string;
  accounts: Account[];
  current_account: string;
}
