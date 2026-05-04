import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import type { Local } from "@canonical/landscape-openapi";
import { useGetRepositoryPackages } from "../../../../api/useGetRepositoryPackages";
import LocalRepositoryPackagesList from "../../../LocalRepositoryPackagesList";

interface ViewRepositoryPackagesTabProps {
  readonly repository: Local;
}

const ViewRepositoryPackagesTab: FC<ViewRepositoryPackagesTabProps> = ({
  repository,
}) => {
  const { packages, isGettingRepositoryPackages } = useGetRepositoryPackages(
    repository.name ?? "",
  );

  if (isGettingRepositoryPackages) {
    return <LoadingState />;
  }

  return <LocalRepositoryPackagesList packages={packages} />;
};

export default ViewRepositoryPackagesTab;
