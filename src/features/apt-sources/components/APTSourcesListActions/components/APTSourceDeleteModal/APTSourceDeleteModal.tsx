import LoadingState from "@/components/layout/LoadingState";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { RepositoryProfile } from "@/features/repository-profiles";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal, ModularTable } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { Column } from "react-table";
import { useCounter } from "usehooks-ts";
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
    count: pageNumber,
    decrement: goToPreviousPage,
    increment: goToNextPage,
  } = useCounter(1);

  const {
    data: getRepositoryProfilesResponse,
    isPending: isGettingRepositoryProfiles,
    error: repositoryProfilesError,
  } = getRepositoryProfilesQuery(
    {
      limit: DEFAULT_MODAL_PAGE_SIZE,
      offset: (pageNumber - 1) * DEFAULT_MODAL_PAGE_SIZE,
      search: aptSource.profiles,
    },
    { enabled: !!aptSource.profiles.length && opened },
  );

  const columns = useMemo<Column<RepositoryProfile>[]>(
    () => [
      {
        Header: "Repository profile",
        accessor: "title",
      },
    ],
    [],
  );

  if (!opened) {
    return;
  }

  if (repositoryProfilesError) {
    throw repositoryProfilesError;
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

  const children = !aptSource.profiles.length ? (
    <p>
      If this APT source is deleted, it will no longer be available to include
      in repository profiles. <strong>This action is irreversible.</strong>
    </p>
  ) : isGettingRepositoryProfiles ? (
    <LoadingState />
  ) : (
    <>
      <p>This APT source belongs to the following repository profiles.</p>
      <p>
        If this source is deleted, it will no longer be included in its
        profiles. <strong>This action is irreversible.</strong>
      </p>
      <ModularTable
        columns={columns}
        data={getRepositoryProfilesResponse.data.results}
      />
      <ModalTablePagination
        current={pageNumber}
        max={Math.ceil(
          getRepositoryProfilesResponse.data.count / DEFAULT_MODAL_PAGE_SIZE,
        )}
        onNext={goToNextPage}
        onPrev={goToPreviousPage}
      />
    </>
  );

  return (
    <ConfirmationModal
      close={close}
      title={`Deleting ${aptSource.name} APT source`}
      confirmButtonLabel="Delete"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemovingAPTSource}
      confirmButtonDisabled={
        !!aptSource.profiles.length && isGettingRepositoryProfiles
      }
      onConfirm={confirm}
    >
      {children}
    </ConfirmationModal>
  );
};

export default APTSourceDeleteModal;
