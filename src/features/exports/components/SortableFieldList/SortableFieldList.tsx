import { Button, Icon, Input, ModularTable } from "@canonical/react-components";
import classNames from "classnames";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FC,
  type HTMLProps,
} from "react";
import { createPortal } from "react-dom";
import type { CellProps, Column, Row, TableRowProps } from "react-table";
import classes from "./SortableFieldList.module.scss";
import type { ExportField } from "../../types/ExportForm";
import { JUST_MOVED_HIGHLIGHT_MS, OVERLAY_CURSOR_OFFSET_PX } from "./constants";
import { createTransparentDragImage } from "./helpers";
import {
  useDragOverlayPosition,
  useFlipAnimation,
  usePendingFieldScroll,
  useRestoreFocusAfterMove,
  useSortableFieldCleanup,
  useSortableFieldRefs,
  useSyncSortableFields,
} from "./hooks";

interface ReorderRowData extends Record<string, unknown> {
  index: number;
  fieldId: string;
  label: string;
  currentOrder: string;
}

const TRANSPARENT_DRAG_IMAGE = createTransparentDragImage();

interface SortableFieldListProps {
  readonly fields: ExportField[];
  readonly onOrderChange: (fields: ExportField[]) => void;
}

const SortableFieldList: FC<SortableFieldListProps> = ({
  fields,
  onOrderChange,
}) => {
  const [orderedFields, setOrderedFields] = useState<ExportField[]>(
    () => fields,
  );
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const originalOrderRef = useRef<ExportField[]>([]);
  const dropSucceededRef = useRef(false);
  const [orderDrafts, setOrderDrafts] = useState<Record<number, string>>({});
  const [justMovedFieldId, setJustMovedFieldId] = useState<string | null>(null);
  const justMovedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowRefsMap = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const pendingScrollRef = useRef<string | null>(null);
  // After a keyboard arrow-move, restore focus to the same-direction button on
  // the moved row at its new position so the user can keep moving continuously.
  const pendingFocusRef = useRef<{
    fieldId: string;
    direction: "up" | "down";
  } | null>(null);
  const flipPositionsRef = useRef<Map<string, number>>(new Map());
  const pendingFlipRef = useRef(false);
  const flipRafIdsRef = useRef<number[]>([]);
  const flipTimerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Drag overlay positioning is done imperatively (no per-frame re-render):
  // dragover writes the cursor position to a ref and the overlay's transform
  // is updated inside a single coalesced rAF per frame.
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dragCursorPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragOverRafRef = useRef<number | null>(null);

  const orderedFieldsRef = useRef(orderedFields);
  const draggingFieldIdRef = useRef(draggingFieldId);

  // Stable per-row ref callbacks, cached by fieldId, so the row's ref doesn't
  // churn (null then re-set) on every render.
  const rowRefCallbacksRef = useRef<
    Map<string, (el: HTMLTableRowElement | null) => void>
  >(new Map());

  useSortableFieldRefs({
    draggingFieldId,
    draggingFieldIdRef,
    orderedFields,
    orderedFieldsRef,
  });
  useSyncSortableFields({ draggingFieldIdRef, fields, setOrderedFields });
  useSortableFieldCleanup({
    dragOverRafRef,
    flipRafIdsRef,
    flipTimerIdsRef,
    justMovedTimerRef,
  });
  usePendingFieldScroll({ orderedFields, pendingScrollRef, rowRefsMap });

  const triggerMoveEffect = useCallback((fieldId: string) => {
    if (justMovedTimerRef.current) clearTimeout(justMovedTimerRef.current);
    setJustMovedFieldId(fieldId);
    pendingScrollRef.current = fieldId;
    justMovedTimerRef.current = setTimeout(() => {
      setJustMovedFieldId(null);
    }, JUST_MOVED_HIGHLIGHT_MS);
  }, []);

  // Snapshot row y-positions before a reorder so FLIP can animate the move.
  // Cancels any in-flight FLIP and resets transforms before measuring.
  const capturePositionsForFlip = useCallback(() => {
    for (const id of flipRafIdsRef.current) cancelAnimationFrame(id);
    flipRafIdsRef.current = [];
    for (const id of flipTimerIdsRef.current) clearTimeout(id);
    flipTimerIdsRef.current = [];
    rowRefsMap.current.forEach((el) => {
      el.style.transform = "";
      el.style.transition = "";
    });
    const positions = new Map<string, number>();
    rowRefsMap.current.forEach((el, id) => {
      positions.set(id, el.getBoundingClientRect().top);
    });
    flipPositionsRef.current = positions;
    pendingFlipRef.current = true;
  }, []);

  useFlipAnimation({
    flipPositionsRef,
    flipRafIdsRef,
    flipTimerIdsRef,
    orderedFields,
    pendingFlipRef,
    rowRefsMap,
  });

  // Apply the latest cursor position to the overlay imperatively. Called from a
  // single rAF per frame so a burst of dragover events does no extra layout.
  const positionOverlay = useCallback(() => {
    dragOverRafRef.current = null;
    const pos = dragCursorPosRef.current;
    const el = overlayRef.current;
    if (!pos || !el) return;
    // 12px right of / vertically centred on the cursor (matches the prior
    // CSS `transform: translate(12px, -50%)`, now driven entirely from JS).
    el.style.transform = `translate3d(${pos.x + OVERLAY_CURSOR_OFFSET_PX}px, ${pos.y}px, 0) translateY(-50%)`;
  }, []);

  useDragOverlayPosition({ draggingFieldId, positionOverlay });

  const handleDragStart = useCallback((fieldId: string, e: React.DragEvent) => {
    originalOrderRef.current = [...orderedFieldsRef.current];
    dropSucceededRef.current = false;
    dragCursorPosRef.current = { x: e.clientX, y: e.clientY };
    setDraggingFieldId(fieldId);
    e.dataTransfer.effectAllowed = "move";

    // Suppress the browser's native drag ghost. A preloaded transparent image
    // is honored reliably across browsers (including macOS Chrome, where a
    // detached 1×1 canvas is ignored and a globe icon is shown instead). We
    // render our own fully-opaque overlay for the dragged row.
    if (TRANSPARENT_DRAG_IMAGE) {
      e.dataTransfer.setDragImage(TRANSPARENT_DRAG_IMAGE, 0, 0);
    }
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    const draggingId = draggingFieldIdRef.current;
    if (!draggingId) return;
    // Functional update: never read the mirror to compute the next order, so
    // there's no dependence on passive-effect flush timing.
    setOrderedFields((current) => {
      const sourceIndex = current.findIndex((f) => f.id === draggingId);
      if (sourceIndex === -1 || sourceIndex === index) return current;
      const newOrder = [...current];
      const [item] = newOrder.splice(sourceIndex, 1);
      if (!item) return current;
      newOrder.splice(index, 0, item);
      // Keep the mirror current synchronously so handleDrop reads the final
      // order regardless of when the passive effect runs. Idempotent under
      // StrictMode's double-invoke (same contents each pass).
      orderedFieldsRef.current = newOrder;
      return newOrder;
    });
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      // Track cursor position here — dragover fires reliably with correct
      // coordinates, unlike the drag event on the source element which can fire
      // at (0,0). Write to a ref and coalesce overlay updates into one rAF per
      // frame instead of re-rendering on every event.
      dragCursorPosRef.current = { x: e.clientX, y: e.clientY };
      if (dragOverRafRef.current === null) {
        dragOverRafRef.current = requestAnimationFrame(positionOverlay);
      }
    },
    [positionOverlay],
  );

  const handleDrop = useCallback(() => {
    dropSucceededRef.current = true;
    setDraggingFieldId(null);
    setOrderDrafts({});
    onOrderChange(orderedFieldsRef.current);
  }, [onOrderChange]);

  const handleDragEnd = useCallback(() => {
    if (dragOverRafRef.current !== null) {
      cancelAnimationFrame(dragOverRafRef.current);
      dragOverRafRef.current = null;
    }
    if (!dropSucceededRef.current) {
      setOrderedFields(originalOrderRef.current);
    }
    dropSucceededRef.current = false;
    setDraggingFieldId(null);
  }, []);

  const moveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newOrder = [...orderedFields];
      const prev = newOrder[index - 1];
      const curr = newOrder[index];
      if (!prev || !curr) return;
      capturePositionsForFlip();
      newOrder[index - 1] = curr;
      newOrder[index] = prev;
      pendingFocusRef.current = { fieldId: curr.id, direction: "up" };
      setOrderedFields(newOrder);
      setOrderDrafts({});
      triggerMoveEffect(curr.id);
      onOrderChange(newOrder);
    },
    [orderedFields, triggerMoveEffect, capturePositionsForFlip, onOrderChange],
  );

  const moveDown = useCallback(
    (index: number) => {
      if (index === orderedFields.length - 1) return;
      const newOrder = [...orderedFields];
      const curr = newOrder[index];
      const next = newOrder[index + 1];
      if (!curr || !next) return;
      capturePositionsForFlip();
      newOrder[index] = next;
      newOrder[index + 1] = curr;
      pendingFocusRef.current = { fieldId: curr.id, direction: "down" };
      setOrderedFields(newOrder);
      setOrderDrafts({});
      triggerMoveEffect(curr.id);
      onOrderChange(newOrder);
    },
    [orderedFields, triggerMoveEffect, capturePositionsForFlip, onOrderChange],
  );

  // Restore focus to the moved row's same-direction button after a keyboard
  // arrow-move re-renders the list (see useRestoreFocusAfterMove).
  useRestoreFocusAfterMove({ orderedFields, pendingFocusRef, rowRefsMap });

  const handleOrderInputChange = useCallback(
    (fieldIndex: number, value: string) => {
      setOrderDrafts((prev) => ({ ...prev, [fieldIndex]: value }));
    },
    [],
  );

  const clearOrderDraft = useCallback((fieldIndex: number) => {
    setOrderDrafts((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => Number(key) !== fieldIndex),
      ),
    );
  }, []);

  const handleOrderInputKeyDown = useCallback(
    (e: React.KeyboardEvent<Element>, fieldIndex: number) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!(e.currentTarget instanceof HTMLInputElement)) return;

      const raw = e.currentTarget.value;
      const newOrder = Number.parseInt(raw, 10);

      if (Number.isNaN(newOrder)) {
        clearOrderDraft(fieldIndex);
        return;
      }

      const targetIndex = newOrder - 1;
      const movedFieldId = orderedFields[fieldIndex]?.id;
      const willMove =
        newOrder >= 1 &&
        newOrder <= orderedFields.length &&
        targetIndex !== fieldIndex &&
        !!movedFieldId;

      if (willMove) {
        capturePositionsForFlip();
      }

      setOrderedFields((current) => {
        if (newOrder < 1 || newOrder > current.length) return current;
        if (targetIndex === fieldIndex) return current;
        const updated = [...current];
        const [item] = updated.splice(fieldIndex, 1);
        if (!item) return current;
        updated.splice(targetIndex, 0, item);
        onOrderChange(updated);
        return updated;
      });
      clearOrderDraft(fieldIndex);

      if (willMove && movedFieldId) {
        triggerMoveEffect(movedFieldId);
      }
    },
    [
      clearOrderDraft,
      orderedFields,
      triggerMoveEffect,
      capturePositionsForFlip,
      onOrderChange,
    ],
  );

  const handleOrderInputBlur = useCallback(
    (fieldIndex: number) => {
      clearOrderDraft(fieldIndex);
    },
    [clearOrderDraft],
  );

  const reorderColumns = useMemo<Column<ReorderRowData>[]>(
    () => [
      {
        Header: "Attribute name",
        accessor: "fieldId",
        Cell: ({ row }: CellProps<ReorderRowData>) => {
          const { label } = row.original;
          return (
            <div className={classes.nameCell}>
              <i className={"p-icon--drag " + classes.dragHandle} />
              <span>{label}</span>
            </div>
          );
        },
      },
      {
        Header: "Order",
        accessor: "currentOrder",
        className: classes.orderColumn,
        Cell: ({ row }: CellProps<ReorderRowData>) => {
          const { currentOrder, index, label } = row.original;
          return (
            <div className={classes.orderControls}>
              <Button
                type="button"
                appearance="base"
                className="u-no-margin--bottom has-icon u-no-margin--right"
                disabled={index === orderedFields.length - 1}
                onClick={() => {
                  moveDown(index);
                }}
                aria-label={`Move ${label} down`}
              >
                <Icon name="arrow-down" />
              </Button>
              <Input
                type="number"
                className={classNames(
                  "u-no-margin--bottom",
                  classes.orderInput,
                )}
                min={1}
                max={orderedFields.length}
                value={currentOrder}
                onChange={(e) => {
                  handleOrderInputChange(index, e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  handleOrderInputKeyDown(e, index);
                }}
                onBlur={() => {
                  handleOrderInputBlur(index);
                }}
                aria-label={`Order for ${label}`}
                wrapperClassName={classes.orderInputWrapper}
              />
              <Button
                type="button"
                appearance="base"
                className="u-no-margin--bottom has-icon"
                disabled={index === 0}
                onClick={() => {
                  moveUp(index);
                }}
                aria-label={`Move ${label} up`}
              >
                <Icon name="arrow-up" />
              </Button>
            </div>
          );
        },
      },
    ],
    [
      handleOrderInputBlur,
      handleOrderInputChange,
      handleOrderInputKeyDown,
      moveDown,
      moveUp,
      orderedFields.length,
    ],
  );

  const reorderData = useMemo<ReorderRowData[]>(
    () =>
      orderedFields.map((field, index) => ({
        index,
        fieldId: field.id,
        label: field.label,
        currentOrder: orderDrafts[index] ?? String(index + 1),
      })),
    [orderDrafts, orderedFields],
  );

  // Return a stable ref callback per fieldId so React doesn't tear down and
  // re-attach the row's ref (null then re-set) on every render.
  const getRowRefCallback = useCallback((fieldId: string) => {
    const cache = rowRefCallbacksRef.current;
    let cb = cache.get(fieldId);
    if (!cb) {
      cb = (el: HTMLTableRowElement | null) => {
        if (el) {
          rowRefsMap.current.set(fieldId, el);
        } else {
          rowRefsMap.current.delete(fieldId);
        }
      };
      cache.set(fieldId, cb);
    }
    return cb;
  }, []);

  const getReorderRowProps = useCallback(
    ({
      original,
      index,
    }: Row<ReorderRowData>): Partial<
      TableRowProps & HTMLProps<HTMLTableRowElement>
    > => {
      return {
        draggable: true,
        "data-row-key": original.fieldId,
        ref: getRowRefCallback(original.fieldId),
        onDragStart: (e: React.DragEvent<HTMLTableRowElement>) => {
          handleDragStart(original.fieldId, e);
        },
        onDragEnter: () => {
          handleDragEnter(index);
        },
        onDragOver: handleDragOver,
        onDragEnd: handleDragEnd,
        onDrop: handleDrop,
        className: classNames(
          original.fieldId === draggingFieldId && classes.dragging,
          original.fieldId === justMovedFieldId && classes.justMoved,
        ),
      } as Partial<TableRowProps & HTMLProps<HTMLTableRowElement>>;
    },
    [
      draggingFieldId,
      getRowRefCallback,
      handleDragEnd,
      handleDragEnter,
      handleDragOver,
      handleDragStart,
      handleDrop,
      justMovedFieldId,
    ],
  );

  return (
    <div className={classes.selectedColumns}>
      <p className={classes.selectedColumnsIntro}>
        Review and reorder the columns for your export. Drag rows or use the
        controls to change the order.
      </p>
      <ModularTable
        columns={reorderColumns}
        data={reorderData}
        getRowProps={getReorderRowProps}
        sortable={false}
      />
      {draggingFieldId &&
        createPortal(
          <div ref={overlayRef} className={classes.dragOverlay} aria-hidden>
            <i className="p-icon--drag" />
            <span>
              {orderedFields.find((f) => f.id === draggingFieldId)?.label}
            </span>
            <span className={classes.dragOverlayBadge}>
              {orderedFields.findIndex((f) => f.id === draggingFieldId) + 1}
            </span>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SortableFieldList;
