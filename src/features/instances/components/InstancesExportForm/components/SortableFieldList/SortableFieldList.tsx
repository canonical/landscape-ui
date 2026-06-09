import { Button, Icon, Input, ModularTable } from "@canonical/react-components";
import classNames from "classnames";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type HTMLProps,
} from "react";
import { createPortal } from "react-dom";
import type { CellProps, Column, Row, TableRowProps } from "react-table";
import classes from "./SortableFieldList.module.scss";
import type { ExportField } from "../../types";

interface ReorderRowData extends Record<string, unknown> {
  index: number;
  fieldId: string;
  label: string;
  currentOrder: string;
}

// Horizontal gap between the cursor and the drag overlay card, in pixels.
const OVERLAY_CURSOR_OFFSET_PX = 12;
const JUST_MOVED_HIGHLIGHT_MS = 1500;
const FLIP_TRANSITION_CLEANUP_MS = 300;

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

  // Live mirrors of state read inside stable drag handlers, so those handlers
  // (and therefore getReorderRowProps) keep a constant identity across renders.
  // The passive effect is a backstop for the general case; the drag path keeps
  // orderedFieldsRef current synchronously inside the state updater (see
  // handleDragEnter) so handleDrop never depends on passive-effect flush timing.
  const orderedFieldsRef = useRef(orderedFields);
  const draggingFieldIdRef = useRef(draggingFieldId);
  useEffect(() => {
    orderedFieldsRef.current = orderedFields;
    draggingFieldIdRef.current = draggingFieldId;
  });

  // Stable per-row ref callbacks, cached by fieldId, so the row's ref doesn't
  // churn (null then re-set) on every render.
  const rowRefCallbacksRef = useRef<
    Map<string, (el: HTMLTableRowElement | null) => void>
  >(new Map());

  // Keep internal order in sync with the fields prop. Seeding state once with
  // useState(() => fields) ignores later prop changes; this re-syncs when the
  // parent updates the selection. Skip while a drag is active: an unrelated
  // parent re-render mid-drag must not clobber the live handleDragEnter preview
  // with the (stale) prop order. (draggingFieldIdRef is synced by the effect
  // above, which is declared — and therefore runs — before this one.)
  useEffect(() => {
    if (draggingFieldIdRef.current) return;
    // Intentional prop->state sync: setState in this effect is the deliberate
    // mechanism, not an accident. Reading draggingFieldIdRef during render (to
    // avoid the effect) would instead trip react-hooks/refs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedFields(fields);
  }, [fields]);

  // Cleanup animation resources on unmount.
  useEffect(() => {
    return () => {
      if (justMovedTimerRef.current) clearTimeout(justMovedTimerRef.current);
      if (dragOverRafRef.current !== null) {
        cancelAnimationFrame(dragOverRafRef.current);
      }
      for (const id of flipRafIdsRef.current) cancelAnimationFrame(id);
      for (const id of flipTimerIdsRef.current) clearTimeout(id);
    };
  }, []);

  // After orderedFields updates, scroll the pending field into view.
  // Delayed by 270ms so it fires after the FLIP animation (250ms) completes —
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
    return () => { clearTimeout(timer); };
  }, [orderedFields]);

  const triggerMoveEffect = useCallback((fieldId: string) => {
    if (justMovedTimerRef.current) clearTimeout(justMovedTimerRef.current);
    setJustMovedFieldId(fieldId);
    pendingScrollRef.current = fieldId;
    justMovedTimerRef.current = setTimeout(
      () => { setJustMovedFieldId(null); },
      JUST_MOVED_HIGHLIGHT_MS,
    );
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

  // FLIP animation: after orderedFields changes, animate rows from their old
  // viewport positions to their new ones. Only runs when pendingFlipRef is set
  // (i.e. arrow/number moves — NOT drag reorders).
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
  }, [orderedFields]);

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

  // Position the overlay as soon as it mounts, using the cursor position
  // captured at drag start, so it doesn't flash at the top-left before the
  // first dragover fires.
  useLayoutEffect(() => {
    if (draggingFieldId) positionOverlay();
  }, [draggingFieldId, positionOverlay]);

  const handleDragStart = useCallback(
    (fieldId: string, e: React.DragEvent) => {
      originalOrderRef.current = [...orderedFieldsRef.current];
      dropSucceededRef.current = false;
      dragCursorPosRef.current = { x: e.clientX, y: e.clientY };
      setDraggingFieldId(fieldId);
      e.dataTransfer.effectAllowed = "move";

      // Replace the browser's native (always semi-transparent) drag ghost with a
      // 1×1 transparent canvas. We render our own fully-opaque overlay instead.
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      e.dataTransfer.setDragImage(canvas, 0, 0);
    },
    [],
  );

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
      setOrderedFields(newOrder);
      setOrderDrafts({});
      triggerMoveEffect(curr.id);
      onOrderChange(newOrder);
    },
    [orderedFields, triggerMoveEffect, capturePositionsForFlip, onOrderChange],
  );

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
                onClick={() => { moveDown(index); }}
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
                onChange={(e) => { handleOrderInputChange(index, e.target.value); }}
                onKeyDown={(e: React.KeyboardEvent) =>
                  { handleOrderInputKeyDown(e, index); }
                }
                onBlur={() => { handleOrderInputBlur(index); }}
                aria-label={`Order for ${label}`}
                wrapperClassName={classes.orderInputWrapper}
              />
              <Button
                type="button"
                appearance="base"
                className="u-no-margin--bottom has-icon"
                disabled={index === 0}
                onClick={() => { moveUp(index); }}
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
