import { useRef, useState, useCallback } from "react";
import { useOnClickOutside } from "usehooks-ts";

export function useExpandableRow<T extends HTMLElement>() {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
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

  const handleExpand = useCallback((index: number) => {
    setExpandedRowIndex((prev) => (prev === index ? null : index));
  }, []);

  return {
    expandedRowIndex,
    getTableRowsRef,
    handleExpand,
  };
}
