export interface Permission extends Record<string, unknown> {
  global: boolean;
  name: string;
  title: string;
}
