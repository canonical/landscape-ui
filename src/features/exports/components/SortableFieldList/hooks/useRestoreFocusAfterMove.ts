import { useEffect, type RefObject } from "react";
import type { ExportField } from "../../../types/ExportForm";

interface PendingFocus {
  fieldId: string;
  direction: "up" | "down";
}

export const useRestoreFocusAfterMove = ({
  orderedFields,
  pendingFocusRef,
  rowRefsMap,
}: {
  readonly orderedFields: ExportField[];
  readonly pendingFocusRef: RefObject<PendingFocus | null>;
  readonly rowRefsMap: RefObject<Map<string, HTMLTableRowElement>>;
}) => {
  // Restore focus to the moved row's same-direction button after the reorder
  // re-renders, unless that button is now disabled (e.g. the row reached the
  // top/bottom). Canonical's Button stays focusable and signals disabled via
  // aria-disabled, so we check that attribute explicitly.
  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;
    pendingFocusRef.current = null;

    const row = rowRefsMap.current.get(pending.fieldId);
    const label = orderedFields.find((f) => f.id === pending.fieldId)?.label;
    if (!row || !label) return;

    const button = row.querySelector<HTMLButtonElement>(
      `button[aria-label="Move ${label} ${pending.direction}"]`,
    );
    if (button && button.getAttribute("aria-disabled") !== "true") {
      button.focus();
    }
  }, [orderedFields, pendingFocusRef, rowRefsMap]);
};
