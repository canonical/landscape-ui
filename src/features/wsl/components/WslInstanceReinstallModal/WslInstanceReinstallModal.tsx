import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WslInstanceReinstallModalProps {
  readonly close: () => void;
  readonly instances: WslInstanceWithoutRelation[];
  readonly isOpen: boolean;
}

const WslInstanceReinstallModal: FC<WslInstanceReinstallModalProps> = ({
  close,
  instances,
  isOpen,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const [instance] = instances;

  if (!instance) {
    return;
  }

  const title = pluralize(
    instances.length,
    instance.title,
    `${instances.length} instances`,
  );

  const reinstall = async () => {
    try {
      throw new Error("This feature has not been implemented yet.");

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
