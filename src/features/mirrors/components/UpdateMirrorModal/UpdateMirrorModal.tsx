import useDebug from "@/hooks/useDebug";
import { CheckboxInput, ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useSyncMirror } from "../../api";
import { useBoolean } from "usehooks-ts";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";

interface UpdateMirrorModalProps {
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly mirrorDisplayName: string;
  readonly mirrorName: string;
}

const UpdateMirrorModal: FC<UpdateMirrorModalProps> = ({
  close,
  isOpen,
  mirrorDisplayName,
  mirrorName,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = usePageParams();

  const { mutateAsync: syncMirror, isPending: isSyncingMirror } =
    useSyncMirror(mirrorName);

  const { value: ignoreChecksums, toggle: toggleIgnoreChecksums } =
    useBoolean();
  const { value: ignoreSignatures, toggle: toggleIgnoreSignatures } =
    useBoolean();
  const { value: forceUpdate, toggle: toggleForceUpdate } = useBoolean();
  const { value: skipExistingPackages, toggle: toggleSkipExistingPackages } =
    useBoolean();

  if (!isOpen) {
    return;
  }

  const tryUpdateMirror = async () => {
    try {
      await syncMirror({
        ignoreChecksums,
        ignoreSignatures,
        forceUpdate,
        skipExistingPackages,
      });

      closeSidePanel();
      close();

      notify.success({
        title: `You have marked ${mirrorDisplayName} to be updated.`,
        message: "An activity has been queued to update the mirror contents.",
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <ConfirmationModal
      confirmButtonLabel="Update mirror"
      onConfirm={tryUpdateMirror}
      confirmButtonAppearance="positive"
      title={`Update ${mirrorDisplayName}`}
      close={close}
      confirmButtonLoading={isSyncingMirror}
      renderInPortal
    >
      <p>
        By updating this mirror you will synchronize the local copy of that
        repository with the remote source.
      </p>
      <CheckboxInput
        label="Ignore checksum mismatches"
        onChange={toggleIgnoreChecksums}
        checked={ignoreChecksums}
      />
      <CheckboxInput
        label="Ignore signature verification failures"
        onChange={toggleIgnoreSignatures}
        checked={ignoreSignatures}
      />
      <CheckboxInput
        label="Force a full update"
        onChange={toggleForceUpdate}
        checked={forceUpdate}
      />
      <CheckboxInput
        label="Skip downloading packages that already exist"
        onChange={toggleSkipExistingPackages}
        checked={skipExistingPackages && !forceUpdate}
        disabled={forceUpdate}
      />
    </ConfirmationModal>
  );
};

export default UpdateMirrorModal;
