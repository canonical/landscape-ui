import LoadingState from "@/components/layout/LoadingState";
import { useGetEmployee } from "@/features/employees";
import type { FC } from "react";

interface EmployeeProps {
  readonly id: number;
}

const Employee: FC<EmployeeProps> = ({ id }) => {
  const { employee, isPending } = useGetEmployee({ id });

  if (isPending) {
    return <LoadingState />;
  } else {
    return employee?.name;
  }
};

export default Employee;
