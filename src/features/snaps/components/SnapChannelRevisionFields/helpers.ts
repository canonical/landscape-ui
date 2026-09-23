import type { SelectOption } from "@/types/SelectOption";

export const MODE_OPTIONS: SelectOption[] = [
  { label: "Channel", value: "channel" },
  { label: "Revision", value: "revision" },
];

const RISK_ORDER = ["stable", "candidate", "beta", "edge"];

const formatChannelLabel = (track: string, risk: string) =>
  track === "latest" ? risk : `${track}/${risk}`;

export const getChannelOptions = (
  channelMap?: { channel: { track: string; risk: string; name: string } }[],
): SelectOption[] => {
  if (!channelMap) {
    return [];
  }

  const channelsByLabel = new Map<string, string>();

  for (const { channel } of channelMap) {
    const label = formatChannelLabel(channel.track, channel.risk);
    channelsByLabel.set(label, channel.name);
  }

  return [...channelsByLabel.entries()]
    .sort(([a], [b]) => {
      const riskIndexA = RISK_ORDER.indexOf(a);
      const riskIndexB = RISK_ORDER.indexOf(b);

      if (riskIndexA === -1 || riskIndexB === -1) {
        return a.localeCompare(b);
      }

      return riskIndexA - riskIndexB;
    })
    .map(([label, value]) => ({ label, value }));
};
