import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import { useGetMirrorPackagesCount } from "../../api";
import { PACKAGES_COUNT_UNAVAILABLE_TEXT } from "./constants";

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

  if (preserveSignatures) return PACKAGES_COUNT_UNAVAILABLE_TEXT;
  if (isPackagesCountError || !mirrorName) return <NoData />;
  if (isGettingPackagesCount) return <LoadingState inline />;

  return pluralize(
    mirrorPackagesCount,
    ["package"],
    isPackagesCountExact ? "exact" : "limited",
  );
};

export default MirrorPackagesCount;
