import { IS_DEV_ENV } from "@/constants";
import type { InstanceWithoutRelation } from "@/types/Instance";

export function currentInstanceCan(
  capability: "runScripts",
  instance: InstanceWithoutRelation,
) {
  if (capability === "runScripts") {
    return (
      !!instance.distribution && /\d{1,2}\.\d{2}/.test(instance.distribution)
    );
  }

  if (IS_DEV_ENV) {
    console.error(`Error: The capability "${capability}" does not exist.`);
  }

  return false;
}
