import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import type { LocalRepository } from "../../types";
import { useGetRepositoryPackages } from "../../api";
import { pluralizeWithCount } from "@/utils/_helpers";

interface LocalRepositoryPackagesCountProps {
  readonly repository: LocalRepository;
}

const LocalRepositoryPackagesCount: FC<LocalRepositoryPackagesCountProps> = ({
  repository,
}) => {
  const { result, isGettingRepoPackages } = useGetRepositoryPackages({ repository: repository.name });
  const packages = result?.local_packages ?? [];

  if (isGettingRepoPackages) {
    return <LoadingState />;
  }

  return pluralizeWithCount(packages.length, "packages");
};

export default LocalRepositoryPackagesCount;
