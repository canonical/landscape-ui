import { IS_DEV_ENV } from "@/constants";
import type { InstanceWithoutRelation } from "@/types/Instance";

export function currentInstanceCan(
  capability: "runScripts",
  instance: InstanceWithoutRelation,
): boolean {
  if (capability === "runScripts") {
    return currentInstanceIs("ubuntu", instance);
  }

  if (IS_DEV_ENV) {
    console.error(`Error: The capability "${capability}" does not exist.`);
  }

  return false;
}

export function currentInstanceIs(
  distribution: "ubuntu",
  instance: InstanceWithoutRelation,
): boolean {
  if (!instance.distribution_info) {
    return false;
  }

  if (distribution === "ubuntu") {
    return instance.distribution_info.description.includes("Ubuntu");
  }

  if (IS_DEV_ENV) {
    console.error(`Error: The distribution "${distribution}" does not exist.`);
  }

  return false;
}
