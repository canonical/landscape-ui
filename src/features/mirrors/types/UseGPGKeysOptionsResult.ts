import type { SelectOption } from "@/types/SelectOption";

export interface UseGPGKeysOptionsResult {
  privateGPGKeysOptions: SelectOption[];
  publicGPGKeysOptions: SelectOption[];
}
