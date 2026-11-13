import LoadingState from "@/components/layout/LoadingState";
import { Tooltip } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useParams } from "react-router";
import { useGetSnapInfo } from "../../../../api";
import type { InstalledSnap } from "../../../../types";

const SwitchSnapForm = lazy(() => import("../../../SwitchSnapForm"));

interface SwitchChannelButtonProps {
  readonly snap: InstalledSnap;
}

const SwitchChannelButton: FC<SwitchChannelButtonProps> = ({ snap }) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { setSidePanelContent } = useSidePanel();
  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { snapInfo, isSnapInfoLoading } = useGetSnapInfo(
    {
      instance_id: instanceId,
      name: snap.snap.name,
    },
    { enabled: Number.isFinite(instanceId) },
  );

  const isDisabled = isSnapInfoLoading || !snapInfo;

  const tooltip = isSnapInfoLoading
    ? "Checking available channels..."
    : undefined;

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    setSidePanelContent(
      `Switch ${snap.snap.name}'s channel`,
      <Suspense fallback={<LoadingState />}>
        <SwitchSnapForm snap={snap} snapInfo={snapInfo} />
      </Suspense>,
    );
  };

  const button = (
    <Button
      type="button"
      className="p-segmented-control__button has-icon u-no-margin--bottom"
      disabled={isDisabled}
      onClick={handleClick}
      hasIcon
    >
      <Icon name="fork" />
      <span>Switch channel</span>
    </Button>
  );

  if (tooltip) {
    return <Tooltip message={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export default SwitchChannelButton;
