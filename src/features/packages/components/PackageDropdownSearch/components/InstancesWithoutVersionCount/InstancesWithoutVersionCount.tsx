import { pluralizeWithCount } from "@/utils/_helpers";
import type { FC } from "react";

interface InstancesWithoutVersionCountProps {
  readonly count: number;
  readonly type: string;
}

const InstancesWithoutVersionCount: FC<InstancesWithoutVersionCountProps> = ({
  count,
  type,
}) => {
  if (count > 0) {
    return (
      <div>
        {pluralizeWithCount(count, "instance")} don&apos;t have this package{" "}
        {type}.
      </div>
    );
  }
};

export default InstancesWithoutVersionCount;
