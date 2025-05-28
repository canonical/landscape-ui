import { useCallback, useRef } from "react";

export function useCloseTableFilterMenu() {
  const rootRef = useRef<HTMLDivElement>(null);

  const handleCloseMenu = useCallback(() => {
    const btn = rootRef.current?.querySelector(
      ".p-contextual-menu__toggle",
    ) as HTMLButtonElement;
    btn?.click();
  }, []);

  return { rootRef, handleCloseMenu };
}
