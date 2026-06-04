import type { FC } from "react";
import { useGetInstance } from "../../api";
import { Spinner } from "@canonical/react-components";
import NoData from "@/components/layout/NoData";

interface InstanceTitleProps {
  readonly instanceId: number;
}

const InstanceTitle: FC<InstanceTitleProps> = ({ instanceId }) => {
  const { instance, isGettingInstance } = useGetInstance({ instanceId });

  if (isGettingInstance) {
    return <Spinner />;
  }

  return instance?.title || <NoData />;
};

export default InstanceTitle;
