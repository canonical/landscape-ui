import { useState } from "react";
import useSidePanel from "./useSidePanel";

const useSelection = <T>() => {
  const { closeSidePanel } = useSidePanel();

  const [previousItems, setPreviousItems] = useState<T[]>([]);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const validate = (items: T[], isGettingItems: boolean) => {
    if (items != previousItems) {
      closeSidePanel();

      if (!isGettingItems) {
        setSelectedItems([]);
        setPreviousItems(items);
      }
    }
  };

  return {
    validate,
    selectedItems,
    setSelectedItems,
  };
};

export default useSelection;
