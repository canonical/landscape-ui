import type { FC } from "react";
import {
  useGetRepositoryPackages,
  useGetRepositoryPackagesCount,
} from "../../../../api";
import { PaginatedPackagesList } from "@/features/repositories";
import { Notification } from "@canonical/react-components";

interface ViewRepositoryPackagesTabProps {
  readonly repositoryName: string;
  readonly isImporting: boolean;
}

const ViewRepositoryPackagesTab: FC<ViewRepositoryPackagesTabProps> = ({
  repositoryName,
  isImporting,
}) => {
  const {
    packages,
    isGettingPackages,
    packagesError,
    hasPreviousPage,
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
  } = useGetRepositoryPackages({ local: repositoryName });

  const { localPackagesCount, isPackagesCountExact, isGettingPackagesCount } =
    useGetRepositoryPackagesCount({
      local: repositoryName,
    });

  return (
    <>
      <div aria-live="polite" aria-relevant="additions removals">
        {isImporting && (
          <Notification
            title="Packages are currently being imported."
            borderless
            severity="caution"
            className="u-no-margin--bottom"
          />
        )}
      </div>
      <PaginatedPackagesList
        packages={packages}
        packagesCount={localPackagesCount}
        isPackagesCountExact={isPackagesCountExact}
        emptyMsg="No packages associated with this local repository."
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        isGettingPackages={isGettingPackages || isGettingPackagesCount}
        error={packagesError}
      />
    </>
  );
};

export default ViewRepositoryPackagesTab;
