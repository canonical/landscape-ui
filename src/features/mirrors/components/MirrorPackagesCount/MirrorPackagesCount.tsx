import NoData from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";
import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useGetMirrorPackagesCount } from "../../api";

interface MirrorPackagesCountProps {
  readonly mirrorName: string;
}

const MirrorPackagesCount: FC<MirrorPackagesCountProps> = ({ mirrorName }) => {
  const {
    mirrorPackagesCount,
    isPackagesCountExact,
    isGettingPackagesCount,
    isPackagesCountError,
  } = useGetMirrorPackagesCount({ mirrorName });

  if (isGettingPackagesCount) return <LoadingState inline />;
  if (isPackagesCountError) return <NoData />;

  return pluralize(
    mirrorPackagesCount,
    ["package"],
    isPackagesCountExact ? "exact" : "limited",
  );
};

export default MirrorPackagesCount;
