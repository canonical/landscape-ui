import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { useGetRepositoryPackages } from "../../../../api";
import { pluralizeWithCount } from "@/utils/_helpers";

interface LocalRepositoryPackagesCountProps {
  readonly repository: Local;
}

const LocalRepositoryPackagesCount: FC<LocalRepositoryPackagesCountProps> = ({
  repository,
}) => {
  const { packages, isGettingRepositoryPackages } = useGetRepositoryPackages(
    repository.name ?? "", // TODO: handle case where repository name is undefined,
  );

  if (isGettingRepositoryPackages) {
    return <LoadingState inline />;
  }

  return pluralizeWithCount(packages.length, "package");
};

export default LocalRepositoryPackagesCount;
