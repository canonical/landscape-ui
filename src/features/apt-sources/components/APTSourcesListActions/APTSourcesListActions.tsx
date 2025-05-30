import ListActions from "@/components/layout/ListActions";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import useDebug from "@/hooks/useDebug";
import { ConfirmationModal, ICONS, Spinner } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useAPTSources } from "../../hooks";
import type { APTSource } from "../../types";

interface APTSourcesListActionsProps {
  readonly aptSource: APTSource;
}

const APTSourcesListActions: FC<APTSourcesListActionsProps> = ({
  aptSource,
}) => {
  const debug = useDebug();

  const { removeAPTSourceQuery } = useAPTSources();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const {
    data: getRepositoryProfilesQueryResult,
    isLoading: isGettingRepositoryProfiles,
  } = getRepositoryProfilesQuery();

  const repositoryProfiles =
    getRepositoryProfilesQueryResult?.data.results ?? [];

  const { mutateAsync: remove, isPending: isRemoving } = removeAPTSourceQuery;

  const tryRemove = async () => {
    try {
      await remove({ name: aptSource.name });
    } catch (error) {
      debug(error);
    }

    closeModal();
  };

  if (isGettingRepositoryProfiles) {
    return <Spinner className="u-float-right u-no-padding--top" />;
  }

  return (
    <>
      <ListActions
        toggleAriaLabel={`${aptSource.name} APT source actions`}
        destructiveActions={[
          {
            icon: ICONS.delete,
            label: "Delete",
            "aria-label": `Remove ${aptSource.name} APT source`,
            onClick: openModal,
            disabled: repositoryProfiles.some((profile) =>
              profile.apt_sources.includes(aptSource.id),
            ),
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          close={closeModal}
          title={`Deleting ${aptSource.name} APT source`}
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonLoading={isRemoving}
          confirmButtonDisabled={isRemoving}
          onConfirm={tryRemove}
        >
          <p>Are you sure? This action is permanent and cannot be undone.</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default APTSourcesListActions;
