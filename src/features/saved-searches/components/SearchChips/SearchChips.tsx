import { FC, RefObject, useEffect } from "react";
import { useEventListener } from "usehooks-ts";
import { Chip } from "@canonical/react-components";
import { ExtendedSearchAndFilterChip } from "../../types";

interface SearchChipsProps {
  containerRef: RefObject<HTMLDivElement>;
  onDismiss: (value: string) => void;
  onOverflowingItemsAmountChange: (amount: number) => void;
  searchData: ExtendedSearchAndFilterChip[];
}

const SearchChips: FC<SearchChipsProps> = ({
  containerRef,
  onDismiss,
  onOverflowingItemsAmountChange,
  searchData,
}) => {
  const overflowingItemsCount = () => {
    if (!containerRef.current) {
      return;
    }

    // eslint-disable-next-line no-undef
    const spans: NodeListOf<HTMLSpanElement> =
      containerRef.current.querySelectorAll(`span.p-chip`);

    onOverflowingItemsAmountChange(
      Array.from(spans).filter(
        ({ offsetHeight, offsetTop }) => offsetTop > offsetHeight,
      ).length,
    );
  };

  useEventListener("resize", overflowingItemsCount);

  useEffect(() => {
    overflowingItemsCount();
  }, [searchData.length]);

  const getChipLabel = (chip: ExtendedSearchAndFilterChip) => {
    if (chip.title) {
      return chip.title;
    }

    if (chip.quoteValue) {
      return `'${chip.value}'`;
    }

    return chip.value;
  };

  return searchData.map((chip) => (
    <Chip
      key={chip.value}
      value={getChipLabel(chip)}
      lead={chip.lead}
      onDismiss={() => onDismiss(chip.value)}
    />
  ));
};

export default SearchChips;
