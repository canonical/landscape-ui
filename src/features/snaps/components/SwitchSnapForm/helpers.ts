import type { AvailableSnapInfo } from "../../types";

interface ChannelOption {
  label: string;
  value: string;
}

export const getChannelOptions = (
  snapInfo: AvailableSnapInfo | null,
): ChannelOption[] => {
  if (!snapInfo) return [];
  return snapInfo["channel-map"]
    .sort((a, b) =>
      a.channel.architecture.localeCompare(b.channel.architecture),
    )
    .map((channel) => ({
      label: `${channel.channel.name} - ${channel.channel.architecture}`,
      value: `${channel.channel.name} - ${channel.channel.architecture}`,
    }));
};

export const getChannelName = (
  snapInfo: AvailableSnapInfo | null,
  releaseValue: string,
): string | undefined => {
  return snapInfo?.["channel-map"].find(
    (channel) =>
      `${channel.channel.name} - ${channel.channel.architecture}` ===
      releaseValue,
  )?.channel.name;
};

export const getChannelRevision = (
  snapInfo: AvailableSnapInfo | null,
  releaseValue: string,
): string | undefined => {
  return snapInfo?.["channel-map"]
    .find(
      (channel) =>
        `${channel.channel.name} - ${channel.channel.architecture}` ===
        releaseValue,
    )
    ?.revision.toString();
};
