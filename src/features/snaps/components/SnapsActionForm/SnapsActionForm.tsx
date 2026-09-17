import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { type FC, useState } from "react";
import { capitalize, pluralize } from "@/utils/_helpers";
import type { SnapAction, InstalledSnapWithCount } from "../../types";
import SnapDropdownSearch from "./components/SnapBulkSearch";
import SnapChangeChannelItem from "./components/SnapChangeChannelItem";
import classes from "./SnapsActionForm.module.scss";
import classNames from "classnames";
import SnapInstalledItem from "./components/SnapInstalledItem";
import SnapAvailableItem from "./components/SnapAvailableItem";
import { useSnapAction } from "../../api";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useNotify from "@/hooks/useNotify";

interface SnapsActionFormProps {
  readonly selectedInstances: number[];
  readonly action: SnapAction;
}

const SnapsActionForm: FC<SnapsActionFormProps> = ({
  selectedInstances,
  action,
}) => {
  const [selectedItems, setSelectedItems] = useState<InstalledSnapWithCount[]>(
    [],
  );

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction, isSnapActionPending } = useSnapAction();

  const mapActionToVerbs = () => {
    switch (action) {
      case "install":
        return "install";
      case "remove":
        return "uninstall";
      case "hold":
        return "hold";
      case "unhold":
        return "unhold";
      case "refresh":
        return "refresh";
      case "changeChannel":
        return "change channel";
    }
  };

  const verb = mapActionToVerbs();
  const capitalizedVerb = capitalize(verb);
  const hasNoSelectedSnaps = selectedItems.length === 0;

  const getSubmitText = () => {
    if (action === "changeChannel") {
      return capitalizedVerb;
    }

    if (hasNoSelectedSnaps) {
      return `${capitalizedVerb} snaps`;
    }

    return `${capitalizedVerb} ${pluralize(selectedItems.length, ["snap"], "exact")}`;
  };

  const onSubmit = async () => {
    if (hasNoSelectedSnaps) {
      return;
    }

    try {
      await snapAction({
        action: action,
        computer_ids: selectedInstances,
        snaps: selectedItems.map((item) => ({ name: item.snap.name })),
      });

      closeSidePanel();

      notify.success({
        title: `Snaps successfully set to ${verb}`,
        message: `You can track the progress in the Activities page.`,
      });
    } catch (error) {
      debug(error);
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
        >
          Snaps to {verb}
        </div>

        {hasNoSelectedSnaps ? (
          <div>No snaps have been added yet.</div>
        ) : (
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
                  isUnhold={action === "unhold"}
                  selectedInstances={selectedInstances.length}
                />
              );
            })}
          </ul>
        )}
      </div>

      <SidePanelFormButtons
        submitButtonText={getSubmitText()}
        submitButtonAppearance="positive"
        submitButtonLoading={isSnapActionPending}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default SnapsActionForm;
