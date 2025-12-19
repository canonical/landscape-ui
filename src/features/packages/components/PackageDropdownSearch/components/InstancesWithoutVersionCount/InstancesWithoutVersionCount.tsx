import { pluralizeWithCount } from "@/utils/_helpers";
import type { FC } from "react";

interface InstancesWithoutVersionCountProps {
  readonly count: number;
}

const InstancesWithoutVersionCount: FC<InstancesWithoutVersionCountProps> = ({
  count,
}) => {
  if (count > 0) {
    return (
      <div>
        {pluralizeWithCount(count, "instance")} don&apos;t have this package
        available.
      </div>
    );
  }
};

export default InstancesWithoutVersionCount;
