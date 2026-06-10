import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { lazy, Suspense } from "react";
import { getSelectedSnaps, getSnapName } from "./helpers";
import type { InstalledSnap } from "../../types";
import SwitchChannelButton from "./components/SwitchChannelButton";
import classes from "./SnapActions.module.scss";

const HoldSnapForm = lazy(() => import("../HoldSnapForm"));
const InstallSnaps = lazy(() => import("../InstallSnaps"));
const RefreshSnapForm = lazy(() => import("../RefreshSnapForm"));
const UnholdSnapForm = lazy(() => import("../UnholdSnapForm"));
const UninstallSnapForm = lazy(() => import("../UninstallSnapForm"));

interface SnapsActionProps {
  readonly selectedSnapIds: string[];
  readonly installedSnaps: InstalledSnap[];
  readonly sidePanel?: boolean;
}
const SnapsActions: FC<SnapsActionProps> = ({
  selectedSnapIds,
  installedSnaps,
  sidePanel = false,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const singleSnap = installedSnaps.length === 1 ? installedSnaps[0] : null;
  const selectedSnaps = getSelectedSnaps(installedSnaps, selectedSnapIds);
  const unheldSnaps = selectedSnaps.filter((s) => s.held_until === null);
  const heldSnaps = selectedSnaps.filter((s) => s.held_until !== null);

  const openPanel = (title: string, form: ReactNode) => {
    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>{form}</Suspense>,
    );
  };

  const handleInstall = () => {
    setSidePanelContent("Install snaps", <InstallSnaps />);
  };

  const handleUninstall = () => {
    openPanel(
      `Uninstall ${getSnapName(selectedSnaps)}`,
      <UninstallSnapForm installedSnaps={selectedSnaps} />,
    );
  };

  const handleHold = () => {
    openPanel(
      `Hold ${getSnapName(unheldSnaps)}`,
      <HoldSnapForm installedSnaps={selectedSnaps} />,
    );
  };

  const handleUnhold = () => {
    openPanel(
      `Unhold ${getSnapName(heldSnaps)}`,
      <UnholdSnapForm installedSnaps={selectedSnaps} />,
    );
  };

  const handleRefresh = () => {
    openPanel(
      `Refresh ${getSnapName(selectedSnaps)}`,
      <RefreshSnapForm installedSnaps={selectedSnaps} />,
    );
  };

  return (
    <div className={classes.container}>
      {!sidePanel && (
        <Button
          type="button"
          onClick={handleInstall}
          hasIcon
          className="u-no-margin--bottom"
        >
          <Icon name={ICONS.plus} />
          <span>Install</span>
        </Button>
      )}
      <ResponsiveButtons
        collapseFrom="lg"
        buttons={[
          singleSnap && sidePanel && (
            <SwitchChannelButton
              key="switch-channel"
              snap={singleSnap}
              selectedSnaps={selectedSnaps}
            />
          ),
          <Button
            type="button"
            key="uninstall"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={0 === selectedSnapIds.length}
            onClick={handleUninstall}
            hasIcon
          >
            <Icon name={ICONS.delete} />
            <span>Uninstall</span>
          </Button>,
          (singleSnap?.held_until === null || !sidePanel) && (
            <Button
              key="hold"
              type="button"
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              disabled={0 === unheldSnaps.length}
              onClick={handleHold}
              hasIcon
            >
              <Icon name="pause" />
              <span>Hold</span>
            </Button>
          ),
          (singleSnap?.held_until !== null || !sidePanel) && (
            <Button
              key="unhold"
              type="button"
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              disabled={0 === heldSnaps.length}
              onClick={handleUnhold}
              hasIcon
            >
              <Icon name="play" />
              <span>Unhold</span>
            </Button>
          ),
          <Button
            key="refresh"
            type="button"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={0 === selectedSnapIds.length}
            onClick={handleRefresh}
            hasIcon
          >
            <Icon name="change-version" />
            <span>Refresh</span>
          </Button>,
        ]}
      />
    </div>
  );
};

export default SnapsActions;
