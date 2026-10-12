import { PageParamFilter } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import { useReapplyWslProfile } from "@/features/wsl-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type {
  InstanceChild,
  WindowsInstanceWithoutRelation,
} from "@/types/Instance";
import { getSelectionLabel } from "@/utils/_helpers";
import { ActionButton, Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import WindowsInstanceMakeCompliantModal from "../WindowsInstanceMakeCompliantModal";
import WslInstanceReinstallModal from "../WslInstanceReinstallModal";
import WslInstanceUninstallModal from "../WslInstanceUninstallModal";
import classes from "./WslInstancesHeader.module.scss";

const WslInstanceInstallForm = lazy(
  async () => import("../WslInstanceInstallForm"),
);

interface WslInstancesHeaderProps {
  readonly windowsInstance: WindowsInstanceWithoutRelation;
  readonly selectedWslInstances: InstanceChild[];
  readonly wslInstances: InstanceChild[];
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  selectedWslInstances,
  windowsInstance,
  wslInstances,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { reapplyWslProfile, isReapplyingWslProfile } = useReapplyWslProfile();

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
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

  const install = async () => {
    try {
      await Promise.all(
        selectedWslInstances.map((wslInstance) =>
          reapplyWslProfile({
            name: wslInstance.name,
            computer_ids: [windowsInstance.id],
          }),
        ),
      );

      notify.success({
        title: `You have successfully queued ${getSelectionLabel(selectedWslInstances, (instance) => `"${instance.name}"`, "instances")} to be installed.`,
        message: "An activity has been queued to install it.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const openInstallForm = () => {
    setSidePanelContent(
      "Create new WSL instance",
      <Suspense fallback={<LoadingState />}>
        <WslInstanceInstallForm />
      </Suspense>,
    );
  };

  const hasWslProfiles = wslInstances.some(
    (instanceChild) => instanceChild.profile,
  );

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.cta}>
            {hasWslProfiles && (
              <PageParamFilter
                label="Group by"
                options={[
                  { label: "None", value: "" },
                  { label: "Compliance", value: "compliance" },
                ]}
                pageParamKey="groupBy"
              />
            )}

            <ResponsiveButtons
              collapseFrom="xl"
              buttons={[
                ...(hasWslProfiles
                  ? [
                      <ActionButton
                        key="install"
                        type="button"
                        onClick={install}
                        hasIcon
                        disabled={
                          !selectedWslInstances.length ||
                          selectedWslInstances.some(
                            (wslInstance) =>
                              wslInstance.compliance !== "uninstalled",
                          )
                        }
                        loading={isReapplyingWslProfile}
                      >
                        <Icon name="begin-downloading" />
                        <span>Install</span>
                      </ActionButton>,
                      <Button
                        key="reinstall"
                        type="button"
                        onClick={openReinstallModal}
                        hasIcon
                        disabled={
                          !selectedWslInstances.length ||
                          selectedWslInstances.some(
                            (wslInstance) =>
                              wslInstance.compliance !== "noncompliant",
                          )
                        }
                      >
                        <Icon name="restart" />
                        <span>Reinstall</span>
                      </Button>,
                    ]
                  : []),
                <Button
                  key="uninstall"
                  type="button"
                  onClick={openUninstallModal}
                  hasIcon
                  disabled={
                    !selectedWslInstances.length ||
                    selectedWslInstances.some(
                      (wslInstance) => !wslInstance.installed,
                    )
                  }
                >
                  <Icon name="close" />
                  <span>Uninstall</span>
                </Button>,
                <Button
                  key="create-new-instance"
                  type="button"
                  onClick={openInstallForm}
                  hasIcon
                >
                  <Icon name="plus" />
                  <span>Create new instance</span>
                </Button>,
                ...(hasWslProfiles
                  ? [
                      <Button
                        key="make-compliant"
                        type="button"
                        hasIcon
                        onClick={openMakeCompliantModal}
                        disabled={wslInstances.every(
                          (wslInstance) =>
                            wslInstance.compliance === "compliant" ||
                            wslInstance.compliance === "pending",
                        )}
                      >
                        <Icon name="security-tick" />
                        <span>Make compliant</span>
                      </Button>,
                    ]
                  : []),
              ]}
            />
          </div>
        }
      />

      <WslInstanceReinstallModal
        close={closeReinstallModal}
        instances={selectedWslInstances}
        isOpen={isReinstallModalOpen}
        windowsInstance={windowsInstance}
      />

      <WslInstanceUninstallModal
        close={closeUninstallModal}
        instances={selectedWslInstances}
        isOpen={isUninstallModalOpen}
        parentId={windowsInstance.id}
      />

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={[windowsInstance]}
        isOpen={isMakeCompliantModalOpen}
      />
    </>
  );
};

export default WslInstancesHeader;
