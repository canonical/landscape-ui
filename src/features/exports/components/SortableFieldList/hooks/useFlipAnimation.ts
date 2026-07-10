import { useLayoutEffect, type RefObject } from "react";
import type { ExportField } from "../../../types/ExportForm";
import { FLIP_TRANSITION_CLEANUP_MS } from "../constants";

export const useFlipAnimation = ({
  flipPositionsRef,
  flipRafIdsRef,
  flipTimerIdsRef,
  orderedFields,
  pendingFlipRef,
  rowRefsMap,
}: {
  readonly flipPositionsRef: RefObject<Map<string, number>>;
  readonly flipRafIdsRef: RefObject<number[]>;
  readonly flipTimerIdsRef: RefObject<ReturnType<typeof setTimeout>[]>;
  readonly orderedFields: ExportField[];
  readonly pendingFlipRef: RefObject<boolean>;
  readonly rowRefsMap: RefObject<Map<string, HTMLTableRowElement>>;
}) => {
  // FLIP animation: after orderedFields changes, animate rows from their old
  // viewport positions to their new ones. Only runs when pendingFlipRef is set
  // (i.e. arrow/number moves, not drag reorders).
  useLayoutEffect(() => {
    if (!pendingFlipRef.current) return;
    pendingFlipRef.current = false;

    const oldPositions = flipPositionsRef.current;

    rowRefsMap.current.forEach((el, id) => {
      const oldTop = oldPositions.get(id);
      if (oldTop === undefined) return;
      const newTop = el.getBoundingClientRect().top;
      const delta = oldTop - newTop;
      if (delta === 0) return;

      el.style.transform = `translateY(${delta}px)`;
      el.style.transition = "transform 0s";

      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          el.style.transition = "transform 0.25s ease, opacity 0.15s ease";
          el.style.transform = "";
          const timer = setTimeout(() => {
            el.style.transition = "";
          }, FLIP_TRANSITION_CLEANUP_MS);
          flipTimerIdsRef.current.push(timer);
        });
        flipRafIdsRef.current.push(raf2);
      });
      flipRafIdsRef.current.push(raf1);
    });
  }, [
    flipPositionsRef,
    flipRafIdsRef,
    flipTimerIdsRef,
    orderedFields,
    pendingFlipRef,
    rowRefsMap,
  ]);
};
