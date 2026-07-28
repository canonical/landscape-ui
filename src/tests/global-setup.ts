import fs from "fs";
import { MANIFEST_PATH, REGISTRY_PATH } from "./contract-coverage/paths";

export default function setup() {
  for (const file of [REGISTRY_PATH, MANIFEST_PATH]) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}
