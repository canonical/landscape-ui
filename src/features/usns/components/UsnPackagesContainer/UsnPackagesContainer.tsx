import { FC, useState } from "react";
import { useParams } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import { useUsns } from "@/features/usns";
import { Instance } from "@/types/Instance";
import UsnInstanceList from "../UsnInstanceList";
import UsnPackageList from "../UsnPackageList";
import { UrlParams } from "@/types/UrlParams";

interface UsnPackagesContainerProps {
  instances: Instance[];
  isRemovable: boolean;
  listType: "packages" | "instances";
  usn: string;
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

  return (
    <>
      {getAffectedPackagesQueryLoading && <LoadingState />}
      {!getAffectedPackagesQueryLoading && listType === "instances" && (
        <UsnInstanceList
          instances={instances}
          limit={limit}
          onLimitChange={() => setLimit((prevState) => prevState + 5)}
          usn={usn}
          usnPackages={usnPackages}
        />
      )}
      {!getAffectedPackagesQueryLoading && listType === "packages" && (
        <UsnPackageList
          instanceTitle={instances[0].title}
          limit={limit}
          onLimitChange={() => setLimit((prevState) => prevState + 5)}
          showRemoveButton={isRemovable}
          usn={usn}
          usnPackages={usnPackages}
        />
      )}
    </>
  );
};

export default UsnPackagesContainer;
