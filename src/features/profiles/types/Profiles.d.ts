export type ProfileType =
  | "package"
  | "reboot"
  | "removal"
  | "repository"
  | "script"
  | "security"
  | "upgrade"
  | "wsl";

export interface Profile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  description?: string;
  id: number;
  name?: string;
  tags: string[];
  title: string;
}
