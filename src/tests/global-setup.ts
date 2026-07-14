import fs from "fs";
import { REGISTRY_PATH } from "./contract-coverage/paths";

export default function setup() {
  if (fs.existsSync(REGISTRY_PATH)) {
    fs.unlinkSync(REGISTRY_PATH);
  }
}
