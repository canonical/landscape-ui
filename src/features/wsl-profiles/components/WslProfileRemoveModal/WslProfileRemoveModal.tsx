import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { ComponentProps, FC } from "react";
import { useDeleteWslProfile } from "../../api";
import type { WslProfile } from "../../types";

interface WslProfileRemoveModalProps
  extends Omit<
    ComponentProps<typeof TextConfirmationModal>,
    "children" | "confirmationText" | "confirmButtonLabel" | "onConfirm"
  > {
  readonly wslProfile: WslProfile;
}

const WslProfileRemoveModal: FC<WslProfileRemoveModalProps> = ({
  wslProfile,
  ...props
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { deleteWslProfile, isDeletingWslProfile } = useDeleteWslProfile();

  const handleRemoveWslProfile = async () => {
    try {
      await deleteWslProfile({ name: wslProfile.name });

      setPageParams({ action: "", wslProfile: "" });

      notify.success({
        message: "Instances created by this profile won't be affected.",
        title: `You have successfully removed ${wslProfile.title}.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      props.close();
    }
  };

  return (
    <>
      <TextConfirmationModal
        title={`Remove ${wslProfile.title}`}
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isDeletingWslProfile}
        confirmButtonLoading={isDeletingWslProfile}
        onConfirm={handleRemoveWslProfile}
        confirmationText={`remove ${wslProfile.title}`}
        {...props}
      >
        <p>
          Removing this profile will not remove the WSL child instances
          associated with it. <strong>This action is irreversible.</strong>
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default WslProfileRemoveModal;
