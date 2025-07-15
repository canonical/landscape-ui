import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import { useReapplyWslProfile } from "@/features/wsl-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { windowsInstance } from "@/tests/mocks/instance";
import type {
  InstanceChild,
  WindowsInstanceWithoutRelation,
} from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WslInstanceReinstallModalProps {
  readonly close: () => void;
  readonly instances: InstanceChild[];
  readonly isOpen: boolean;
  readonly windowsInstance: WindowsInstanceWithoutRelation;
}

const WslInstanceReinstallModal: FC<WslInstanceReinstallModalProps> = ({
  close,
  instances,
  isOpen,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { reapplyWslProfile } = useReapplyWslProfile();

  const [instance] = instances;

  if (!instance) {
    return;
  }

  const title = pluralize(
    instances.length,
    instance.name,
    `${instances.length} instances`,
  );

  const reinstall = async () => {
    try {
      await Promise.all(
        instances.map((i) =>
          reapplyWslProfile({
            name: i.name,
            computer_ids: [windowsInstance.id],
          }),
        ),
      );

      notify.success({
        title: `You have successfully marked ${title} to be reinstalled.`,
        message: pluralize(
          instances.length,
          "An activity has been queued to reinstall it.",
          "Activities have been queued to reinstall them.",
        ),
      });
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
      title={`Reinstall ${title}`}
      confirmButtonLabel="Reinstall"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={false}
      confirmButtonLoading={false}
      confirmationText={`reinstall ${title}`}
      onConfirm={reinstall}
    >
      <p>
        {pluralize(
          instances.length,
          "This will uninstall this instance and create a new one with the same name that is compliant with its profiles.",
          "This will uninstall the selected instances and create new ones with the same names that are compliant with their profiles.",
        )}
      </p>
    </TextConfirmationModal>
  );
};

export default WslInstanceReinstallModal;
