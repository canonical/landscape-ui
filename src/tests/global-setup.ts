import fs from "fs";
import path from "path";

export const REGISTRY_PATH = path.resolve(__dirname, "msw-api-registry.jsonl");

export default function setup() {
  if (fs.existsSync(REGISTRY_PATH)) {
    fs.unlinkSync(REGISTRY_PATH);
  }
}
