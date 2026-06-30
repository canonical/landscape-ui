import { useLayoutEffect } from "react";

export const useDragOverlayPosition = ({
  draggingFieldId,
  positionOverlay,
}: {
  readonly draggingFieldId: string | null;
  readonly positionOverlay: () => void;
}) => {
  // Position the overlay as soon as it mounts, using the cursor position
  // captured at drag start, so it doesn't flash at the top-left before the
  // first dragover fires.
  useLayoutEffect(() => {
    if (draggingFieldId) positionOverlay();
  }, [draggingFieldId, positionOverlay]);
};
