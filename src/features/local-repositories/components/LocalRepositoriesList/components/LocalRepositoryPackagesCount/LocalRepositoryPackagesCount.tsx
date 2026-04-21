import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import type { LocalRepository } from "../../../../types";
import { useGetRepositoryPackages } from "../../../../api";
import { pluralizeWithCount } from "@/utils/_helpers";

interface LocalRepositoryPackagesCountProps {
  readonly repository: LocalRepository;
}

const LocalRepositoryPackagesCount: FC<LocalRepositoryPackagesCountProps> = ({
  repository,
}) => {
  const { result, isGettingRepositoryPackages } = useGetRepositoryPackages({
    repository: repository.name,
  });
  const packages = result?.local_packages ?? [];

  if (isGettingRepositoryPackages) {
    return <LoadingState inline />;
  }

  return pluralizeWithCount(packages.length, "package");
};

export default LocalRepositoryPackagesCount;
