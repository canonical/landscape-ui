import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, useState } from "react";
import type { SnapAction, SelectedSnaps } from "../../types";
import SnapDropdownSearch from "./components/SnapBulkSearch";
import SnapChangeChannelItem from "./components/SnapChangeChannelItem";
import classes from "./SnapsActionForm.module.scss";
import classNames from "classnames";
import SnapInstalledItem from "./components/SnapInstalledItem";
import SnapAvailableItem from "./components/SnapAvailableItem/SnapAvailableItem";

interface SnapsActionFormProps {
  readonly selectedInstances: number[];
  readonly action: SnapAction;
}

const SnapsActionForm: FC<SnapsActionFormProps> = ({
  selectedInstances,
  action,
}) => {
  const [selectedItems, setSelectedItems] = useState<SelectedSnaps[]>([]);

  const getHeaderVerb = () => {
    switch (action) {
      case "install":
        return "install";
      case "remove":
        return "uninstall";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      default:
        return "change channel";
    }
  };

  return (
    <>
      <div className={classes.container}>
        <SnapDropdownSearch
          instanceIds={selectedInstances}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          action={action}
        />

        <div
          className={classNames(
            "p-text--small-caps u-no-padding",
            classes.header,
          )}
        >{`Snaps to ${getHeaderVerb()}`}</div>

        {selectedItems.length ? (
          <ul className="p-list p-autocomplete__result-list u-no-margin--bottom">
            {selectedItems.map((selectedSnap, index) => {
              const handleDelete = () => {
                setSelectedItems(selectedItems.toSpliced(index, 1));
              };

              if (action === "changeChannel") {
                return (
                  <SnapChangeChannelItem
                    key={`${selectedSnap.snap.id}${index}`}
                    selectedSnap={selectedSnap}
                    onDelete={handleDelete}
                    instanceIds={selectedInstances}
                    onItemsUpdate={() => {
                      // Update selected snaps
                    }}
                  />
                );
              }
              if (action === "install") {
                return (
                  <SnapAvailableItem
                    key={`${selectedSnap.snap.id}${index}`}
                    selectedSnap={selectedSnap}
                    onDelete={handleDelete}
                  />
                );
              }
              return (
                <SnapInstalledItem
                  key={`${selectedSnap.snap.id}${index}`}
                  selectedSnap={selectedSnap}
                  onDelete={handleDelete}
                />
              );
            })}
          </ul>
        ) : (
          <div>No snaps have been added yet.</div>
        )}
      </div>

      <SidePanelFormButtons
        submitButtonDisabled={!selectedItems.length}
        submitButtonText="Next"
        submitButtonAppearance="positive"
        onSubmit={() => {
          // Handle form submission here
        }}
      />
    </>
  );
};

export default SnapsActionForm;
