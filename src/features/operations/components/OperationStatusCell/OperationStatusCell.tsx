import useOperation from "@/hooks/useOperation";
import type { FC } from "react";
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

  return (
    <OperationStatusContent
      type={type}
      operationMetadata={operation?.metadata}
      hasOperation={!!operationName}
      isGettingOperations={isGettingOperations}
      isTableCell
    />
  );
};

export default OperationStatusCell;
