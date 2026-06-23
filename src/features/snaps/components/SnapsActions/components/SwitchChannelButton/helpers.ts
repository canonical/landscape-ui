export const getSwitchChannelTooltip = (
  isLoading: boolean,
  hasNoChannels: boolean,
): string | undefined => {
  if (isLoading) {
    return "Checking available channels...";
  }

  if (hasNoChannels) {
    return "No available channels to switch to.";
  }

  return undefined;
};
