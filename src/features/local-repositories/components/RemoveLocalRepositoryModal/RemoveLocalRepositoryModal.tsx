import type { FC } from "react";
import type { LocalRepository } from "../../types";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import useNotify from "@/hooks/useNotify";
import { useRemoveLocalRepository } from "../../api";
import { ConfirmationModal } from "@canonical/react-components";
import LocalRepositoryPublicationsList from "../LocalRepositoryPublicationsList";
import useGetPublications from "../../api/useGetPublications";
import LoadingState from "@/components/layout/LoadingState";

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
  const { removeRepository, isRemovingRepository } = useRemoveLocalRepository();
  const { publications, isGettingPublications } = useGetPublications({
    filter: `source=${repository.name}`,
  });

  const noPublicationsText = (
    <p>
      This action will remove the local repository from Landscape and it
      won&apos;t be available to be published in the future.{" "}
      <strong>This action is irreversible.</strong>
    </p>
  );

  const publicationsContent = (
    <>
      <p>This repository is associated with the following publications:</p>
      <LocalRepositoryPublicationsList publications={publications} />
      <p>
        After removal you won&apos;t be able to update any of these
        publications, but they will continue to be available.{" "}
        <strong>This action is irreversible.</strong>
      </p>
    </>
  );

  const content = !publications.length
    ? noPublicationsText
    : publicationsContent;

  const handleRemoveLocalRepository = async () => {
    try {
      await removeRepository({ name: repository.name });

      setPageParams({ sidePath: [], repository: "" });

      notify.success({
        title: `You have successfully removed ${repository.display_name}`,
        message: "The local repository has been removed from Landscape.",
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  if (isGettingPublications) {
    return <LoadingState />;
  }

  if (isOpen) {
    return (
      <ConfirmationModal
        title={`Remove ${repository.display_name}`}
        confirmButtonLabel="Remove local repository"
        confirmButtonAppearance="negative"
        onConfirm={handleRemoveLocalRepository}
        confirmButtonLoading={isRemovingRepository}
        close={close}
        renderInPortal
      >
        {content}
      </ConfirmationModal>
    );
  }

  return null;
};

export default RemoveLocalRepositoryModal;
