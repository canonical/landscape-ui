import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { type FC } from "react";
import { useCounter } from "usehooks-ts";
import { useRemoveAPTSource } from "../../../../api";
import type { APTSource } from "../../../../types";
import APTSourceDeleteModalList from "./components/APTSourceDeleteModalList";

export interface APTSourceDeleteModalProps {
  readonly aptSource: APTSource;
  readonly close: () => void;
  readonly opened: boolean;
}

const APTSourceDeleteModal: FC<APTSourceDeleteModalProps> = ({
  aptSource,
  close,
  opened,
}) => {
  const { removeAPTSource, isRemovingAPTSource } = useRemoveAPTSource();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();
  const debug = useDebug();
  const { notify } = useNotify();

  const {
    count: pageNumber,
    decrement: goToPreviousPage,
    increment: goToNextPage,
  } = useCounter(1);

  const repositoryProfilesResult = getRepositoryProfilesQuery(
    {
      limit: DEFAULT_MODAL_PAGE_SIZE,
      offset: (pageNumber - 1) * DEFAULT_MODAL_PAGE_SIZE,
      search: aptSource.profiles,
    },
    { enabled: !!aptSource.profiles.length && opened },
  );

  const confirm = async () => {
    try {
      await removeAPTSource({ id: aptSource.id, disassociate_profiles: true });

      notify.success({
        title: `You have successfully deleted the ${aptSource.name} APT source.`,
        message: aptSource.profiles.length
          ? "It will no longer be available and it has been removed from its associated profiles."
          : "It will no longer be available to include in repository profiles.",
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      className="is-narrow"
      close={close}
      title={`Deleting ${aptSource.name} APT source`}
      confirmButtonLabel="Delete"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemovingAPTSource}
      confirmButtonDisabled={
        !!aptSource.profiles.length && repositoryProfilesResult.isPending
      }
      onConfirm={confirm}
      isOpen={opened}
      confirmationText={`delete ${aptSource.name}`}
    >
      {aptSource.profiles.length ? (
        <>
          <p>This APT source belongs to the following repository profiles.</p>
          <p>
            If this source is deleted, it will no longer be included in its
            profiles. <strong>This action is irreversible.</strong>
          </p>
          <APTSourceDeleteModalList
            repositoryProfilesResult={repositoryProfilesResult}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            pageNumber={pageNumber}
          />
        </>
      ) : (
        <p>
          If this APT source is deleted, it will no longer be available to
          include in repository profiles.{" "}
          <strong>This action is irreversible.</strong>
        </p>
      )}
    </TextConfirmationModal>
  );
};

export default APTSourceDeleteModal;
