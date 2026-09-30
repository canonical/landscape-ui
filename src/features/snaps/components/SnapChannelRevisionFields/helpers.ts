import type { SelectOption } from "@/types/SelectOption";
import type { AvailableSnapInfo } from "../../types";

export interface ChannelOption extends SelectOption {
  confinement: string;
}

export const MODE_OPTIONS: SelectOption[] = [
  { label: "Channel", value: "channel" },
  { label: "Revision", value: "revision" },
];

const RISK_ORDER = ["stable", "candidate", "beta", "edge"];

export const getChannelOptions = (
  channelMap?: AvailableSnapInfo["channel-map"],
): ChannelOption[] => {
  if (!channelMap) {
    return [];
  }

  const channelsByName = new Map<
    string,
    AvailableSnapInfo["channel-map"][number]
  >();

  for (const entry of channelMap) {
    const existing = channelsByName.get(entry.channel.name);
    // Target instance architectures are unknown, so a channel that is classic on any architecture must request classic.
    if (!existing || entry.confinement === "classic") {
      channelsByName.set(entry.channel.name, entry);
    }
  }

  return [...channelsByName.values()]
    .sort((a, b) => {
      const riskIndexA = RISK_ORDER.indexOf(a.channel.risk);
      const riskIndexB = RISK_ORDER.indexOf(b.channel.risk);

      if (riskIndexA === -1 || riskIndexB === -1) {
        return a.channel.name.localeCompare(b.channel.name);
      }

      return riskIndexA - riskIndexB;
    })
    .map(({ channel, confinement }) => ({
      label: channel.name,
      value: channel.name,
      confinement,
    }));
};
