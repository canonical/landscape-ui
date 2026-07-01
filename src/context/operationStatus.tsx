import { DEFAULT_POLLING_INTERVAL } from "@/constants";
import { createContext, useMemo, type FC, type ReactNode } from "react";
import { useBatchGetOperations } from "../features/operations/api";
import type { Operation } from "../features/operations/types";

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
 * The table that consumes the statuses must be passed as `children` (a stable
 * element created by a non-polling parent). This way a poll refetch only
 * re-renders this provider and the context consumers (the status cells) — never
 * the table subtree. Keeping the table subtree mounted preserves interactive
 * per-row state, such as an open ListActions contextual menu, which would
 * otherwise be torn down on every poll.
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
        const operation = operations[operationName ?? ""];
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
