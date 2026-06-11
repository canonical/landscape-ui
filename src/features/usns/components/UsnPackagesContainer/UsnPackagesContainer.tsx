import LoadingState from "@/components/layout/LoadingState";
import { useUsns } from "@/features/usns";
import type { Instance } from "@/types/Instance";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import UsnInstanceList from "../UsnInstanceList";
import UsnPackageList from "../UsnPackageList";

interface UsnPackagesContainerProps {
  readonly instances: Instance[];
  readonly isRemovable: boolean;
  readonly listType: "packages" | "instances";
  readonly usn: string;
}

const UsnPackagesContainer: FC<UsnPackagesContainerProps> = ({
  instances,
  isRemovable,
  listType,
  usn,
}) => {
  const [limit, setLimit] = useState(5);
  const { getAffectedPackagesQuery } = useUsns();
  const { instanceId: urlInstanceId } = useParams<UrlParams>();

  const instanceId = Number(urlInstanceId);

  const {
    data: getAffectedPackagesQueryResult,
    isLoading: getAffectedPackagesQueryLoading,
  } = getAffectedPackagesQuery({
    usn,
    computer_ids: isRemovable ? [instanceId] : instances.map(({ id }) => id),
  });

  const usnPackages = getAffectedPackagesQueryResult?.data ?? [];

  // `UsnPackageList` renders its own loading / empty / table states so
  // the expanded section keeps the "Packages affected by …" heading
  // anchored across all three. `UsnInstanceList` doesn't yet have that
  // treatment, so we keep the bare-spinner fallback for the instances
  // path until it gets the same.
  if (listType === "packages") {
    return (
      <UsnPackageList
        instanceTitle={instances[0]!.title}
        isLoading={getAffectedPackagesQueryLoading}
        limit={limit}
        onLimitChange={() => {
          setLimit((prevState) => prevState + 5);
        }}
        showRemoveButton={isRemovable}
        usn={usn}
        usnPackages={usnPackages}
      />
    );
  }

  return (
    <>
      {getAffectedPackagesQueryLoading && <LoadingState />}
      {!getAffectedPackagesQueryLoading && (
        <UsnInstanceList
          instances={instances}
          limit={limit}
          onLimitChange={() => {
            setLimit((prevState) => prevState + 5);
          }}
          usn={usn}
          usnPackages={usnPackages}
        />
      )}
    </>
  );
};

export default UsnPackagesContainer;
