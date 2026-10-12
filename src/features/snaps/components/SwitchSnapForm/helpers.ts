import type { SelectOption } from "@/types/SelectOption";
import { INITIAL_VALUES } from "./constants";
import type { SwitchFormValues } from "./types";

export const getInitialValues = (
  channelOptions: SelectOption[],
): SwitchFormValues => {
  return { ...INITIAL_VALUES, release: channelOptions[0]?.value ?? "" };
};
