import { FC, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import PackagesContainer from "./PackagesContainer";
import { usePackages } from "../../../hooks/usePackages";
import useDebug from "../../../hooks/useDebug";
import useConfirm from "../../../hooks/useConfirm";
import { Button } from "@canonical/react-components";

const PackagesPage: FC = () => {
  const [query, setQuery] = useState("");
  const [selectedPackageNames, setSelectedPackageNames] = useState<string[]>(
    [],
  );

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();

  const { installPackagesQuery, removePackagesQuery, upgradePackagesQuery } =
    usePackages();

  const { mutateAsync: installPackages, isLoading: installPackagesLoading } =
    installPackagesQuery;

  const handleInstallPackages = () => {
    confirmModal({
      title: "Install packages",
      body: "Are you sure you want to install the selected packages?",
      buttons: [
        <Button
          key="install"
          appearance="positive"
          onClick={async () => {
            try {
              await installPackages({
                packages: selectedPackageNames,
                query,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
              setSelectedPackageNames([]);
            }
          }}
        >
          Install
        </Button>,
      ],
    });
  };

  const { mutateAsync: removePackages, isLoading: removePackagesLoading } =
    removePackagesQuery;

  const handleRemovePackages = () => {
    confirmModal({
      title: "Remove packages",
      body: "Are you sure you want to remove the selected packages?",
      buttons: [
        <Button
          key="remove"
          appearance="negative"
          onClick={async () => {
            try {
              await removePackages({
                packages: selectedPackageNames,
                query,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
              setSelectedPackageNames([]);
            }
          }}
        >
          Remove
        </Button>,
      ],
    });
  };

  const { mutateAsync: upgradePackages, isLoading: upgradePackagesLoading } =
    upgradePackagesQuery;

  const handleUpgradePackages = () => {
    confirmModal({
      title: "Upgrade packages",
      body: "Are you sure you want to upgrade the selected packages?",
      buttons: [
        <Button
          key="upgrade"
          appearance="positive"
          onClick={async () => {
            try {
              await upgradePackages({
                packages: selectedPackageNames,
                query,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
              setSelectedPackageNames([]);
            }
          }}
        >
          Upgrade
        </Button>,
      ],
    });
  };

  return (
    <PageMain>
      <PageHeader
        title="Packages"
        sticky
        actions={[
          <div key="buttons" className="p-segmented-control is-small">
            <button
              className="p-segmented-control__button"
              disabled={
                "" === query ||
                0 === selectedPackageNames.length ||
                installPackagesLoading
              }
              onClick={handleInstallPackages}
            >
              Install
            </button>
            <button
              className="p-segmented-control__button"
              disabled={
                "" === query ||
                0 === selectedPackageNames.length ||
                removePackagesLoading
              }
              onClick={handleRemovePackages}
            >
              Remove
            </button>
            <button
              className="p-segmented-control__button"
              disabled={
                "" === query ||
                0 === selectedPackageNames.length ||
                upgradePackagesLoading
              }
              onClick={handleUpgradePackages}
            >
              Upgrade
            </button>
          </div>,
        ]}
      />
      <PageContent>
        <PackagesContainer
          selectedPackageNames={selectedPackageNames}
          setSelectedPackageNames={(value) => {
            setSelectedPackageNames(value);
          }}
          query={query}
          setQuery={(value) => {
            setQuery(value);
          }}
        />
      </PageContent>
    </PageMain>
  );
};

export default PackagesPage;
