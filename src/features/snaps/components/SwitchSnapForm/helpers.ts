import type { SelectOption } from "@/types/SelectOption";
import {
  getChannelMapEntry,
  getChannelOptions as getSharedChannelOptions,
} from "../../helpers";
import type { AvailableSnapInfo } from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { SwitchFormValues } from "./types";

export const getChannelOptions = (
  snapInfo: AvailableSnapInfo | null,
): SelectOption[] => getSharedChannelOptions(snapInfo?.["channel-map"]);

export const getInitialValues = (
  channelOptions: SelectOption[],
): SwitchFormValues => {
  return { ...INITIAL_VALUES, release: channelOptions[0]?.value ?? "" };
};

export const getSelectedChannel = (
  snapInfo: AvailableSnapInfo | null,
  releaseValue: string,
): AvailableSnapInfo["channel-map"][number] | undefined =>
  getChannelMapEntry(snapInfo?.["channel-map"], releaseValue);
