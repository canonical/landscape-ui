import type { SelectOption } from "@/types/SelectOption";

export const getAccountOptions = (options: SelectOption[], current: string) => {
  return current ? options : [{ label: "", value: "" }, ...options];
};
