import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { WindowsInstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WindowsInstanceMakeCompliantModalProps {
  readonly close: () => void;
  readonly instances: WindowsInstanceWithoutRelation[];
  readonly isOpen: boolean;
}

const WindowsInstanceMakeCompliantModal: FC<
  WindowsInstanceMakeCompliantModalProps
> = ({ close, instances, isOpen }) => {
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

  const makeCompliant = async () => {
    try {
      throw new Error("This feature has not been implemented yet.");

      notify.success({
        title: `You have successfully marked ${title} to be compliant.`,
        message: pluralize(
          instances.length,
          "An activity has been queued to uninstall, install or reinstall all non-compliant child instances.",
          "Activities have been queued to uninstall, install or reinstall all non-compliant child instances.",
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
      title={`Make ${title} compliant`}
      confirmButtonLabel="Make compliant"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={false}
      confirmButtonLoading={false}
      confirmationText={`make ${title} compliant`}
      onConfirm={makeCompliant}
    >
      <p>This will:</p>
      <ol>
        <li>
          Remove all child instances that haven’t been created by Landscape
        </li>
        <li>
          Install the instances according to the profiles the parent is
          associated with
        </li>
        <li>Reinstall instances that already exist but aren’t compliant</li>
      </ol>
    </TextConfirmationModal>
  );
};

export default WindowsInstanceMakeCompliantModal;
