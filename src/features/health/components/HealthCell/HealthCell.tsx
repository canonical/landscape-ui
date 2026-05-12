import type { FC } from "react";
import HealthBar from "../HealthBar";
import useComputerHealth from "../../hooks/useComputerHealth";

interface HealthCellProps {
  readonly instanceId: number;
}

const HealthCell: FC<HealthCellProps> = ({ instanceId }) => {
  const { data, isLoading, isError } = useComputerHealth(instanceId);
  return (
    <HealthBar
      health={data?.data}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default HealthCell;
