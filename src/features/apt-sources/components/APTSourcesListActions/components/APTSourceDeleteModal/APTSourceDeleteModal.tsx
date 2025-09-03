import LoadingState from "@/components/layout/LoadingState";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useRemoveAPTSource } from "../../../../api";
import type { APTSource } from "../../../../types";

interface APTSourceDeleteModalProps {
  readonly aptSource: APTSource;
  readonly close: () => void;
  readonly opened?: boolean;
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
    data: getRepositoryProfilesResponse,
    isPending: isGettingRepositoryProfiles,
  } = getRepositoryProfilesQuery(
    { search: aptSource.profiles },
    { enabled: !!aptSource.profiles.length && opened },
  );

  if (!opened) {
    return;
  }

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
    <ConfirmationModal
      close={close}
      title={`Deleting ${aptSource.name} APT source`}
      confirmButtonLabel="Delete"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemovingAPTSource}
      confirmButtonDisabled={
        isRemovingAPTSource ||
        (!!aptSource.profiles.length && isGettingRepositoryProfiles)
      }
      onConfirm={confirm}
    >
      {!aptSource.profiles.length ? (
        <p>
          If this APT source is deleted, it will no longer be available to
          include in repository profiles.{" "}
          <strong>This action is irreversible.</strong>
        </p>
      ) : isGettingRepositoryProfiles ? (
        <LoadingState />
      ) : (
        <>
          <p>This APT source belongs to the following repository profiles:</p>
          <ul>
            {getRepositoryProfilesResponse?.data.results.map(
              (repositoryProfile) => (
                <li key={repositoryProfile.id}>{repositoryProfile.title}</li>
              ),
            )}
          </ul>
          <p>
            If this source is deleted, it will no longer be included in its
            profiles. <strong>This action is irreversible.</strong>
          </p>
        </>
      )}
    </ConfirmationModal>
  );
};

export default APTSourceDeleteModal;
