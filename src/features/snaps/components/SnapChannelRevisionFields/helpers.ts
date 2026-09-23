import type { SelectOption } from "@/types/SelectOption";

export const MODE_OPTIONS: SelectOption[] = [
  { label: "Channel", value: "channel" },
  { label: "Revision", value: "revision" },
];

const RISK_ORDER = ["stable", "candidate", "beta", "edge"];

export const getChannelOptions = (
  channelMap?: {
    channel: {
      track: string;
      risk: string;
      name: string;
      architecture: string;
    };
  }[],
): SelectOption[] => {
  if (!channelMap) {
    return [];
  }

  return [...channelMap]
    .sort((a, b) => {
      const riskIndexA = RISK_ORDER.indexOf(a.channel.risk);
      const riskIndexB = RISK_ORDER.indexOf(b.channel.risk);

      if (riskIndexA === -1 || riskIndexB === -1) {
        return a.channel.name.localeCompare(b.channel.name);
      }

      return riskIndexA - riskIndexB;
    })
    .map(({ channel }) => ({
      label: `${channel.name} ${channel.architecture}`,
      value: `${channel.name} ${channel.architecture}`,
    }));
};

// Composite option values pack name + architecture; resolve back to the real channel name for API requests.
export const getChannelName = (
  channelMap: { channel: { name: string; architecture: string } }[] | undefined,
  value: string,
): string | undefined =>
  channelMap?.find(
    ({ channel }) => `${channel.name} ${channel.architecture}` === value,
  )?.channel.name;
