import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { InstanceChild } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import { useUninstallWslInstances } from "../../api";

interface WslInstanceUninstallModalProps {
  readonly close: () => void;
  readonly instances: InstanceChild[];
  readonly isOpen: boolean;
  readonly parentId: number;
  readonly onSuccess?: () => void;
}

const WslInstanceUninstallModal: FC<WslInstanceUninstallModalProps> = ({
  close,
  instances,
  isOpen,
  onSuccess,
  parentId,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { isUninstallingWslInstances, uninstallWslInstances } =
    useUninstallWslInstances();

  const [instance] = instances;

  if (!instance) {
    return;
  }

  const title = pluralize(
    instances.length,
    instance.name,
    `${instances.length} instances`,
  );

  const uninstall = async () => {
    try {
      await uninstallWslInstances({
        parent_id: parentId,
        child_names: instances.map(({ name }) => name),
      });

      notify.success({
        title: `You have successfully marked ${title} to be uninstalled.`,
        message: pluralize(
          instances.length,
          "An activity has been queued to uninstall it.",
          "Activities have been queued to uninstall them.",
        ),
      });

      onSuccess?.();
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      isOpen={isOpen}
      close={close}
      title={`Uninstall ${title}`}
      confirmButtonLabel="Uninstall"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={isUninstallingWslInstances}
      confirmButtonLoading={isUninstallingWslInstances}
      confirmationText={`uninstall ${title}`}
      onConfirm={uninstall}
    >
      <p>
        {pluralize(
          instances.length,
          "This will permanently uninstall this instance from the Windows host machine and remove it from Landscape.",
          "This will permanently uninstall the selected instances from the Windows host machine and remove them from Landscape.",
        )}
      </p>
    </TextConfirmationModal>
  );
};

export default WslInstanceUninstallModal;
