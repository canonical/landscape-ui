import LoadingState from "@/components/layout/LoadingState";
import { useUsns } from "@/features/usns";
import { Icon } from "@canonical/react-components";
import type { Instance } from "@/types/Instance";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import UsnInstanceList from "../UsnInstanceList";
import UsnPackageList from "../UsnPackageList";
import classes from "./UsnPackagesContainer.module.scss";

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
    error: getAffectedPackagesQueryError,
  } = getAffectedPackagesQuery(
    {
      usn,
      computer_ids: isRemovable ? [instanceId] : instances.map(({ id }) => id),
    },
    { enabled: !!usn },
  );

  const usnPackages = getAffectedPackagesQueryResult?.data ?? [];

  if (getAffectedPackagesQueryError) {
    return (
      <span className={classes.error}>
        <Icon name="error" />
        Could not load the affected packages.
      </span>
    );
  }

  if (getAffectedPackagesQueryLoading) {
    return <LoadingState />;
  }

  return (
    <>
      {listType === "instances" ? (
        <UsnInstanceList
          instances={instances}
          limit={limit}
          onLimitChange={() => {
            setLimit((prevState) => prevState + 5);
          }}
          usn={usn}
          usnPackages={usnPackages}
        />
      ) : (
        <UsnPackageList
          instanceTitle={instances[0]?.title ?? ""}
          limit={limit}
          onLimitChange={() => {
            setLimit((prevState) => prevState + 5);
          }}
          showRemoveButton={isRemovable}
          usn={usn}
          usnPackages={usnPackages}
        />
      )}
    </>
  );
};

export default UsnPackagesContainer;
