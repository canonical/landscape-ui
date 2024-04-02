import { useSnaps } from "@/hooks/useSnaps";
import { FC, useState } from "react";
import DropdownSearch from "@/components/form/DropdownSearch/DropdownSearch";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import { AvailableSnap, SelectedSnaps } from "@/types/Snap";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";

interface InstallSnapsProps {
  instanceId: number;
}

const InstallSnaps: FC<InstallSnapsProps> = ({ instanceId }) => {
  const [selectedSnaps, setSelectedSnaps] = useState<
    AvailableSnap[] | SelectedSnaps[]
  >([]);

  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const [confirming, setConfirming] = useState(false);
  const debug = useDebug();
  const { getAvailableSnapInfo, getAvailableSnaps, snapsActionQuery } =
    useSnaps();
  const { mutateAsync: installSnaps, isLoading: installSnapsLoading } =
    snapsActionQuery;

  const handleSubmit = async () => {
    try {
      await installSnaps({
        computer_ids: [instanceId],
        snaps: (selectedSnaps as SelectedSnaps[]).map((snap) => ({
          name: snap.name,
          channel: snap.channel,
          revision: snap.revision,
        })),
        action: "install",
      });
      closeSidePanel();
      notify.success({
        message: `You queued ${selectedSnaps.length === 1 ? `snap ${selectedSnaps[0].name}` : `${selectedSnaps.length} snaps`} to be installed.`,
      });
      setSelectedSnaps([]);
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      <DropdownSearch
        itemType="snap"
        selectedItems={selectedSnaps}
        setSelectedItems={(items) => setSelectedSnaps(items)}
        getDropdownInfo={(query: string) =>
          getAvailableSnaps(
            {
              instance_id: instanceId,
              query: query,
            },
            {
              enabled: query.length > 2,
            },
          )
        }
        getItemInfo={(query: string) =>
          getAvailableSnapInfo({
            instance_id: instanceId,
            name: query,
          })
        }
        addConfirmation
        setConfirming={(item) => setConfirming(item)}
        instanceId={instanceId}
      />
      <SidePanelFormButtons
        disabled={
          selectedSnaps.length === 0 || confirming || installSnapsLoading
        }
        submitButtonText="Install snaps"
        bottomSticky
        removeButtonMargin
        submitButtonAppearance="positive"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default InstallSnaps;
