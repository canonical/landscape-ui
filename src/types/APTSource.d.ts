import { AccessGroup } from "./AccessGroup";
import { GPGKey } from "./GPGKey";

export interface APTSource extends Record<string, unknown> {
  line: string;
  gpg_key: GPGKey["name"] | null;
  id: number;
  name: string;
  access_group: AccessGroup["name"];
}
