import type { SelectOption } from "@/types/SelectOption";
import type { AvailableSnapInfo } from "./types";

type ChannelMapEntry = AvailableSnapInfo["channel-map"][number];

const RISK_ORDER = ["stable", "candidate", "beta", "edge"];

interface GetChannelOptionsConfig {
  readonly separator?: string;
  readonly sortBy?: "architecture" | "risk";
}

const sortByArchitecture = (a: ChannelMapEntry, b: ChannelMapEntry): number =>
  a.channel.architecture.localeCompare(b.channel.architecture);

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

const getChannelValue = (
  channel: ChannelMapEntry["channel"],
  separator: string,
): string => `${channel.name}${separator}${channel.architecture}`;

// Composite option values pack name + architecture; use getChannelMapEntry
// (or getChannelName/getChannelConfinement) to resolve back to the real
// channel-map entry for API requests.
export const getChannelOptions = (
  channelMap: ChannelMapEntry[] | undefined,
  { separator = " ", sortBy = "risk" }: GetChannelOptionsConfig = {},
): SelectOption[] => {
  if (!channelMap) {
    return [];
  }

  return [...channelMap]
    .sort(sortBy === "architecture" ? sortByArchitecture : sortByRisk)
    .map(({ channel }) => ({
      label: getChannelValue(channel, separator),
      value: getChannelValue(channel, separator),
    }));
};

export const getChannelMapEntry = (
  channelMap: ChannelMapEntry[] | undefined,
  value: string,
  separator = " ",
): ChannelMapEntry | undefined =>
  channelMap?.find(
    ({ channel }) => getChannelValue(channel, separator) === value,
  );

export const getChannelName = (
  channelMap: ChannelMapEntry[] | undefined,
  value: string,
  separator = " ",
): string | undefined =>
  getChannelMapEntry(channelMap, value, separator)?.channel.name;

export const getChannelConfinement = (
  channelMap: ChannelMapEntry[] | undefined,
  value: string,
  separator = " ",
): string | undefined =>
  getChannelMapEntry(channelMap, value, separator)?.confinement;

// Snap revisions are numeric identifiers (ChannelMap.revision is a number),
// so a manually entered revision must be a positive whole number.
export const isValidRevision = (value: string): boolean =>
  /^[1-9]\d*$/.test(value.trim());
