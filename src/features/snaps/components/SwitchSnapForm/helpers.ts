import type { SelectOption } from "@/types/SelectOption";
import {
  getChannelMapEntry,
  getChannelOptions as getSharedChannelOptions,
} from "../../helpers";
import type { AvailableSnapInfo } from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { SwitchFormValues } from "./types";

// Kept distinct from SnapChannelRevisionFields' " " separator/risk sort so
// this component's existing dropdown labels, ordering, and tests are unaffected.
const SEPARATOR = " - ";

export const getChannelOptions = (
  snapInfo: AvailableSnapInfo | null,
): SelectOption[] =>
  getSharedChannelOptions(snapInfo?.["channel-map"], {
    separator: SEPARATOR,
    sortBy: "architecture",
  });

export const getInitialValues = (
  channelOptions: SelectOption[],
): SwitchFormValues => {
  return { ...INITIAL_VALUES, release: channelOptions[0]?.value ?? "" };
};

export const getSelectedChannel = (
  snapInfo: AvailableSnapInfo | null,
  releaseValue: string,
): AvailableSnapInfo["channel-map"][number] | undefined =>
  getChannelMapEntry(snapInfo?.["channel-map"], releaseValue, SEPARATOR);
