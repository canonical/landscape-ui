import type { SelectOption } from "@/types/SelectOption";
import { getChannelOptions as getSharedChannelOptions } from "../../helpers";
import type { AvailableSnapInfo } from "../../types";

export const MODE_OPTIONS: SelectOption[] = [
  { label: "Channel", value: "channel" },
  { label: "Revision", value: "revision" },
];

export const getChannelOptions = (
  channelMap?: AvailableSnapInfo["channel-map"],
): SelectOption[] => getSharedChannelOptions(channelMap);
