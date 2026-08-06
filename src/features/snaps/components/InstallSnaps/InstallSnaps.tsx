import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { getSelectionLabel } from "@/utils/_helpers";
import type { FC } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useSnapAction } from "../../api";
import type { SelectedSnaps } from "../../types";
import SnapDropdownSearch from "../SnapDropdownSearch";
import { Notification } from "@canonical/react-components";

const InstallSnaps: FC = () => {
  const [selectedSnaps, setSelectedSnaps] = useState<SelectedSnaps[]>([]);
  const [showNoSnapsError, setShowNoSnapsError] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction, isSnapActionPending: installSnapsLoading } =
    useSnapAction();
  const { instanceId: urlInstanceId } = useParams<UrlParams>();

  const instanceId = Number(urlInstanceId);

  const handleSubmit = async () => {
    if (confirming || installSnapsLoading) {
      return;
    }

    if (selectedSnaps.length === 0) {
      setShowNoSnapsError(true);
      return;
    }
    setShowNoSnapsError(false);

    try {
      await snapAction({
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
        message: `You queued ${getSelectionLabel(
          selectedSnaps,
          (snap) => `snap ${snap.name}`,
          `snaps`,
        )} to be installed.`,
      });
      setSelectedSnaps([]);
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      {showNoSnapsError && (
        <Notification severity="caution" title="No snaps selected">
          Select at least one snap to install.
        </Notification>
      )}
      <SnapDropdownSearch
        selectedItems={selectedSnaps}
        setSelectedItems={(items) => {
          setSelectedSnaps(items);
          setShowNoSnapsError(false);
        }}
        setConfirming={(item) => {
          setConfirming(item);
        }}
      />
      <SidePanelFormButtons
        submitButtonLoading={installSnapsLoading}
        submitButtonDisabled={confirming}
        cancelButtonDisabled={installSnapsLoading}
        submitButtonText="Install snaps"
        submitButtonAppearance="positive"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default InstallSnaps;
