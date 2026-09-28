import type { SelectOption } from "@/types/SelectOption";
import {
  getChannelConfinement as getSharedChannelConfinement,
  getChannelName as getSharedChannelName,
  getChannelOptions as getSharedChannelOptions,
} from "../../helpers";
import type { AvailableSnapInfo } from "../../types";

export const MODE_OPTIONS: SelectOption[] = [
  { label: "Channel", value: "channel" },
  { label: "Revision", value: "revision" },
];

export const getChannelOptions = (
  channelMap?: AvailableSnapInfo["channel-map"],
): SelectOption[] => getSharedChannelOptions(channelMap, { sortBy: "risk" });

// Composite option values pack name + architecture; resolve back to the real channel-map entry for API requests.
export const getChannelName = (
  channelMap: AvailableSnapInfo["channel-map"] | undefined,
  value: string,
): string | undefined => getSharedChannelName(channelMap, value);

export const getChannelConfinement = (
  channelMap: AvailableSnapInfo["channel-map"] | undefined,
  value: string,
): string | undefined => getSharedChannelConfinement(channelMap, value);
