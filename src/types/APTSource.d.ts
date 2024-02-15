import { AccessGroup } from "./AccessGroup";
import { GPGKey } from "./GPGKey";

export interface APTSource extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  gpg_key: GPGKey["name"] | null;
  id: number;
  line: string;
  name: string;
}
