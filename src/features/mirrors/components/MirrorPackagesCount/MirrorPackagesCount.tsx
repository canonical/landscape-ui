import type { FC } from "react";
import { useListMirrorPackages } from "../../api";
import { pluralizeNew } from "@/utils/_helpers";

interface MirrorPackagesCount {
  readonly mirrorName: string;
}

const MirrorPackagesCount: FC<MirrorPackagesCount> = ({ mirrorName }) => {
  const { data } = useListMirrorPackages(mirrorName, { pageSize: 1000 });

  return pluralizeNew(data.data.mirrorPackages?.length, "package", {
    showCount: data.data.nextPageToken === undefined ? "exact" : "limited",
  });
};

export default MirrorPackagesCount;
