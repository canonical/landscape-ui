import { Computer } from "../../../types/Computer";

const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === "object" && null !== obj;
};

export const isComputer = (obj: unknown): obj is Computer => {
  return (
    isObject(obj) &&
    "id" in obj &&
    "number" === typeof obj.id &&
    "hostname" in obj &&
    "string" === typeof obj.hostname &&
    "reboot_required_flag" in obj &&
    "boolean" === typeof obj.reboot_required_flag
  );
};
