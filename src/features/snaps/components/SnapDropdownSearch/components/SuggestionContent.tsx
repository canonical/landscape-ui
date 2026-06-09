import BoldSubstring from "@/components/form/BoldSubstring";
import LoadingState from "@/components/layout/LoadingState";
import classNames from "classnames";
import type { GetItemPropsOptions } from "downshift";
import type { FC } from "react";
import type { AvailableSnap, SelectedSnaps } from "../../../types";
import AvailableSnapDetails from "../../AvailableSnapDetails";
import classes from "../SnapDropdownSearch.module.scss";

interface SuggestionContentProps {
  readonly toBeConfirmedItem: AvailableSnap | null | undefined;
  readonly instanceId: number;
  readonly isFetching: boolean;
  readonly suggestions: AvailableSnap[];
  readonly search: string;
  readonly highlightedIndex: number | null;
  readonly getItemProps: <Options>(
    options: GetItemPropsOptions<AvailableSnap> & Options,
  ) => object;
  readonly handleAddToSelectedItems: (item: SelectedSnaps) => void;
  readonly handleDeleteToBeConfirmedItem: () => void;
}

const SuggestionContent: FC<SuggestionContentProps> = ({
  toBeConfirmedItem,
  instanceId,
  isFetching,
  suggestions,
  search,
  highlightedIndex,
  getItemProps,
  handleAddToSelectedItems,
  handleDeleteToBeConfirmedItem,
}) => {
  if (toBeConfirmedItem && instanceId) {
    return (
      <AvailableSnapDetails
        handleAddToSelectedItems={handleAddToSelectedItems}
        handleDeleteToBeConfirmedItem={handleDeleteToBeConfirmedItem}
        name={toBeConfirmedItem.name}
        instanceId={instanceId}
        key={toBeConfirmedItem["snap-id"]}
      />
    );
  }

  if (isFetching) {
    return <LoadingState />;
  }

  return suggestions.map((item: AvailableSnap, index: number) => (
    <li
      className={classNames("p-list__item", classes.pointer, {
        [classes.highlighted]: highlightedIndex === index,
      })}
      key={item["snap-id"]}
      {...getItemProps({ item, index })}
    >
      <div className="u-truncate" data-testid="dropdownElement">
        <BoldSubstring text={item.name} substring={search} />
      </div>
      <small className="u-text-muted">{item.snap.publisher["display-name"]}</small>
    </li>
  ));
};

export default SuggestionContent;
