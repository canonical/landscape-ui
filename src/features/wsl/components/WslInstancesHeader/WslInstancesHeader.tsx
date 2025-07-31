import { TableFilterChips } from "@/components/filter";
import GroupFilter from "@/components/filter/GroupFilter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { useReapplyWslProfile } from "@/features/wsl-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type {
  InstanceChild,
  WindowsInstanceWithoutRelation,
} from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
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
  readonly hasWslProfiles: boolean;
  readonly windowsInstance: WindowsInstanceWithoutRelation;
  readonly selectedWslInstances: InstanceChild[];
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  hasWslProfiles,
  selectedWslInstances,
  windowsInstance,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { reapplyWslProfile } = useReapplyWslProfile();

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
        title: `You have successfully queued ${pluralize(selectedWslInstances.length, `${selectedWslInstances[0].name}`, `${selectedWslInstances.length} instances`)} to be installed.`,
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

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.cta}>
            {hasWslProfiles && (
              <GroupFilter
                label="Group by"
                options={[
                  { label: "None", value: "" },
                  { label: "Compliance", value: "compliance" },
                ]}
              />
            )}

            <div className={classes.buttons}>
              <div className="p-segmented-control">
                <div className="p-segmented-control__list">
                  {hasWslProfiles && (
                    <Button
                      type="button"
                      onClick={install}
                      className="p-segmented-control__button u-no-margin--bottom"
                      hasIcon
                      disabled={
                        !selectedWslInstances.length ||
                        selectedWslInstances.some(
                          (wslInstance) =>
                            wslInstance.compliance !== "uninstalled",
                        )
                      }
                    >
                      <Icon name="begin-downloading" />
                      <span>Install</span>
                    </Button>
                  )}

                  {hasWslProfiles && (
                    <Button
                      type="button"
                      onClick={openReinstallModal}
                      className="p-segmented-control__button u-no-margin--bottom"
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
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={openUninstallModal}
                    className="p-segmented-control__button u-no-margin--bottom"
                    hasIcon
                    disabled={
                      !selectedWslInstances.length ||
                      selectedWslInstances.some(
                        (wslInstance) => wslInstance.computer_id === null,
                      )
                    }
                  >
                    <Icon name="close" />
                    <span>Uninstall</span>
                  </Button>
                </div>
              </div>

              <div className="p-segmented-control">
                <div className="p-segmented-control__list">
                  <Button
                    type="button"
                    onClick={openInstallForm}
                    className="p-segmented-control__button u-no-margin--bottom"
                    hasIcon
                  >
                    <Icon name="plus" />
                    <span>Create new instance</span>
                  </Button>

                  {hasWslProfiles && (
                    <Button
                      type="button"
                      className="p-segmented-control__button u-no-margin--bottom"
                      hasIcon
                      onClick={openMakeCompliantModal}
                    >
                      <Icon name="security-tick" />
                      <span>Make compliant</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
      />

      <TableFilterChips filtersToDisplay={["search"]} />

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
