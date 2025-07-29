import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useDeleteAutoinstallFile } from "../../api";
import type { AutoinstallFile } from "../../types";

interface AutoinstallFileDeleteModalProps {
  readonly autoinstallFile: AutoinstallFile;
  readonly close: () => void;
}

const AutoinstallFileDeleteModal: FC<AutoinstallFileDeleteModalProps> = ({
  autoinstallFile,
  close,
}) => {
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { deleteAutoinstallFile } = useDeleteAutoinstallFile();

  const handleConfirm = async () => {
    await deleteAutoinstallFile({ id: autoinstallFile.id });

    close();
    closeSidePanel();

    notify.success({
      message: `The autoinstall file ${autoinstallFile.filename} has been permanently removed. All Employee accounts previously relying on it through identity provider group assignments will now fall back to the default autoinstall file.`,
      title: `You have successfully removed ${autoinstallFile.filename} autoinstall file.`,
    });
  };

  return (
    <ConfirmationModal
      close={close}
      confirmButtonAppearance="negative"
      confirmButtonLabel="Remove"
      onConfirm={handleConfirm}
      title={`Remove ${autoinstallFile.filename}, autoinstall file`}
    >
      <p>
        You are about to remove {autoinstallFile.filename}, an autoinstall file.
        This action is irreversible. All Employee accounts previously assigned
        this file via identity provider will instead use the default autoinstall
        file.
      </p>
    </ConfirmationModal>
  );
};

export default AutoinstallFileDeleteModal;
