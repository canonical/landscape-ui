import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useParams } from "react-router";
import type { InstalledSnap, SnapAction } from "../../types";
import SnapsActionForm from "../SnapsActionForm";

interface InstanceSnapsActionFormProps {
  readonly action: SnapAction;
  /** Names the instance in the confirmation modal's title. */
  readonly instanceTitle: string;
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
  instanceTitle,
  installedSnaps,
}) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();

  // The side panel swaps its body without remounting, so opening another
  // action while one is open would keep the previous form's state, including
  // its snaps. The key remounts the form for a new action or selection.
  const formKey = [
    action,
    ...(installedSnaps?.map(({ snap }) => snap.id) ?? []),
  ].join(":");

  return (
    <SnapsActionForm
      key={formKey}
      selectedInstances={[Number(childInstanceId ?? urlInstanceId)]}
      action={action}
      fixedSnaps={installedSnaps?.map(({ snap }) => ({
        snap,
        computer_count: 1,
      }))}
      hasDeliveryScheduling={action !== "install"}
      instanceName={instanceTitle}
    />
  );
};

export default InstanceSnapsActionForm;
