import { AccessGroup } from "@/features/access-groups";
import { GPGKey } from "@/features/gpg-keys";

export interface APTSource extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  gpg_key: GPGKey["name"] | null;
  id: number;
  line: string;
  name: string;
}
