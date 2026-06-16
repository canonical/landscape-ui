import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { ExportField } from "../../../types/ExportForm";

export const useSyncSortableFields = ({
  draggingFieldIdRef,
  fields,
  setOrderedFields,
}: {
  readonly draggingFieldIdRef: RefObject<string | null>;
  readonly fields: ExportField[];
  readonly setOrderedFields: Dispatch<SetStateAction<ExportField[]>>;
}) => {
  // Keep internal order in sync with the fields prop. Seeding state once with
  // useState(() => fields) ignores later prop changes; this re-syncs when the
  // parent updates the selection. Skip while a drag is active: an unrelated
  // parent re-render mid-drag must not clobber the live handleDragEnter preview
  // with the (stale) prop order.
  useEffect(() => {
    if (draggingFieldIdRef.current) return;
    // Intentional prop->state sync: setState in this effect is the deliberate
    // mechanism, not an accident. Reading draggingFieldIdRef during render (to
    // avoid the effect) would instead trip react-hooks/refs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedFields(fields);
  }, [draggingFieldIdRef, fields, setOrderedFields]);
};
