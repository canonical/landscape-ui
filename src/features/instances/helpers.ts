import { InstanceWithoutRelation } from "@/types/Instance";

export function canRunScripts(instance: InstanceWithoutRelation): boolean {
  return (
    !!instance.distribution && /\d{1,2}\.\d{2}/.test(instance.distribution)
  );
}
