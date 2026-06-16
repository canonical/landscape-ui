import { useEffect, type RefObject } from "react";
import type { ExportField } from "../../../types/ExportForm";

export const useSortableFieldRefs = ({
  draggingFieldId,
  draggingFieldIdRef,
  orderedFields,
  orderedFieldsRef,
}: {
  readonly draggingFieldId: string | null;
  readonly draggingFieldIdRef: RefObject<string | null>;
  readonly orderedFields: ExportField[];
  readonly orderedFieldsRef: RefObject<ExportField[]>;
}) => {
  // Live mirrors of state read inside stable drag handlers, so those handlers
  // (and therefore getReorderRowProps) keep a constant identity across renders.
  // The passive effect is a backstop for the general case; the drag path keeps
  // orderedFieldsRef current synchronously inside the state updater (see
  // handleDragEnter) so handleDrop never depends on passive-effect flush timing.
  useEffect(() => {
    orderedFieldsRef.current = orderedFields;
    draggingFieldIdRef.current = draggingFieldId;
  });
};
