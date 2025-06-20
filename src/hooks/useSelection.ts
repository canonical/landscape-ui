import { useState } from "react";

const useSelection = <T>(items: T[], isGettingItems?: boolean) => {
  const [previousItems, setPreviousItems] = useState<T[]>(items);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  if (items !== previousItems && !isGettingItems) {
    setSelectedItems([]);
    setPreviousItems(items);
  }

  return {
    selectedItems,
    setSelectedItems,
  };
};

export default useSelection;
