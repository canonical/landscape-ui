import type { SelectOption } from "@/types/SelectOption";
import type { AvailableSnapInfo } from "./types";

type ChannelMapEntry = AvailableSnapInfo["channel-map"][number];

const RISK_ORDER = ["stable", "candidate", "beta", "edge"];

const sortByRisk = (a: ChannelMapEntry, b: ChannelMapEntry): number => {
  const riskIndexA = RISK_ORDER.indexOf(a.channel.risk);
  const riskIndexB = RISK_ORDER.indexOf(b.channel.risk);

  if (riskIndexA === -1 && riskIndexB === -1) {
    return a.channel.name.localeCompare(b.channel.name);
  }

  // Channels with an unrecognized risk always sort after known risk levels,
  // so the ordering stays deterministic regardless of input order.
  if (riskIndexA === -1) {
    return 1;
  }
  if (riskIndexB === -1) {
    return -1;
  }

  return riskIndexA - riskIndexB;
};

// Channel options use channel.name only; architecture is excluded because the
// snapd API request only sends channel/revision/classic, not architecture.
export const getChannelOptions = (
  channelMap: ChannelMapEntry[] | undefined,
): SelectOption[] => {
  if (!channelMap) {
    return [];
  }

  const uniqueByName = new Map<string, ChannelMapEntry>();

  for (const entry of channelMap) {
    const existing = uniqueByName.get(entry.channel.name);
    // Target instance architectures are unknown, so a channel that is classic
    // on any architecture must request classic.
    if (!existing || entry.confinement === "classic") {
      uniqueByName.set(entry.channel.name, entry);
    }
  }

  return [...uniqueByName.values()].sort(sortByRisk).map(({ channel }) => ({
    label: channel.name,
    value: channel.name,
  }));
};

export const getChannelMapEntry = (
  channelMap: ChannelMapEntry[] | undefined,
  name: string,
): ChannelMapEntry | undefined =>
  channelMap?.find(({ channel }) => channel.name === name);

// Returns the confinement for a channel name. If the channel is published for
// multiple architectures with differing confinements, classic takes precedence
// because the target instance architectures are unknown at selection time.
export const getChannelConfinement = (
  channelMap: ChannelMapEntry[] | undefined,
  name: string,
): string | undefined => {
  const entries = channelMap?.filter(({ channel }) => channel.name === name);
  const classicEntry = entries?.find(
    ({ confinement }) => confinement === "classic",
  );

  return classicEntry?.confinement ?? entries?.[0]?.confinement;
};

// Snap revisions are numeric identifiers (ChannelMap.revision is a number),
// so a manually entered revision must be a positive whole number.
export const isValidRevision = (value: string): boolean =>
  /^[1-9]\d*$/.test(value.trim());
