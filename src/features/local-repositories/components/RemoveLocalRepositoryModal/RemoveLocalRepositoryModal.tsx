import type { FC } from "react";
import type { LocalRepository } from "../../types";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import useNotify from "@/hooks/useNotify";
import { useRemoveLocalRepository } from "../../api";
import { ConfirmationModal } from "@canonical/react-components";
import LocalRepositoryPublicationsList from "../LocalRepositoryPublicationsList";

interface RemoveLocalRepositoryModalProps {
  readonly isOpen: boolean;
  readonly close: () => void;
  readonly repository: LocalRepository;
}

const RemoveLocalRepositoryModal: FC<RemoveLocalRepositoryModalProps> = ({
  isOpen,
  close,
  repository,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { setPageParams } = usePageParams();
  const { removeLocalRepository, isRemovingLocalRepository } = useRemoveLocalRepository();

  const handleRemoveLocalRepository = async () => {
    try {
      await removeLocalRepository({
        name: repository.name,
      });

      setPageParams({ sidePath: [], repository: "" });

      notify.success({
        title: `Local repository removed`,
        message: `You have successfully removed "${repository.display_name}" local repository.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  if (isOpen) {
    return (
      <ConfirmationModal
        title={`Local repository`}
        confirmButtonLabel="Remove local repository"
        confirmButtonAppearance="negative"
        onConfirm={handleRemoveLocalRepository}
        confirmButtonDisabled={isRemovingLocalRepository}
        confirmButtonLoading={isRemovingLocalRepository}
        close={close}
        renderInPortal
      >
        <p>
          This repository is associated with the following publications:
        </p>
        <LocalRepositoryPublicationsList repository={repository} />
        <p>
          After removal you won&apos;t be able to update any of these publications, but they will continue to be available. This action is <strong>irreversible</strong>.
        </p>
      </ConfirmationModal>
    );
  }

  return null;
};

export default RemoveLocalRepositoryModal;
