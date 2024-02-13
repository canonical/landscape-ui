import { FC, useMemo } from "react";
import { Package } from "../../../../../../types/Package";
import InfoItem from "../../../../../../components/layout/InfoItem";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import InstalledPackagesActionForm from "./InstalledPackagesActionForm";
import useConfirm from "../../../../../../hooks/useConfirm";
import { Button, Col, Row } from "@canonical/react-components";
import { usePackages } from "../../../../../../hooks/usePackages";
import useDebug from "../../../../../../hooks/useDebug";
import classes from "./PackageDetails.module.scss";
import classNames from "classnames";

const isUbuntuProRequired = (pkg: Package) => {
  return pkg.computers.upgrades.length > 0 && pkg.version.includes("1-2");
};

interface PackageDetailsProps {
  singlePackage: Package;
  query: string;
}

const PackageDetails: FC<PackageDetailsProps> = ({ singlePackage, query }) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { installPackagesQuery, getPackagesQuery } = usePackages();

  const { data: getPackagesQueryResult, error: getPackagesQueryError } =
    getPackagesQuery(
      {
        query,
        installed: singlePackage.computers.upgrades.length > 0,
        names: [singlePackage.name],
      },
      {
        enabled:
          singlePackage.computers.upgrades.length > 0 ||
          singlePackage.computers.installed.length > 0,
      },
    );

  if (getPackagesQueryError) {
    debug(getPackagesQueryError);
  }

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
        query={query}
      />,
    );
  };

  const handleInstallPackages = async () => {
    try {
      await installPackages({
        packages: [singlePackage.name],
        query,
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

  const upgradableVersion = useMemo(() => {
    if (
      singlePackage.computers.installed.length === 0 ||
      !getPackagesQueryResult ||
      getPackagesQueryResult.data.count === 0
    ) {
      return;
    }

    for (const pkg of getPackagesQueryResult.data.results.sort((a, b) =>
      b.version.localeCompare(a.version),
    )) {
      if (!isUbuntuProRequired(pkg)) {
        return pkg.version;
      }
    }
  }, [getPackagesQueryResult, singlePackage.computers.installed.length]);

  return (
    <>
      <div
        key="buttons"
        className={classNames("p-segmented-control", classes.actions)}
      >
        {singlePackage.computers.installed.length > 0 && (
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
        {(singlePackage.computers.upgrades.length > 0 || upgradableVersion) && (
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
        {singlePackage.computers.installed.length > 0 && (
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
        {singlePackage.computers.installed.length === 0 &&
          singlePackage.computers.upgrades.length === 0 && (
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
            value={
              singlePackage.computers.installed.length > 0
                ? singlePackage.version
                : getPackagesQueryResult?.data.results[0].version
            }
          />
        </Col>
        {(singlePackage.computers.upgrades.length > 0 ||
          singlePackage.computers.available.length > 0 ||
          (getPackagesQueryResult &&
            getPackagesQueryResult.data.count > 0)) && (
          <Col size={6}>
            <InfoItem
              label="Upgeradable to"
              value={upgradableVersion ?? singlePackage.version}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default PackageDetails;
