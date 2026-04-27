export type ProfileType =
  | "package"
  | "reboot"
  | "removal"
  | "repository"
  | "security"
  | "script"
  | "upgrade"
  | "wsl";

export interface Profile extends Record<string, unknown> {
  id: number;
  name: string | null;
  title: string;
  type: ProfileType;
}
