import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useGetRepositoryPackagesCount } from "../../../../api";
import { pluralize } from "@/utils/_helpers";
import NoData from "@/components/layout/NoData/NoData";

interface LocalPackagesCountProps {
  readonly repository: string;
}

const LocalRepositoryPackagesCount: FC<LocalPackagesCountProps> = ({
  repository,
}) => {
  const {
    localPackagesCount,
    isPackagesCountExact,
    isGettingPackagesCount,
    isPackagesCountError,
  } = useGetRepositoryPackagesCount({ local: repository });

  if (isGettingPackagesCount) return <LoadingState inline />;
  if (isPackagesCountError) return <NoData />;

  return pluralize(
    localPackagesCount,
    ["package"],
    isPackagesCountExact ? "exact" : "limited",
  );
};

export default LocalRepositoryPackagesCount;
