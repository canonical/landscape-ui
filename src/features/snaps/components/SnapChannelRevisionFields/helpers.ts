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

    .sort(([a], [b]) => {
      const riskA = a.slice(a.lastIndexOf("/") + 1);
      const riskB = b.slice(b.lastIndexOf("/") + 1);
      const riskIndexA = RISK_ORDER.indexOf(riskA);
      const riskIndexB = RISK_ORDER.indexOf(riskB);

      if (riskIndexA === -1 && riskIndexB === -1) {
        return a.localeCompare(b);
      }
      if (riskIndexA === -1) return 1;
      if (riskIndexB === -1) return -1;

      return riskIndexA - riskIndexB;
    })
    .map(([label, value]) => ({ label, value }));
};
