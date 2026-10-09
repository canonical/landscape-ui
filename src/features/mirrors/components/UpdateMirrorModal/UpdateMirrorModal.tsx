import useDebug from "@/hooks/useDebug";
import { CheckboxInput, ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useSyncMirror } from "../../api";
import { useBoolean } from "usehooks-ts";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { useCancelOperation } from "@/features/operations";
import type { Mirror } from "@canonical/landscape-openapi";

interface UpdateMirrorModalProps {
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly isUpdating: boolean;
  readonly mirror: Mirror;
}

const UpdateMirrorModal: FC<UpdateMirrorModalProps> = ({
  close,
  isOpen,
  isUpdating,
  mirror,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = usePageParams();

  const { mutateAsync: syncMirror, isPending: isSyncingMirror } = useSyncMirror(
    mirror.name ?? "",
  );

  const { cancelOperation, isCancelingOperation } = useCancelOperation();

  const { value: ignoreChecksums, toggle: toggleIgnoreChecksums } =
    useBoolean();
  const { value: ignoreSignatures, toggle: toggleIgnoreSignatures } =
    useBoolean();
  const { value: forceUpdate, toggle: toggleForceUpdate } = useBoolean();
  const { value: skipExistingPackages, toggle: toggleSkipExistingPackages } =
    useBoolean();

  if (!isOpen) {
    return null;
  }

  const cancelUpdate = async () => {
    try {
      await cancelOperation(mirror.lastOperation ?? "");
    } catch (error) {
      debug(error);
    }
  };

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
        title: `You have marked ${mirror.displayName} to be updated`,
        message: "An activity has been queued to update the mirror contents.",
      });
    } catch (error) {
      debug(error);
    }
  };

  if (isUpdating) {
    return (
      <ConfirmationModal
        title={`${mirror.displayName} is already updating`}
        confirmButtonLabel="Cancel update and continue"
        confirmButtonAppearance="positive"
        confirmButtonLoading={isCancelingOperation}
        onConfirm={cancelUpdate}
        close={close}
        renderInPortal
      >
        <p className="u-margin--bottom">
          You already have an ongoing mirror update. You can only have one
          active update at a time.
          <br />
          <br />
          <strong>
            To start a new update, you must cancel the current one.
          </strong>
        </p>
      </ConfirmationModal>
    );
  }

  return (
    <ConfirmationModal
      confirmButtonLabel="Update mirror"
      onConfirm={tryUpdateMirror}
      confirmButtonAppearance="positive"
      title={`Update ${mirror.displayName}`}
      close={close}
      confirmButtonLoading={isSyncingMirror}
      renderInPortal
    >
      <p className="u-margin--bottom">
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
