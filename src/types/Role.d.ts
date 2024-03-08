export interface Role extends Record<string, unknown> {
  access_groups: string[];
  description: string;
  name: string;
  permissions: string[];
  persons: string[];
  global_permissions?: string[];
}
