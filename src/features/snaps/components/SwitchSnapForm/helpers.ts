import type { AvailableSnapInfo } from "../../types";
import { getChannelConfinement, getChannelOptions } from "../../helpers";
import { INITIAL_VALUES } from "./constants";
import type { SwitchFormValues } from "./types";

export const getInitialValues = (
  channelMap: AvailableSnapInfo["channel-map"] | undefined,
): SwitchFormValues => {
  const [firstChannel] = getChannelOptions(channelMap);

  if (!firstChannel) {
    return { ...INITIAL_VALUES, mode: "revision" };
  }

  return {
    ...INITIAL_VALUES,
    value: firstChannel.value,
    channel: firstChannel.value,
    confinement: getChannelConfinement(channelMap, firstChannel.value),
  };
};
