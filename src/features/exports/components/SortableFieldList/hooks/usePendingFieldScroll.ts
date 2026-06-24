import { useEffect, type RefObject } from "react";
import type { ExportField } from "../../../types/ExportForm";

export const usePendingFieldScroll = ({
  orderedFields,
  pendingScrollRef,
  rowRefsMap,
}: {
  readonly orderedFields: ExportField[];
  readonly pendingScrollRef: RefObject<string | null>;
  readonly rowRefsMap: RefObject<Map<string, HTMLTableRowElement>>;
}) => {
  // After orderedFields updates, scroll the pending field into view.
  // Delayed by 270ms so it fires after the FLIP animation (250ms) completes.
  // getBoundingClientRect includes CSS transforms, so calling scrollIntoView
  // while the FLIP translateY is active would measure the wrong position.
  useEffect(() => {
    if (!pendingScrollRef.current) return;
    const fieldId = pendingScrollRef.current;
    pendingScrollRef.current = null;
    const timer = setTimeout(() => {
      rowRefsMap.current
        .get(fieldId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 270);
    return () => {
      clearTimeout(timer);
    };
  }, [orderedFields, pendingScrollRef, rowRefsMap]);
};
