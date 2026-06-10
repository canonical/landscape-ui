import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useParams } from "react-router";
import { useGetSnapInfo } from "../../../../api";
import type { InstalledSnap } from "../../../../types";
import { getSnapName } from "../../helpers";

const SwitchSnapForm = lazy(() => import("../../../SwitchSnapForm"));

interface SwitchChannelButtonProps {
  readonly snap: InstalledSnap;
  readonly selectedSnaps: InstalledSnap[];
}

const SwitchChannelButton: FC<SwitchChannelButtonProps> = ({
  snap,
  selectedSnaps,
}) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const { setSidePanelContent } = useSidePanel();
  const instanceId = Number(urlInstanceId);

  const { snapInfo } = useGetSnapInfo({
    instance_id: instanceId,
    name: snap.snap.name,
  });

  const hasNoAvailableChannels =
    !!snapInfo && snapInfo["channel-map"].length === 0;

  const tooltip = hasNoAvailableChannels
    ? "No available channels to switch to."
    : undefined;

  const handleClick = () => {
    if (!snapInfo) {
      return;
    }

    setSidePanelContent(
      `Switch ${getSnapName(selectedSnaps)}'s channel`,
      <Suspense fallback={<LoadingState />}>
        <SwitchSnapForm installedSnaps={selectedSnaps} snapInfo={snapInfo} />
      </Suspense>,
    );
  };

  const button = (
    <Button
      type="button"
      className="p-segmented-control__button has-icon u-no-margin--bottom"
      disabled={hasNoAvailableChannels}
      onClick={handleClick}
      hasIcon
    >
      <Icon name="fork" />
      <span>Switch channel</span>
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip message={tooltip} position="top-center">
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default SwitchChannelButton;
