import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { UrlParams } from "@/types/UrlParams";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnaps } from "../../hooks";
import { SelectedSnaps } from "../../types";
import SnapDropdownSearch from "../SnapDropdownSearch";

const InstallSnaps: FC = () => {
  const [selectedSnaps, setSelectedSnaps] = useState<SelectedSnaps[]>([]);
  const [confirming, setConfirming] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapsActionQuery } = useSnaps();
  const { instanceId: urlInstanceId } = useParams<UrlParams>();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: installSnaps, isPending: installSnapsLoading } =
    snapsActionQuery;

  const handleSubmit = async () => {
    try {
      await installSnaps({
        computer_ids: [instanceId],
        snaps: selectedSnaps.map((snap) => ({
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
      <SnapDropdownSearch
        selectedItems={selectedSnaps}
        setSelectedItems={(items) => setSelectedSnaps(items)}
        setConfirming={(item) => setConfirming(item)}
      />
      <SidePanelFormButtons
        submitButtonDisabled={
          selectedSnaps.length === 0 || confirming || installSnapsLoading
        }
        cancelButtonDisabled={installSnapsLoading}
        submitButtonText="Install snaps"
        submitButtonAppearance="positive"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default InstallSnaps;
