import { useContext } from "react";
import { OperationContext } from "../context/operationStatus";

export default function useOperation() {
  return useContext(OperationContext);
}
