import { useState } from "react";
import useSidePanel from "./useSidePanel";

const useSelection = <T>(items: T[], isGettingItems: boolean) => {
  const { closeSidePanel } = useSidePanel();

  const [previousItems, setPreviousItems] = useState<T[]>([]);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  if (items != previousItems) {
    closeSidePanel();

    if (!isGettingItems) {
      setSelectedItems([]);
      setPreviousItems(items);
    }
  }

  return {
    selectedItems,
    setSelectedItems,
  };
};

export default useSelection;
