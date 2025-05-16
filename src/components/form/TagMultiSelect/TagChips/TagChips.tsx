import type { FC, RefObject } from "react";
import { useEffect } from "react";
import { useEventListener } from "usehooks-ts";
import { Chip } from "@canonical/react-components";

interface TagChipsProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onDismiss: (value: string) => void;
  onOverflowingItemsAmountChange: (amount: number) => void;
  tagData: string[];
}

const TagChips: FC<TagChipsProps> = ({
  containerRef,
  onDismiss,
  onOverflowingItemsAmountChange,
  tagData,
}) => {
  const overflowingItemsCount = () => {
    if (!containerRef.current) {
      return;
    }

    const spans =
      containerRef.current.querySelectorAll<HTMLSpanElement>(`span.p-chip`);

    onOverflowingItemsAmountChange(
      Array.from(spans).filter(
        ({ offsetHeight, offsetTop }) => offsetTop > offsetHeight,
      ).length,
    );
  };

  useEventListener("resize", overflowingItemsCount);

  useEffect(() => {
    overflowingItemsCount();
  }, [tagData.length]);

  return tagData.map((tag) => (
    <Chip
      key={tag}
      value={tag}
      onDismiss={() => {
        onDismiss(tag);
      }}
    />
  ));
};

export default TagChips;
