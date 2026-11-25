import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useState } from "react";
import { UsnPackagesTable } from "@/features/usns";
import { useGetStaffUsnPackages } from "../../api";
import type { SupportInstanceTabProps } from "../../types";
import { Icon } from "@canonical/react-components";
import classes from "./SupportInstanceUsnPackages.module.scss";

interface SupportInstanceUsnPackagesProps extends SupportInstanceTabProps {
  readonly usn: string;
}

/** The packages of the instance that a security issue affects. */
const SupportInstanceUsnPackages: FC<SupportInstanceUsnPackagesProps> = ({
  name,
  instance,
  usn,
}) => {
  const [limit, setLimit] = useState(5);

  const { staffUsnPackages, staffUsnPackagesError, isGettingStaffUsnPackages } =
    useGetStaffUsnPackages(name, usn, [instance.id]);

  if (staffUsnPackagesError) {
    return (
      <span className={classes.error}>
        <Icon name="error" />
        Could not load the affected packages.
      </span>
    );
  }

  if (isGettingStaffUsnPackages) {
    return <LoadingState />;
  }

  return (
    <UsnPackagesTable
      limit={limit}
      onLimitChange={() => {
        setLimit((prevState) => prevState + 5);
      }}
      usn={usn}
      usnPackages={staffUsnPackages}
    />
  );
};

export default SupportInstanceUsnPackages;
