import useOperation from "@/hooks/useOperation";
import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import OperationStatusContent from "../OperationStatusContent";

interface OperationStatusCellProps {
  readonly type: "publication" | "mirror" | "local";
  readonly operationName: string | undefined;
}

const OperationStatusCell: FC<OperationStatusCellProps> = ({
  operationName,
  type,
}) => {
  const { operations, isGettingOperations } = useOperation();
  const operation = operations[operationName ?? ""];

  if (isGettingOperations) {
    return <LoadingState inline />;
  }

  return (
    <OperationStatusContent
      type={type}
      operationMetadata={operation?.metadata}
      hasOperation={!!operationName}
      isTableCell
    />
  );
};

export default OperationStatusCell;
