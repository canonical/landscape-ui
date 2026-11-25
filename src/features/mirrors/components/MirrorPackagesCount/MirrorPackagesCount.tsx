import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import { useGetMirrorPackagesCount } from "../../api";

interface MirrorPackagesCountProps {
  readonly mirrorName: string;
  readonly preserveSignatures?: boolean;
}

const MirrorPackagesCount: FC<MirrorPackagesCountProps> = ({
  mirrorName,
  preserveSignatures = false,
}) => {
  const {
    mirrorPackagesCount,
    isPackagesCountExact,
    isGettingPackagesCount,
    isPackagesCountError,
  } = useGetMirrorPackagesCount({ mirrorName, enabled: !preserveSignatures });

  if (preserveSignatures) return "Unavailable";
  if (isPackagesCountError || !mirrorName) return <NoData />;
  if (isGettingPackagesCount) return <LoadingState inline />;

  return pluralize(
    mirrorPackagesCount,
    ["package"],
    isPackagesCountExact ? "exact" : "limited",
  );
};

export default MirrorPackagesCount;
