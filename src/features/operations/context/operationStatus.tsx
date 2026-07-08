import { DEFAULT_POLLING_INTERVAL } from "@/constants";
import { createContext, useMemo, type FC, type ReactNode } from "react";
import { useBatchGetOperations } from "../api/useBatchGetOperations";
import type { Operation } from "../types";

interface OperationContextProps {
  operations: Record<string, Operation>;
  isGettingOperations: boolean;
  isOperationInProgress: (operationName?: string) => boolean;
}

export const OperationContext = createContext<OperationContextProps>({
  operations: {},
  isGettingOperations: false,
  isOperationInProgress: () => false,
});

interface OperationProviderProps {
  readonly operationNames: string[];
  readonly children: ReactNode;
}

/**
 * Owns the operations polling and exposes the result through context.
 *
 * Pass a stable table component as `children` so that a poll refetch only
 * re-renders this provider and the context consumers (the status cells).
 * Keeping the table subtree mounted preserves interactive per-row state, such
 * as an open ListActions contextual menu, which would otherwise be torn down
 * on every poll.
 */
export const OperationProvider: FC<OperationProviderProps> = ({
  operationNames,
  children,
}) => {
  const { operations, isGettingOperations } = useBatchGetOperations(
    operationNames,
    {
      refetchInterval: ({ state }) =>
        Object.values(state.data ?? {}).some((operation) => !operation.done)
          ? DEFAULT_POLLING_INTERVAL
          : false,
    },
  );

  const value = useMemo(
    () => ({
      operations,
      isGettingOperations,
      isOperationInProgress: (operationName?: string) => {
        if (!operationName) {
          return false;
        }

        const operation = operations[operationName];
        return !!operation && !operation.done;
      },
    }),
    [operations, isGettingOperations],
  );

  return (
    <OperationContext.Provider value={value}>
      {children}
    </OperationContext.Provider>
  );
};
