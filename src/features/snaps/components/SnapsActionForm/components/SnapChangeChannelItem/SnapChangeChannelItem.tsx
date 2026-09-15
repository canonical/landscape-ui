import type { FC } from "react";
import classes from "./SnapChangeChannelItem.module.scss";
import type { MultiSelectItem } from "@canonical/react-components";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";
import MultiSelectField from "@/components/form/MultiSelectField";
import { useTheme } from "@/context/theme";
import classNames from "classnames";
import type { SelectedSnaps } from "../../../../types";

interface SnapChangeChannelItemProps {
  readonly instanceIds: number[];
  readonly selectedSnap: SelectedSnaps;
  readonly onDelete: () => void;
  readonly onItemsUpdate: (items: MultiSelectItem[]) => void;
}

const SnapChangeChannelItem: FC<SnapChangeChannelItemProps> = ({
  instanceIds,
  selectedSnap,
  onDelete,
  onItemsUpdate,
}) => {
  const { isDarkMode } = useTheme();

  const queryParams: SearchSnapsRequest = {
    computer_query: instanceIds.map((id) => `id:${id}`).join(" OR "),
    names: [selectedSnap.name],
    ...mapActionToQueryParams("install"),
  };

  const { items, dropdownHeader } = useMultiSelectSnaps(queryParams);

  return (
    <li className={classes.selectedContainer}>
      <div className={classes.topRow}>
        <div>
          <div className="font-monospace">
            {selectedSnap.name} {selectedSnap.channel}
          </div>
          <div className="u-text--muted p-text--small u-no-margin">
            Installed on{" "}
            {pluralize(selectedSnap.computers.count, ["instance"], "exact")}
          </div>
        </div>
        <Button
          type="button"
          appearance="link"
          className="u-no-margin--bottom u-no-padding--top"
          aria-label={`Delete ${selectedSnap.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      <MultiSelectField
        className={classNames(classes.multiSelect, { "is-paper": !isDarkMode })}
        items={items}
        dropdownHeader={dropdownHeader}
        showDropdownFooter={false}
        variant="condensed"
        placeholder="Version"
        onItemsUpdate={onItemsUpdate}
        selectedItems={selectedSnap.selectedVersions.map(
          (id) => items.find((item) => item.value === id) as MultiSelectItem,
        )}
      />
    </li>
  );
};

export default SnapChangeChannelItem;
