import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import type {
  WindowsInstanceWithoutRelation,
  WslInstanceWithoutRelation,
} from "@/types/Instance";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import WindowsInstanceMakeCompliantModal from "../WindowsInstanceMakeCompliantModal";
import WslInstanceReinstallModal from "../WslInstanceReinstallModal";
import WslInstanceRemoveFromLandscapeModal from "../WslInstanceRemoveFromLandscapeModal";
import WslInstanceUninstallModal from "../WslInstanceUninstallModal";
import classes from "./WslInstancesHeader.module.scss";

const WslInstanceInstallForm = lazy(
  async () => import("../WslInstanceInstallForm"),
);

interface WslInstancesHeaderProps {
  readonly windowsInstance: WindowsInstanceWithoutRelation;
  readonly wslInstances: WslInstanceWithoutRelation[];
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  windowsInstance,
  wslInstances,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

  const {
    value: isReinstallModalOpen,
    setTrue: openReinstallModal,
    setFalse: closeReinstallModal,
  } = useBoolean();

  const {
    value: isUninstallModalOpen,
    setTrue: openUninstallModal,
    setFalse: closeUninstallModal,
  } = useBoolean();

  const {
    value: isRemoveFromLandscapeModalOpen,
    setTrue: openRemoveFromLandscapeModal,
    setFalse: closeRemoveFromLandscapeModal,
  } = useBoolean();

  const handleWslInstanceInstall = () => {
    setSidePanelContent(
      "Install new WSL instance",
      <Suspense fallback={<LoadingState />}>
        <WslInstanceInstallForm />
      </Suspense>,
    );
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.cta}>
            <div className="p-segmented-control">
              <div className="p-segmented-control__list">
                <Button
                  type="button"
                  onClick={handleWslInstanceInstall}
                  className="p-segmented-control__button u-no-margin--bottom"
                  hasIcon
                >
                  <Icon name="plus" />
                  <span>Create new instance</span>
                </Button>

                <Button
                  type="button"
                  className="p-segmented-control__button u-no-margin--bottom"
                  hasIcon
                  onClick={openMakeCompliantModal}
                >
                  <Icon name="security-tick" />
                  <span>Make compliant</span>
                </Button>
              </div>
            </div>

            <ResponsiveButtons
              collapseFrom="xxl"
              buttons={[
                <Button
                  type="button"
                  key="install"
                  className="p-segmented-control__button u-no-margin--bottom"
                  disabled={wslInstances.length === 0}
                  hasIcon
                  onClick={() => undefined}
                >
                  <Icon name="begin-downloading" />
                  <span>Install</span>
                </Button>,

                <Button
                  type="button"
                  key="reinstall"
                  className="p-segmented-control__button u-no-margin--bottom"
                  disabled={wslInstances.length === 0}
                  hasIcon
                  onClick={openReinstallModal}
                >
                  <Icon name="restart" />
                  <span>Reinstall</span>
                </Button>,

                <Button
                  type="button"
                  key="uninstall"
                  className="p-segmented-control__button u-no-margin--bottom"
                  disabled={wslInstances.length === 0}
                  onClick={openUninstallModal}
                  hasIcon
                >
                  <Icon name="close" />
                  <span>Uninstall</span>
                </Button>,

                <Button
                  type="button"
                  key="removeFromLandscape"
                  className="p-segmented-control__button u-no-margin--bottom"
                  disabled={wslInstances.length === 0}
                  onClick={openRemoveFromLandscapeModal}
                >
                  <Icon name="delete" />
                  <span>Remove from Landscape</span>
                </Button>,
              ]}
            />
          </div>
        }
      />

      <TableFilterChips filtersToDisplay={["search"]} />

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={[windowsInstance]}
        isOpen={isMakeCompliantModalOpen}
      />

      <WslInstanceReinstallModal
        close={closeReinstallModal}
        instances={wslInstances}
        isOpen={isReinstallModalOpen}
      />

      <WslInstanceUninstallModal
        close={closeUninstallModal}
        instances={wslInstances}
        isOpen={isUninstallModalOpen}
      />

      <WslInstanceRemoveFromLandscapeModal
        close={closeRemoveFromLandscapeModal}
        instances={wslInstances}
        isOpen={isRemoveFromLandscapeModalOpen}
      />
    </>
  );
};

export default WslInstancesHeader;
