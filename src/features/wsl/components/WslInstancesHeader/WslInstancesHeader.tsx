import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { WindowsInstanceWithoutRelation } from "@/types/Instance";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import WindowsInstanceMakeCompliantModal from "../WindowsInstanceMakeCompliantModal";

const WslInstanceInstallForm = lazy(
  async () => import("../WslInstanceInstallForm"),
);

interface WslInstancesHeaderProps {
  readonly windowsInstance: WindowsInstanceWithoutRelation;
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  windowsInstance,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

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
        }
      />

      <TableFilterChips filtersToDisplay={["search"]} />

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={[windowsInstance]}
        isOpen={isMakeCompliantModalOpen}
      />
    </>
  );
};

export default WslInstancesHeader;
