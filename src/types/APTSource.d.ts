import { AccessGroup } from "./accessGroup";
import { GPGKey } from "./GPGKey";

export interface APTSource {
  line: string;
  gpg_key: GPGKey["name"] | null;
  id: number;
  name: string;
  access_group: AccessGroup["name"];
}
