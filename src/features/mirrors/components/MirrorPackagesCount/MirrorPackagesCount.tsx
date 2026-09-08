import NoData from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";
import { Spinner } from "@canonical/react-ds-global";
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

  if (isPackagesCountError || !mirrorName) return <NoData />;
  if (isGettingPackagesCount) return <Spinner />;

  return pluralize(
    mirrorPackagesCount,
    ["package"],
    isPackagesCountExact ? "exact" : "limited",
  );
};

export default MirrorPackagesCount;
