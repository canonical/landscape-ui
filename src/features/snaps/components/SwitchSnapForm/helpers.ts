import type { SelectOption } from "@/types/SelectOption";
import type { AvailableSnapInfo } from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { SwitchFormValues } from "./types";

export const getChannelOptions = (
  snapInfo: AvailableSnapInfo | null,
): SelectOption[] => {
  if (!snapInfo) return [];
  return [...snapInfo["channel-map"]]
    .sort((a, b) =>
      a.channel.architecture.localeCompare(b.channel.architecture),
    )
    .map((channel) => ({
      label: `${channel.channel.name} - ${channel.channel.architecture}`,
      value: `${channel.channel.name} - ${channel.channel.architecture}`,
    }));
};

export const getInitialValues = (
  channelOptions: SelectOption[],
): SwitchFormValues => {
  return { ...INITIAL_VALUES, release: channelOptions[0]?.value ?? "" };
};

export const getSelectedChannel = (
  snapInfo: AvailableSnapInfo | null,
  releaseValue: string,
): AvailableSnapInfo["channel-map"][number] | undefined => {
  return snapInfo?.["channel-map"].find(
    (channel) =>
      `${channel.channel.name} - ${channel.channel.architecture}` ===
      releaseValue,
  );
};
