import { useGetInstance } from "@/features/instances";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useParams } from "react-router";
import type { InstalledSnap, SnapAction } from "../../types";
import SnapsActionForm from "../SnapsActionForm";

interface InstanceSnapsActionFormProps {
  readonly action: SnapAction;
  /**
   * The snaps picked in the Snaps tab. Omit for "install", which searches the
   * store for snaps that aren't installed yet.
   */
  readonly installedSnaps?: InstalledSnap[];
}

/**
 * The single-instance Snaps tab's view of the bulk SnapsActionForm. The
 * instance comes from the URL, the selection is fixed to the snaps picked in
 * the table, and the activity can be scheduled like the other per-instance
 * forms (packages, kernel, scripts). Install keeps the bulk behaviour and has
 * never offered scheduling.
 */
const InstanceSnapsActionForm: FC<InstanceSnapsActionFormProps> = ({
  action,
  installedSnaps,
}) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const instanceId = Number(childInstanceId ?? urlInstanceId);

  // Only the title is needed, for the confirmation modal's heading. The
  // page already holds the instance, but under a different query key.
  const { instance } = useGetInstance({ instanceId });

  return (
    <SnapsActionForm
      selectedInstances={[instanceId]}
      action={action}
      fixedSnaps={installedSnaps?.map(({ snap }) => ({
        snap,
        computer_count: 1,
      }))}
      hasDeliveryScheduling={action !== "install"}
      instanceName={instance?.title}
    />
  );
};

export default InstanceSnapsActionForm;
