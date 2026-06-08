import { useCallback, useEffect, useRef, useState } from "react";

interface ExpandedCell {
  rowIndex: number;
  columnId: string | null;
}

export function useExpandableRow<T extends HTMLElement>() {
  // A single piece of state keeps the row/column coordinates atomic, so the
  // stable `handleExpand` can toggle a re-clicked cell closed via a functional
  // update without reading stale values.
  const [expanded, setExpanded] = useState<ExpandedCell | null>(null);
  const tableRowsRef = useRef<T[]>([]);

  const expandedRowIndex = expanded?.rowIndex ?? null;
  const expandedColumnId = expanded?.columnId ?? null;

  const getTableRowsRef = useCallback((instance: HTMLElement | null) => {
    if (!instance) {
      return;
    }
    tableRowsRef.current = [...instance.querySelectorAll<T>("tbody tr")];
  }, []);

  const collapse = useCallback(() => {
    setExpanded(null);
  }, []);

  // Collapse on any click that lands outside the expanded region. When a
  // specific column is expanded its cell carries the `expandedCell` class and
  // hosts the pop-over, so that cell is the boundary: clicking anywhere else —
  // including another expandable cell in the same row — collapses it. Tables
  // that expand a whole row (no column id) fall back to the row itself. The
  // boundary is resolved at event time so it reflects the committed DOM.
  useEffect(() => {
    if (expandedRowIndex == null) {
      return;
    }

    const handlePointerDown = (event: Event) => {
      const row = tableRowsRef.current[expandedRowIndex];

      // The expanded row is gone (e.g. the data changed underneath us), so the
      // coordinates are stale — drop them rather than leaving a phantom cell
      // expanded at the same index.
      if (!row) {
        setExpanded(null);
        return;
      }

      const boundary = expandedColumnId
        ? (row.querySelector<HTMLElement>(".expandedCell") ?? row)
        : row;

      if (!boundary.contains(event.target as Node)) {
        setExpanded(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [expandedRowIndex, expandedColumnId]);

  const handleExpand = useCallback((index: number, id?: string) => {
    const columnId = id ?? null;

    setExpanded((current) =>
      current && current.rowIndex === index && current.columnId === columnId
        ? null
        : { rowIndex: index, columnId },
    );
  }, []);

  return {
    expandedRowIndex,
    expandedColumnId,
    getTableRowsRef,
    handleExpand,
    collapse,
  };
}
