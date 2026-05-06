import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import useNotify from "@/hooks/useNotify";
import { useRemoveLocalRepository } from "../../api";
import {
  AssociatedPublicationsList,
  useGetPublicationsBySource,
} from "@/features/publications";
import LoadingState from "@/components/layout/LoadingState";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

interface RemoveLocalRepositoryModalProps {
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly repository: Local;
}

const RemoveLocalRepositoryModal: FC<RemoveLocalRepositoryModalProps> = ({
  close,
  isOpen,
  repository,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { closeSidePanel } = usePageParams();
  const { removeRepository, isRemovingRepository } = useRemoveLocalRepository();
  const { publications, isGettingPublications } = useGetPublicationsBySource(
    repository.name,
  );

  const content = !publications.length ? (
    <p>
      This action will remove the local repository from Landscape and it
      won&apos;t be available to be published in the future.{" "}
      <strong>This action is irreversible.</strong>
    </p>
  ) : (
    <>
      <p>This repository is associated with the following publications:</p>
      <AssociatedPublicationsList
        publications={publications}
        openInNewTab
        showSources={false}
      />
      <br />
      <p>
        After removal you won&apos;t be able to update any of these
        publications, but they will continue to be available.{" "}
        <strong>This action is irreversible.</strong>
      </p>
    </>
  );

  const handleRemoveLocalRepository = async () => {
    try {
      await removeRepository({ name: repository.name ?? "" });

      closeSidePanel();

      notify.success({
        title: `You have successfully removed ${repository.displayName}`,
        message: "The local repository has been removed from Landscape.",
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      title={`Remove ${repository.displayName}`}
      confirmButtonLabel="Remove local repository"
      confirmButtonAppearance="negative"
      onConfirm={handleRemoveLocalRepository}
      confirmButtonLoading={isRemovingRepository}
      close={close}
      renderInPortal
      confirmationText={`remove ${repository.displayName}`}
      isOpen={isOpen}
    >
      {isGettingPublications ? <LoadingState /> : content}
    </TextConfirmationModal>
  );
};

export default RemoveLocalRepositoryModal;
