import type { Feature } from "@/types/Feature";

export interface Account {
  name: string;
  title: string;
  subdomain: string | null;
  classic_dashboard_url: string;
  default?: boolean;
}

export interface AuthUser {
  accounts: Account[];
  features: Feature[];
  current_account: string;
  email: string;
  has_password: boolean;
  name: string;
  token: string;
}
