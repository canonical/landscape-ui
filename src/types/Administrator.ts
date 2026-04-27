export interface Administrator extends Record<string, unknown> {
  email: string;
  id: number;
  name: string;
  roles: string[];
}
