import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { useGetRepositoryPackages } from "../../../../api/useGetRepositoryPackages";
import LocalRepositoryPackagesList from "../../../LocalRepositoryPackagesList";
import { Notification } from "@canonical/react-components";

interface ViewRepositoryPackagesTabProps {
  readonly repositoryName: string;
  readonly isImporting: boolean;
}

const ViewRepositoryPackagesTab: FC<ViewRepositoryPackagesTabProps> = ({
  repositoryName,
  isImporting,
}) => {
  const { packages, isGettingRepositoryPackages } =
    useGetRepositoryPackages(repositoryName);

  return (
    <>
      {isImporting && (
        <Notification
          title="Packages are currently being imported."
          borderless
          severity="caution"
          className="u-no-margin--bottom"
        />
      )}
      {isGettingRepositoryPackages ? (
        <LoadingState />
      ) : (
        <LocalRepositoryPackagesList packages={packages} />
      )}
    </>
  );
};

export default ViewRepositoryPackagesTab;
