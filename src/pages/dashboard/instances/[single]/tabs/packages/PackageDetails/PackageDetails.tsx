import { FC } from "react";
import { Package } from "@/types/Package";
import InfoItem from "@/components/layout/InfoItem";
import useSidePanel from "@/hooks/useSidePanel";
import useConfirm from "@/hooks/useConfirm";
import { Button, Col, Row } from "@canonical/react-components";
import { usePackages } from "@/hooks/usePackages";
import useDebug from "@/hooks/useDebug";
import InstalledPackagesActionForm from "@/pages/dashboard/instances/[single]/tabs/packages/InstalledPackagesActionForm";
import { useParams } from "react-router-dom";

interface PackageDetailsProps {
  singlePackage: Package;
}

const PackageDetails: FC<PackageDetailsProps> = ({ singlePackage }) => {
  const { instanceId } = useParams();
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { installPackagesQuery } = usePackages();

  const { mutateAsync: installPackages, isLoading: installPackagesLoading } =
    installPackagesQuery;

  const handleExistingPackages = (
    action: Parameters<typeof InstalledPackagesActionForm>[0]["action"],
  ) => {
    const actionLabels: { [key in typeof action]: string } = {
      remove: "Uninstall",
      upgrade: "Upgrade",
      downgrade: "Downgrade",
    };

    setSidePanelContent(
      `${actionLabels[action]} ${singlePackage.name}`,
      <InstalledPackagesActionForm
        action={action}
        packages={[singlePackage]}
      />,
    );
  };

  const handleInstallPackages = async () => {
    try {
      await installPackages({
        packages: [singlePackage.name],
        query: `id:${instanceId}`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleInstallPackage = () => {
    confirmModal({
      title: "Install package",
      body: `Are you sure you want to install "${singlePackage.name}" package?`,
      buttons: [
        <Button
          key="install"
          appearance="positive"
          disabled={installPackagesLoading}
          onClick={handleInstallPackages}
        >
          Install
        </Button>,
      ],
    });
  };

  return (
    <>
      <div key="buttons" className="p-segmented-control">
        {singlePackage.current_version && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            onClick={() => {
              handleExistingPackages("remove");
            }}
          >
            <i className="p-icon--delete" />
            <span>Uninstall</span>
          </Button>
        )}
        {singlePackage.available_version && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            onClick={() => {
              handleExistingPackages("upgrade");
            }}
          >
            <i className="p-icon--change-version" />
            <span>Upgrade</span>
          </Button>
        )}
        {singlePackage.current_version && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            onClick={() => {
              handleExistingPackages("downgrade");
            }}
          >
            <i className="p-icon--begin-downloading" />
            <span>Downgrade</span>
          </Button>
        )}
        {singlePackage.available_version && !singlePackage.current_version && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            onClick={handleInstallPackage}
          >
            <i className="p-icon--plus" />
            <span>Install</span>
          </Button>
        )}
      </div>

      <div>
        <InfoItem label="Package name" value={singlePackage.name} />
      </div>
      <div>
        <InfoItem label="Summary" value={singlePackage.summary} />
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem
            label="Current version"
            value={singlePackage.current_version}
          />
        </Col>
        {singlePackage.available_version && (
          <Col size={6}>
            <InfoItem
              label="Upgeradable to"
              value={singlePackage.available_version}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default PackageDetails;
