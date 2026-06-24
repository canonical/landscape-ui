import { useEffect, type RefObject } from "react";

export const useSortableFieldCleanup = ({
  dragOverRafRef,
  flipRafIdsRef,
  flipTimerIdsRef,
  justMovedTimerRef,
}: {
  readonly dragOverRafRef: RefObject<number | null>;
  readonly flipRafIdsRef: RefObject<number[]>;
  readonly flipTimerIdsRef: RefObject<ReturnType<typeof setTimeout>[]>;
  readonly justMovedTimerRef: RefObject<ReturnType<typeof setTimeout> | null>;
}) => {
  useEffect(() => {
    return () => {
      if (justMovedTimerRef.current) clearTimeout(justMovedTimerRef.current);
      if (dragOverRafRef.current !== null) {
        cancelAnimationFrame(dragOverRafRef.current);
      }
      for (const id of flipRafIdsRef.current) cancelAnimationFrame(id);
      for (const id of flipTimerIdsRef.current) clearTimeout(id);
    };
  }, [dragOverRafRef, flipRafIdsRef, flipTimerIdsRef, justMovedTimerRef]);
};
