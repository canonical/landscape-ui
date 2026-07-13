import type { FC } from "react";
import { useGetMirrorPackagesCount, useListMirrorPackages } from "../../api";
import { PaginatedPackagesList } from "@/features/repositories";

interface MirrorPackagesListProps {
  readonly mirrorName: string;
}

const MirrorPackagesList: FC<MirrorPackagesListProps> = ({ mirrorName }) => {
  const {
    packages,
    isGettingPackages,
    packagesError,
    currentPage,
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
  } = useListMirrorPackages({ mirrorName });

  const { mirrorPackagesCount, isPackagesCountExact, isGettingPackagesCount } =
    useGetMirrorPackagesCount({ mirrorName });

  return (
    <PaginatedPackagesList
      packages={packages}
      packagesCount={mirrorPackagesCount}
      isPackagesCountExact={isPackagesCountExact}
      emptyMsg="No packages associated with this mirror."
      currentPage={currentPage}
      hasNextPage={hasNextPage}
      onNextPage={goToNextPage}
      onPreviousPage={goToPreviousPage}
      isGettingPackages={isGettingPackages || isGettingPackagesCount}
      error={packagesError}
    />
  );
};

export default MirrorPackagesList;
