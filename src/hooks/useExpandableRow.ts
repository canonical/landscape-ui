import { useCallback, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

export function useExpandableRow<T extends HTMLElement>() {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [expandedColumnId, setExpandedColumnId] = useState<string | null>(null);
  const tableRowsRef = useRef<T[]>([]);

  const getTableRowsRef = useCallback((instance: HTMLDivElement | null) => {
    if (!instance) {
      return;
    }
    tableRowsRef.current = [...instance.querySelectorAll<T>("tbody tr")];
  }, []);

  useOnClickOutside(
    {
      current:
        expandedRowIndex == null
          ? null
          : tableRowsRef.current[expandedRowIndex],
    },
    () => {
      setExpandedRowIndex(null);
    },
  );

  const handleExpand = useCallback((index: number, id?: string) => {
    if (index === expandedRowIndex && id === expandedColumnId) {
      setExpandedRowIndex(null);
      setExpandedColumnId(null);
    } else {
      setExpandedRowIndex(index);
      setExpandedColumnId(id ?? null);
    }
  }, []);

  return {
    expandedRowIndex,
    expandedColumnId,
    getTableRowsRef,
    handleExpand,
  };
}
