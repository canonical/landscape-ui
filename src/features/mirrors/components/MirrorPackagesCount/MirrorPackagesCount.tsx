import NoData from "@/components/layout/NoData";
import { pluralizeNew } from "@/utils/_helpers";
import { Spinner } from "@canonical/react-components";
import type { FC } from "react";
import { useListMirrorPackages } from "../../api";

interface MirrorPackagesCount {
  readonly mirrorName: string;
}

const MirrorPackagesCount: FC<MirrorPackagesCount> = ({ mirrorName }) => {
  const { data, isLoading, isError } = useListMirrorPackages(mirrorName, {
    pageSize: 1000,
  });

  if (isLoading) return <Spinner />;
  if (isError || !data) return <NoData />;

  return pluralizeNew(data.data.mirrorPackages?.length, "package", {
    showCount: data.data.nextPageToken === undefined ? "exact" : "limited",
  });
};

export default MirrorPackagesCount;
